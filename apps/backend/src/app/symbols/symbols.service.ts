import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetSymbolsQueryDto } from './dto/get-symbols-query.dto';

export interface SymbolItem {
  id: string;
  code: string;
  baseAsset: string;
  quoteAsset: string;
  description: string;
  isActive: boolean;
}

@Injectable()
export class SymbolsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: GetSymbolsQueryDto) {
    const { search, isActive } = query;

    return this.prisma.symbol.findMany({
      where: {
        ...(typeof isActive === 'boolean' ? { isActive } : {}),
        ...(search
          ? {
              OR: [
                { code: { contains: search, mode: 'insensitive' } },
                { baseAsset: { contains: search, mode: 'insensitive' } },
                { quoteAsset: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: {
        code: 'asc',
      },
    });
  }

  async findOneByCode(code: string) {
    const symbol = await this.prisma.symbol.findUnique({
      where: {
        code: code.toUpperCase(),
      },
    });

    if (!symbol) {
      throw new NotFoundException(`Symbol with code "${code}" not found.`);
    }

    return symbol;
  }
}
