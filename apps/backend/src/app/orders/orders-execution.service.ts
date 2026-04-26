import { Injectable } from '@nestjs/common';
import { OrderSide, OrderStatus, OrderType } from '@prisma/generated';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersExecutionService {
  constructor(private readonly prismaService: PrismaService) {}

  async executeLimitOrdersForPriceUpdate(
    symbolCode: string,
    marketPrice: number,
  ): Promise<void> {
    const openLimitOrders = await this.prismaService.order.findMany({
      where: {
        status: OrderStatus.OPEN,
        type: OrderType.LIMIT,
        symbol: {
          code: symbolCode,
        },
      },
    });

    const ordersToFill = openLimitOrders.filter((order) => {
      const limitPrice = Number(order.price);

      if (!Number.isFinite(limitPrice)) {
        return false;
      }

      if (order.side === OrderSide.BUY) {
        return marketPrice <= limitPrice;
      }

      if (order.side === OrderSide.SELL) {
        return marketPrice >= limitPrice;
      }

      return false;
    });

    if (ordersToFill.length === 0) {
      return;
    }

    await this.prismaService.order.updateMany({
      where: {
        id: {
          in: ordersToFill.map((order) => order.id),
        },
      },
      data: {
        status: OrderStatus.FILLED,
      },
    });
  }
}
