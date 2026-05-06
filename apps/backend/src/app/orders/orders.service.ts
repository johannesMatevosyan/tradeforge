import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { OrderSide, OrderStatus, OrderType } from '@prisma/generated';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';


@Injectable()
export class OrdersService {
    constructor(
      private readonly prismaService: PrismaService,
      private readonly notificationsService: NotificationsService
    ) {}

    async findAll(userId: string): Promise<OrderResponseDto[]> {

      const orders = await this.prismaService.order.findMany({
        where: {
          userId,
        },
        include: {
          symbol: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return orders.map((order) => this.toResponseDto(order));
    }

    async findOne(userId: string, id: string): Promise<OrderResponseDto> {

      const order = await this.prismaService.order.findFirst({
        where: {
          id,
          userId,
        },
        include: {
          symbol: true,
        },
      });

      if (!order) {
        throw new NotFoundException(`Order with id "${id}" not found.`);
      }

      return this.toResponseDto(order);
    }

    async create(userId: string, payload: CreateOrderDto): Promise<OrderResponseDto> {
      const normalizedCode = payload.symbol.toUpperCase();

      this.validateQuantity(payload.quantity);
      this.validatePrice(payload.price, payload.type);

      const symbol = await this.prismaService.symbol.findUnique({
        where: {
          code: normalizedCode,
        },
      });

      if (!symbol) {
        throw new NotFoundException(
          `Symbol with code "${normalizedCode}" not found.`,
        );
      }

      if (!symbol.isActive) {
        throw new BadRequestException(
          `Symbol "${normalizedCode}" is inactive.`,
        );
      }

      const createdOrder = await this.prismaService.order.create({
        data: {
          userId,
          symbolId: symbol.id,
          side: payload.side as OrderSide,
          type: payload.type as OrderType,
          quantity: payload.quantity,
          price: payload.type === 'LIMIT' ? payload.price : null,
          status:
            payload.type === 'MARKET'
              ? OrderStatus.FILLED
              : OrderStatus.OPEN,
        },
        include: {
          symbol: true,
        },
      });

      await this.notificationsService.create({
        userId,
        type: 'order',
        title: 'Order placed',
        message: `${createdOrder.side} ${createdOrder.quantity} ${createdOrder.symbol.code}`,
        meta: {
          orderId: createdOrder.id,
          symbol: createdOrder.symbol.code,
          side: createdOrder.side,
        },
      });

      return this.toResponseDto(createdOrder);
    }

    async cancel(userId: string, id: string): Promise<OrderResponseDto> {

      const existingOrder = await this.prismaService.order.findFirst({
        where: {
          id,
          userId,
        },
        include: {
          symbol: true,
        },
      });

      if (!existingOrder) {
        throw new NotFoundException(`Order with id "${id}" not found.`);
      }

      if (existingOrder.status !== OrderStatus.OPEN) {
        throw new BadRequestException('Only OPEN orders can be cancelled.');
      }

      const updatedOrder = await this.prismaService.order.update({
        where: {
          id,
        },
        data: {
          status: OrderStatus.CANCELLED,
        },
        include: {
          symbol: true,
        },
      });

      await this.notificationsService.create({
        userId,
        type: 'order',
        title: 'Order cancelled',
        message: `${updatedOrder.side} ${updatedOrder.quantity} ${updatedOrder.symbol.code}`,
        meta: {
            orderId: updatedOrder.id,
            symbol: updatedOrder.symbol.code,
            side: updatedOrder.side,
          },
      });

      return this.toResponseDto(updatedOrder);
    }

    private validateQuantity(quantity: string): void {
      const parsedQuantity = Number(quantity);

      if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
        throw new BadRequestException('Quantity must be greater than 0.');
      }

      if (parsedQuantity < 0.0001) {
        throw new BadRequestException('Quantity must be at least 0.0001.');
      }
    }

    private validatePrice(price: string | undefined, type: CreateOrderDto['type']): void {
      if (type === 'MARKET' && price) {
        throw new BadRequestException('Price must not be provided for MARKET orders.');
      }

      if (type === 'LIMIT') {
        if (!price) {
          throw new BadRequestException('Price is required for LIMIT orders.');
        }

        const parsedPrice = Number(price);

        if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
          throw new BadRequestException('Price must be greater than 0.');
        }
      }
    }

    private toResponseDto(order: {
      id: string;
      symbolId: string;
      side: string;
      type: string;
      quantity: unknown;
      price: unknown;
      status: string;
      symbol: {
        code: string;
        description: string | null;
        baseAsset: string;
        quoteAsset: string;
        isActive: boolean;
      };
    }): OrderResponseDto {
      const displayName =
        order.symbol.description?.trim() ||
        `${order.symbol.baseAsset} / ${order.symbol.quoteAsset}`;

      return {
        id: order.id,
        symbolId: order.symbolId,
        symbol: order.symbol.code,
        displayName,
        side: order.side,
        type: order.type,
        quantity: String(order.quantity),
        price: order.price == null ? null : String(order.price),
        status: order.status,
        isActive: order.symbol.isActive,
      };
    }
}
