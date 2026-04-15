import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WatchlistItemResponseDto } from './dto/watchlist-item-response.dto';

export interface IWatchlistItem {
  id: string;
  symbolCode: string;
  displayName: string;
}

export interface ICreateWatchlistItemDto {
  symbolCode: string;
  displayName: string;
}

@Injectable()
export class WatchlistService {
    constructor(private readonly prisma: PrismaService) {}

    private readonly demoUserEmail = 'demo@tradeforge.local';

    async findAll(): Promise<WatchlistItemResponseDto[]> {
        const user = await this.getDemoUser();

        const items = await this.prisma.watchlistItem.findMany({
            where: {
                userId: user.id,
            },
            include: {
                symbol: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return items.map((item) => this.toResponseDto(item));
    }

    async create(createWatchlistItemDto: ICreateWatchlistItemDto): Promise<WatchlistItemResponseDto> {
        const user = await this.getDemoUser();
        const normalizedCode = createWatchlistItemDto.symbolCode.toUpperCase();

        const symbol = await this.prisma.symbol.findUnique({
            where: {
                code: normalizedCode,
            },
        });

        if (!symbol) {
            throw new NotFoundException(
                `Symbol with code "${normalizedCode}" not found.`,
            );
        }

        const existingItem = await this.prisma.watchlistItem.findUnique({
            where: {
                userId_symbolId: {
                    userId: user.id,
                    symbolId: symbol.id,
                },
            },
            include: {
                symbol: true,
            },
        });

        if (existingItem) {
            throw new ConflictException(
                `Symbol "${normalizedCode}" is already in watchlist.`,
            );
        }

        const createdItem = await this.prisma.watchlistItem.create({
            data: {
                userId: user.id,
                symbolId: symbol.id,
            },
            include: {
                symbol: true,
            },
        });

        return this.toResponseDto(createdItem);
    }

    async remove(id: string): Promise<WatchlistItemResponseDto> {
        const user = await this.getDemoUser();

        const existingItem = await this.prisma.watchlistItem.findFirst({
            where: {
                id,
                userId: user.id,
            },
            include: {
                symbol: true,
            },
        });

        if (!existingItem) {
            throw new NotFoundException(`Watchlist item with id "${id}" not found.`);
        }

        await this.prisma.watchlistItem.delete({
            where: {
                id,
            },
        });

        return this.toResponseDto(existingItem);
    }

    private async getDemoUser() {
        const user = await this.prisma.user.findUnique({
            where: {
                email: this.demoUserEmail,
            },
        });

        if (!user) {
            throw new NotFoundException('Demo user not found.');
        }

        return user;
    }

    private toResponseDto(item: {
        id: string;
        symbolId: string;
        symbol: {
            code: string;
            description: string | null;
            baseAsset: string;
            quoteAsset: string;
            isActive: boolean;
        };
    }): WatchlistItemResponseDto {
        const displayName =
        item.symbol.description?.trim() ||
        `${item.symbol.baseAsset} / ${item.symbol.quoteAsset}`;

        return {
            id: item.id,
            symbolId: item.symbolId,
            symbolCode: item.symbol.code,
            displayName,
            label: `${item.symbol.code} - ${displayName}`,
            isActive: item.symbol.isActive,
        };
    }
}
