import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TokenParamDto {
  @ApiProperty({
    description: 'Confirmation or unsubscribe token',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    format: 'uuid',
  })
  @IsUUID()
  token: string;
}