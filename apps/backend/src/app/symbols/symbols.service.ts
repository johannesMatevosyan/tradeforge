import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetSymbolsQueryDto } from './dto/get-symbols-query.dto';
import { SymbolResponseDto } from './dto/symbol-response.dto';

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
    const normalizedCode = code.toUpperCase();
    const symbol = await this.prisma.symbol.findUnique({
      where: {
        code: normalizedCode,
      },
    });

    if (!symbol) {
      throw new NotFoundException(`Symbol with code "${normalizedCode}" not found.`);
    }

    const displayName =
    symbol.description?.trim() || `${symbol.baseAsset} / ${symbol.quoteAsset}`;

    const label = `${symbol.code} - ${displayName}`;

    return {
      id: symbol.id,
      code: symbol.code,
      baseAsset: symbol.baseAsset,
      quoteAsset: symbol.quoteAsset,
      description: symbol.description,
      isActive: symbol.isActive,
      displayName,
      label,
    };
  }

  async activate(code: string) {
    return this.updateActiveStatus(code, true);
  }

  async deactivate(code: string) {
    return this.updateActiveStatus(code, false);
  }

  private async updateActiveStatus(code: string, isActive: boolean): Promise<SymbolResponseDto> {
    const normalizedCode = code.toUpperCase();

    const existingSymbol = await this.prisma.symbol.findUnique({
      where: {
        code: normalizedCode,
      },
    });

    if (!existingSymbol) {
      throw new NotFoundException(
        `Symbol with code "${normalizedCode}" not found.`,
      );
    }

    const updatedSymbol = await this.prisma.symbol.update({
      where: {
        code: normalizedCode,
      },
      data: {
        isActive,
      },
    });

    const displayName =
      updatedSymbol.description ?? `${updatedSymbol.baseAsset} / ${updatedSymbol.quoteAsset}`;
    const label = `${updatedSymbol.code} - ${displayName}`;

    return this.toResponseDto({
      ...updatedSymbol,
      displayName,
      label,
    });
  }

  private toResponseDto(symbol: {
    id: string;
    code: string;
    baseAsset: string;
    quoteAsset: string;
    description: string | null;
    isActive: boolean;
    displayName: string;
    label: string;
  }): SymbolResponseDto {
    return {
      id: symbol.id,
      code: symbol.code,
      baseAsset: symbol.baseAsset,
      quoteAsset: symbol.quoteAsset,
      description: symbol.description || '',
      isActive: symbol.isActive,
      displayName: symbol.displayName,
      label: symbol.label,
    };
  }
}
