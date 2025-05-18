import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString } from 'class-validator';

import { EFrequency } from '../entities';

export class SubscribeDto {
  @ApiProperty({
    description: 'Email address to subscribe',
    example: 'example@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'City for weather updates', example: 'kyiv' })
  @IsString()
  city: string;

  @ApiProperty({ enum: EFrequency })
  @IsEnum(EFrequency)
  frequency: EFrequency;
}
