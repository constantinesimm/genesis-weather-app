import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetWeatherDto {
  @ApiProperty({ description: 'City name for weather forecast' })
  @IsString()
  city: string;
}
