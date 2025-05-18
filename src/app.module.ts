import { join } from 'path';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { WeatherModule } from './weather/weather.module';
import { ApiClientModule } from './common/api-client/api-client.module';
import { ApiClientOptions } from './common/api-client/api-client.interface';
import { SubscriptionEntity } from './subscription/entities';
import { SubscriptionModule } from './subscription/subscription.module';
import { ScheduleModule } from './schedule/schedule.module';

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
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_DATABASE'),
        entities: [SubscriptionEntity],
        synchronize: true,
      }),
    }),
    // MailerModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => ({
    //     transport: {
    //       host: config.get<string>('MAILJET_SMTP_HOST'),
    //       port: config.get<number>('MAILJET_SMTP_PORT'),
    //       secure: config.get<string>('SMTP_SECURE') === 'true',
    //       auth: {
    //         user: config.get<string>('MAILJET_SMTP_KEY'),
    //         pass: config.get<string>('MAILJET_SMTP_SECRET'),
    //       },
    //     },
    //     defaults: {
    //       from: '"Weather API" <no-reply@weatherapi.app>',
    //     },
    //     template: {
    //       dir: join(__dirname, 'assets/templates'),
    //       adapter: new HandlebarsAdapter(),
    //       options: { strict: true },
    //     },
    //   }),
    // }),
    WeatherModule,
    ScheduleModule,
    SubscriptionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
