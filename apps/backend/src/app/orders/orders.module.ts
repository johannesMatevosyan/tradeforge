import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { OrdersExecutionService } from './orders-execution.service';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [AuthModule, NotificationsModule],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersExecutionService],
  exports: [OrdersService, OrdersExecutionService],
})
export class OrdersModule {}
