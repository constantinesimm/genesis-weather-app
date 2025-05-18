import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
//import { MailerModule } from '@nestjs-modules/mailer';

import { SubscriptionEntity } from './entities';

import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';

import { WeatherModule } from '../weather/weather.module';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionEntity]), WeatherModule],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
