import { Module } from '@nestjs/common';

import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { ApiClientModule } from '../common/api-client/api-client.module';

@Module({
  imports: [ApiClientModule],
  providers: [WeatherService],
  controllers: [WeatherController],
})
export class WeatherModule {}
