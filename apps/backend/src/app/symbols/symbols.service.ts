import { Injectable } from '@nestjs/common';
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
      private readonly symbols: SymbolItem[] = [
    {
      id: '1',
      code: 'BTCUSD',
      baseAsset: 'BTC',
      quoteAsset: 'USD',
      description: 'Bitcoin / US Dollar',
      isActive: true,
    },
    {
      id: '2',
      code: 'ETHUSD',
      baseAsset: 'ETH',
      quoteAsset: 'USD',
      description: 'Ethereum / US Dollar',
      isActive: true,
    },
    {
      id: '3',
      code: 'EURUSD',
      baseAsset: 'EUR',
      quoteAsset: 'USD',
      description: 'Euro / US Dollar',
      isActive: true,
    },
    {
      id: '4',
      code: 'XAUUSD',
      baseAsset: 'XAU',
      quoteAsset: 'USD',
      description: 'Gold / US Dollar',
      isActive: true,
    },
  ];

  findAll(query: GetSymbolsQueryDto): SymbolItem[] {
    const { search, isActive } = query;

    return this.symbols.filter((symbol) => {
      const matchesSearch =
        !search ||
        symbol.code.toLowerCase().includes(search.toLowerCase()) ||
        symbol.baseAsset.toLowerCase().includes(search.toLowerCase()) ||
        symbol.quoteAsset.toLowerCase().includes(search.toLowerCase()) ||
        symbol.description.toLowerCase().includes(search.toLowerCase());

      const matchesActive =
        typeof isActive !== 'boolean' || symbol.isActive === isActive;

      return matchesSearch && matchesActive;
    });
  }
}
