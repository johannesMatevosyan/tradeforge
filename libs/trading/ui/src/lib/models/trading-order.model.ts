export interface TradingOrder {
    id: string;
    symbol: string;
    side: 'BUY' | 'SELL';
    type: 'MARKET' | 'LIMIT';
    price: number;
    quantity: number;
    status: 'OPEN' | 'FILLED' | 'CANCELLED';
    createdAt: Date;
}
