import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { WeatherModule } from './weather/weather.module';
import { ApiClientModule } from './common/api-client/api-client.module';
import { ApiClientOptions } from './common/api-client/api-client.interface';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ApiClientModule.forRootAsync({
      imports: [ConfigModule],
      // Явно вказуємо, що повертаємо ApiClientOptions
      useFactory: (config: ConfigService): ApiClientOptions => {
        const baseUrl = config.get<string>('WEATHERAPI_URL');
        if (!baseUrl) {
          throw new Error('ENV variable WEATHER_API_URL must be defined');
        }
        return {
          baseUrl,
          timeout: config.get<number>('API_TIMEOUT', 5000),
        };
      },
      inject: [ConfigService],
    }),
    WeatherModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
