import { Module } from '@nestjs/common';
import { PositionsController } from './positions.controller';
import { PositionsService } from './positions.service';

@Module({
  providers: [PositionsService],
  controllers: [PositionsController],
})
export class PositionsModule {}
