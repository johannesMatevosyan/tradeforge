import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AnalyticsService } from './analytics.service';

@ApiTags('analytics')
@ApiBearerAuth('access-token')
@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  getOverview(@CurrentUser() user: { id: string }) {
    return this.analyticsService.getOverview(user.id);
  }

  @Get('activity')
  getActivity(@CurrentUser() user: { id: string }) {
    return this.analyticsService.getActivity(user.id);
  }

  @Get('symbols')
  getSymbols(@CurrentUser() user: { id: string }) {
    return this.analyticsService.getSymbols(user.id);
  }
}
