import { ConfigService } from '@nestjs/config';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ApiClientService } from '../common/api-client/api-client.service';

@Injectable()
export class WeatherService {
  private readonly apiKey: string;

  constructor(
    private readonly apiClient: ApiClientService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('WEATHERAPI_KEY')!;
  }

  async getCurrent(city: string) {
    try {
      // Використовуємо ApiClientService для запиту
      const data = await this.apiClient.get<any>(
        `/current.json?key=${this.apiKey}&q=${encodeURIComponent(city)}`,
      );

      return {
        temperature: data.current.temp_c,
        humidity: data.current.humidity,
        description: data.current.condition.text,
      };
    } catch (e: any) {
      const status = e.response?.status;
      if (status === 400)
        throw new HttpException('Invalid request', HttpStatus.BAD_REQUEST);
      if (status === 404)
        throw new HttpException('City not found', HttpStatus.NOT_FOUND);
      throw new HttpException(
        'WeatherAPI error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
