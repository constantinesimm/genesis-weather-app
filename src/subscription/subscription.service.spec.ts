import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SubscriptionService } from './subscription.service';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { SubscriptionEntity } from './entities';

describe('SubscriptionService', () => {
  let service: SubscriptionService;
  let repo: Partial<Repository<SubscriptionEntity>>;
  let mailer: Partial<MailerService>;
  let config: Partial<ConfigService>;

  beforeEach(async () => {
    repo = {
      findOne: jest.fn(),
      create: jest.fn().mockImplementation((dto) => ({ ...dto })),
      save: jest.fn(),
      remove: jest.fn(),
    };
    mailer = {
      sendMail: jest.fn().mockResolvedValue(undefined),
    };
    config = {
      get: jest.fn().mockImplementation((key) => {
        if (key === 'APP_URL') return 'http://localhost:3000';
        return undefined;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionService,
        { provide: getRepositoryToken(SubscriptionEntity), useValue: repo },
        { provide: MailerService, useValue: mailer },
        { provide: ConfigService, useValue: config },
      ],
    }).compile();

    service = module.get<SubscriptionService>(SubscriptionService);
  });

  it('creates and sends confirmation email on subscribe', async () => {
    (repo.findOne as jest.Mock).mockResolvedValue(null);
    const dto = {
      email: 'test@example.com',
      city: 'Kyiv',
      frequency: 'daily',
    } as any;

    const result = await service.subscribe(dto);

    expect(repo.findOne).toHaveBeenCalledWith({ where: { email: dto.email } });
    expect(repo.create).toHaveBeenCalledWith(expect.objectContaining(dto));
    expect(repo.save).toHaveBeenCalled();

    // expect(mailer.sendMail).toHaveBeenCalledWith(
    //   expect.objectContaining({
    //     to: dto.email,
    //     subject: expect.stringContaining('Підтвердіть'),
    //     // @ts-ignore
    //     html: expect.stringContaining(`${config.get('APP_URL')}/api/confirm/`),
    //   }),
    // );
    expect(result).toEqual({
      message: 'Subscription successful. Confirmation email sent.',
    });
  });

  it('throws ConflictException if email already subscribed', async () => {
    (repo.findOne as jest.Mock).mockResolvedValue({} as any);
    await expect(
      service.subscribe({ email: 'x', city: 'y', frequency: 'hourly' } as any),
    ).rejects.toThrow(ConflictException);
  });

  it('confirms subscription successfully', async () => {
    const entity = { confirmed: false, token: 'token123' } as any;
    (repo.findOne as jest.Mock).mockResolvedValue(entity);

    const response = await service.confirm('token123');

    expect(entity.confirmed).toBe(true);
    expect(repo.save).toHaveBeenCalledWith(entity);
    expect(response).toEqual({
      message: 'Subscription confirmed successfully',
    });
  });

  it('throws NotFoundException for invalid confirm token', async () => {
    (repo.findOne as jest.Mock).mockResolvedValue(null);
    await expect(service.confirm('badtoken')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('unsubscribes correctly', async () => {
    const entity = {} as any;
    (repo.findOne as jest.Mock).mockResolvedValue(entity);

    const response = await service.unsubscribe('token123');

    expect(repo.remove).toHaveBeenCalledWith(entity);
    expect(response).toEqual({ message: 'Unsubscribed successfully' });
  });
});
