import { Injectable } from '@nestjs/common';

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

  findAll(): SymbolItem[] {
    return this.symbols.filter((symbol) => symbol.isActive);
  }
}
