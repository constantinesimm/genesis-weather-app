// src/weather/weather.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { ApiClientService } from '../common/api-client/api-client.service';
import { WeatherService } from './weather.service';
import { HttpException } from '@nestjs/common';

describe('WeatherService', () => {
  let service: WeatherService;
  let apiClient: Partial<ApiClientService>;
  let config: Partial<ConfigService>;

  beforeEach(async () => {
    apiClient = {
      get: jest.fn(),
    };
    config = {
      get: jest.fn().mockReturnValue('dummy-key'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        { provide: ApiClientService, useValue: apiClient },
        { provide: ConfigService, useValue: config },
      ],
    }).compile();

    service = module.get<WeatherService>(WeatherService);
  });

  it('should return formatted weather on success', async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({
      current: { temp_c: 25, humidity: 60, condition: { text: 'Sunny' } },
    });

    const result = await service.getCurrent('Kyiv');
    expect(result).toEqual({
      temperature: 25,
      humidity: 60,
      description: 'Sunny',
    });
    expect(apiClient.get).toHaveBeenCalledWith(
      `/current.json?key=dummy-key&q=Kyiv`,
    );
  });

  it('should throw 400 on invalid city', async () => {
    const err = { response: { status: 400 } };
    (apiClient.get as jest.Mock).mockRejectedValue(err);

    await expect(service.getCurrent('')).rejects.toThrow(HttpException);
    await expect(service.getCurrent('')).rejects.toMatchObject({
      status: 400,
      response: 'Invalid request',
    });
  });

  it('should throw 404 on not found', async () => {
    const err = { response: { status: 404 } };
    (apiClient.get as jest.Mock).mockRejectedValue(err);

    await expect(service.getCurrent('Atlantis')).rejects.toThrow(HttpException);
    await expect(service.getCurrent('Atlantis')).rejects.toMatchObject({
      status: 404,
      response: 'City not found',
    });
  });

  it('should throw 500 on other errors', async () => {
    (apiClient.get as jest.Mock).mockRejectedValue(new Error('oops'));

    await expect(service.getCurrent('Kyiv')).rejects.toThrow(HttpException);
    await expect(service.getCurrent('Kyiv')).rejects.toMatchObject({
      status: 500,
      response: 'WeatherAPI error',
    });
  });
});
