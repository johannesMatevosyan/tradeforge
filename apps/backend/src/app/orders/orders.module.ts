import { Module } from '@nestjs/common';
import { OrdersExecutionService } from './orders-execution.service';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, OrdersExecutionService],
  exports: [OrdersService, OrdersExecutionService],
})
export class OrdersModule {}
