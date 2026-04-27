import { Controller, Get } from '@nestjs/common';
import { PositionsService } from './positions.service';

@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Get()
  getPositions() {
    return this.positionsService.getPositions();
  }
}
