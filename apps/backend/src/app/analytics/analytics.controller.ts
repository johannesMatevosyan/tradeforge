import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  getOverview(@Req() req: Request & { user: { userId: string } }) {
    return this.analyticsService.getOverview(req.user.userId);
  }

  @Get('activity')
  getActivity(@Req() req: Request & { user: { userId: string } }) {
    return this.analyticsService.getActivity(req.user.userId);
  }

  @Get('symbols')
  getSymbols(@Req() req: Request & { user: { userId: string } }) {
    return this.analyticsService.getSymbols(req.user.userId);
  }
}
