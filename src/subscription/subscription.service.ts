import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
//import { MailerService } from '@nestjs-modules/mailer';

import { SubscribeDto } from './dto';
import { SubscriptionEntity } from './entities';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: Repository<SubscriptionEntity>,
    //private mailer: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async subscribe(dto: SubscribeDto) {
    const exists = await this.subscriptionRepository.findOne({
      where: { email: dto.email },
    });
    if (exists) throw new ConflictException('Email already subscribed');

    const token = uuidv4();
    const sub = this.subscriptionRepository.create({ ...dto, token });
    await this.subscriptionRepository.save(sub);

    // const appUrl = `${this.configService.get<string>('APP_HOST')}:this.configService.get<number>('APP_PORT')`;
    // const confirmUrl = `${appUrl.replace(/\/+$/, '')}/api/confirm/${token}`;
    //
    // await this.mailer.sendMail({
    //   to: dto.email,
    //   subject: 'Підтвердіть підписку на Weather API',
    //   text: `Щоб підтвердити підписку, перейдіть за посиланням: ${confirmUrl}`,
    //   html: `
    //     <p>Вітаємо!</p>
    //     <p>Щоб підтвердити підписку на оновлення погоди, натисніть на посилання нижче:</p>
    //     <p><a href="${confirmUrl}">Підтвердити підписку</a></p>
    //     <p>Якщо ви не реєструвалися, просто проігноруйте це повідомлення.</p>
    //   `,
    // });

    return { message: 'Subscription successful. Confirmation email sent.' };
  }

  async confirm(token: string) {
    const sub = await this.subscriptionRepository.findOne({ where: { token } });
    if (!sub) throw new NotFoundException('Token not found');
    if (sub.confirmed) throw new BadRequestException('Already confirmed');

    sub.confirmed = true;
    await this.subscriptionRepository.save(sub);

    return { message: 'Subscription confirmed successfully' };
  }

  async unsubscribe(token: string) {
    const sub = await this.subscriptionRepository.findOne({ where: { token } });
    if (!sub) throw new NotFoundException('Token not found');

    await this.subscriptionRepository.remove(sub);

    return { message: 'Unsubscribed successfully' };
  }
}
