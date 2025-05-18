import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiQuery, ApiResponse } from '@nestjs/swagger';

import { GetWeatherDto } from './dto';
import { WeatherService } from './weather.service';

@ApiTags('weather')
@Controller('api/weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  @ApiQuery({ name: 'city', required: true, type: String })
  @ApiResponse({
    status: 200,
    description: 'Successful operation - current weather forecast returned',
    schema: {
      properties: {
        temperature: { type: 'number' },
        humidity: { type: 'number' },
        description: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 404, description: 'City not found' })
  getWeather(@Query() dto: GetWeatherDto) {
    return this.weatherService.getCurrent(dto.city);
  }
}
