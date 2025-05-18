import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionEntity } from '../subscription/entities';
import { WeatherModule } from '../weather/weather.module';
import { WeatherService } from '../weather/weather.service';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionEntity]), WeatherModule],
  providers: [ScheduleService, WeatherService],
})
export class ScheduleModule {}
