import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { OrderSide, OrderStatus, OrderType } from 'generated/prisma/enums';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, OrderTypeDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';

@Injectable()
export class OrdersService {
      constructor(private readonly prismaService: PrismaService) {}

  private readonly demoUserEmail = 'demo@tradeforge.local';

  async findAll(): Promise<OrderResponseDto[]> {
    const user = await this.getDemoUser();

    const orders = await this.prismaService.order.findMany({
      where: { userId: user.id },
      include: { symbol: true },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((order) => this.toResponseDto(order));
  }

  async findOne(id: string): Promise<OrderResponseDto> {
    const user = await this.getDemoUser();

    const order = await this.prismaService.order.findFirst({
      where: { id, userId: user.id },
      include: { symbol: true },
    });

    if (!order) {
      throw new NotFoundException(`Order with id "${id}" not found.`);
    }

    return this.toResponseDto(order);
  }

  async create(payload: CreateOrderDto): Promise<OrderResponseDto> {
    const user = await this.getDemoUser();
    const normalizedCode = payload.symbolCode.toUpperCase();

    const symbol = await this.prismaService.symbol.findUnique({
      where: { code: normalizedCode },
    });

    if (!symbol) {
      throw new NotFoundException(`Symbol with code "${normalizedCode}" not found.`);
    }

    if (!symbol.isActive) {
      throw new BadRequestException(`Symbol "${normalizedCode}" is inactive.`);
    }

    if (payload.type === OrderTypeDto.LIMIT && !payload.price) {
      throw new BadRequestException('Price is required for LIMIT orders.');
    }

    const created = await this.prismaService.order.create({
      data: {
        userId: user.id,
        symbolId: symbol.id,
        side: payload.side as OrderSide,
        type: payload.type as OrderType,
        quantity: payload.quantity,
        price: payload.price ?? null,
        status: OrderStatus.OPEN,
      },
      include: { symbol: true },
    });

    return this.toResponseDto(created);
  }

  async cancel(id: string): Promise<OrderResponseDto> {
    const user = await this.getDemoUser();

    const existing = await this.prismaService.order.findFirst({
      where: { id, userId: user.id },
      include: { symbol: true },
    });

    if (!existing) {
      throw new NotFoundException(`Order with id "${id}" not found.`);
    }

    if (existing.status !== OrderStatus.OPEN) {
      throw new BadRequestException('Only OPEN orders can be cancelled.');
    }

    const updated = await this.prismaService.order.update({
      where: { id },
      data: { status: OrderStatus.CANCELLED },
      include: { symbol: true },
    });

    return this.toResponseDto(updated);
  }

  private async getDemoUser() {
    const user = await this.prismaService.user.findUnique({
      where: { email: this.demoUserEmail },
    });

    if (!user) {
      throw new NotFoundException('Demo user not found.');
    }

    return user;
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
        symbolCode: order.symbol.code,
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
