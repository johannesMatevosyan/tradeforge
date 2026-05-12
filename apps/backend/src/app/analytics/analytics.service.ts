import { Injectable } from '@nestjs/common';
import { PositionsService } from '../positions/positions.service';
import { PrismaService } from '../prisma/prisma.service';
import { AnalyticsActivityDto } from './dto/analytics-activity.dto';
import { AnalyticsOverviewDto } from './dto/analytics-overview.dto';
import { SymbolAnalyticsDto } from './dto/symbol-analytics.dto';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService, private readonly positionsService: PositionsService) {}

    async getOverview(userId: string): Promise<AnalyticsOverviewDto> {
        const [totalTrades, positions] = await Promise.all([
            this.prisma.order.count({
                where: { userId },
            }),
            this.positionsService.getPositions(userId),
        ]);

        return {
            totalTrades,
            openPositions: positions.length,
            closedPositions: 0,
            realizedPnl: 0,
            unrealizedPnl: 0,
        };
    }

    async getActivity(userId: string): Promise<AnalyticsActivityDto> {
        const [buyOrders, sellOrders, filledOrders, openOrders] = await Promise.all([
        this.prisma.order.count({
            where: {
            userId,
            side: 'BUY',
            },
        }),
        this.prisma.order.count({
            where: {
            userId,
            side: 'SELL',
            },
        }),
        this.prisma.order.count({
            where: {
            userId,
            status: 'FILLED',
            },
        }),
        this.prisma.order.count({
            where: {
            userId,
            status: 'OPEN',
            },
        }),
        ]);

        return {
            buyOrders,
            sellOrders,
            filledOrders,
            openOrders,
        };
    }

    async getSymbols(userId: string): Promise<SymbolAnalyticsDto[]> {
        const orders = await this.prisma.order.findMany({
            where: { userId },
            select: {
                symbol: true,
                side: true,
                quantity: true,
            },
        });

        const map = new Map<string, SymbolAnalyticsDto>();

        for (const order of orders) {
            const symbolCode = order.symbol.code;
            const current: SymbolAnalyticsDto = map.get(symbolCode) ?? {
                symbol: symbolCode,
                orderCount: 0,
                buyCount: 0,
                sellCount: 0,
                volume: 0,
            };

            current.orderCount += 1;
            current.volume += Number(order.quantity);

            if (order.side === 'BUY') {
                current.buyCount += 1;
            }

            if (order.side === 'SELL') {
                current.sellCount += 1;
            }

            map.set(symbolCode, current);
        }

        return [...map.values()].sort((a, b) => b.orderCount - a.orderCount);
    }
}
