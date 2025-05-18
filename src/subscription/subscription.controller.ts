import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiConsumes } from '@nestjs/swagger';

import { SubscribeDto, TokenParamDto } from './dto';
import { SubscriptionService } from './subscription.service';

@ApiTags('Subscription')
@Controller('api')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('subscribe')
  @ApiConsumes('application/json', 'application/x-www-form-urlencoded')
  @ApiResponse({
    status: 200,
    description: 'Subscription successful. Confirmation email sent.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 409, description: 'Email already subscribed' })
  subscribe(@Body() dto: SubscribeDto) {
    return this.subscriptionService.subscribe(dto);
  }

  @Get('confirm/:token')
  @ApiResponse({
    status: 200,
    description: 'Subscription confirmed successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid token' })
  @ApiResponse({ status: 404, description: 'Token not found' })
  confirm(@Param() params: TokenParamDto) {
    return this.subscriptionService.confirm(params.token);
  }

  @Get('unsubscribe/:token')
  @ApiResponse({ status: 200, description: 'Unsubscribed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid token' })
  @ApiResponse({ status: 404, description: 'Token not found' })
  unsubscribe(@Param() params: TokenParamDto) {
    return this.subscriptionService.unsubscribe(params.token);
  }
}
