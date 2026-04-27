import { Injectable } from '@nestjs/common';
import { OrderStatus } from '@prisma/generated';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PositionsService {
    constructor(private readonly prisma: PrismaService) {}

    async getPositions() {
        const filledOrders = await this.prisma.order.findMany({
            where: {
                status: OrderStatus.FILLED,
            },
            include: {
                symbol: true,
            },
        });

        const map = new Map<string, {
            symbol: string;
            quantity: number;
            totalCost: number;
        }>();

        for (const order of filledOrders) {
            const key = order.symbol.code;
            const qty = Number(order.quantity);
            const price = Number(order.price ?? 0);

            if (!map.has(key)) {
                map.set(key, {
                    symbol: key,
                    quantity: 0,
                    totalCost: 0,
                });
            }

            const pos = map.get(key)!;

            if (order.side === 'BUY') {
                pos.quantity += qty;
                pos.totalCost += qty * price;
            } else if (order.side === 'SELL') {
                pos.quantity -= qty;
                pos.totalCost -= qty * price;
            }
        }

        return Array.from(map.values())
            .filter((p) => p.quantity > 0)
            .map((p) => ({
                symbol: p.symbol,
                quantity: p.quantity,
                avgPrice: p.totalCost / p.quantity,
            }));
    }
}
