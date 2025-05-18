import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Cron, CronExpression } from '@nestjs/schedule';

import { SubscriptionEntity, EFrequency } from '../subscription/entities';
import { WeatherService } from '../weather/weather.service';

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);

  constructor(
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: Repository<SubscriptionEntity>,
    private readonly weatherService: WeatherService,
    //private mailer: MailerService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleHourly() {
    await this.sendWeatherUpdates(EFrequency.HOURLY);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDaily() {
    await this.sendWeatherUpdates(EFrequency.DAILY);
  }

  private async sendWeatherUpdates(frequency: EFrequency) {
    const subs = await this.subscriptionRepository.find({
      where: { confirmed: true, frequency },
    });

    for (const s of subs) {
      const weather = await this.weatherService.getCurrent(s.city);

      // await this.mailer.sendMail({
      //   to: s.email,
      //   subject: `Weather update for ${s.city}`,
      //   text: `Temperature: ${weather.temperature}°C, Humidity: ${weather.humidity}%, ${weather.description}`,
      // });

      this.logger.log(`Sent ${frequency} update to ${s.email}`);
    }
  }
}
