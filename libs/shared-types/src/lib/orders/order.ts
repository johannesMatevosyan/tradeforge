export const OrderSide = { BUY: 'BUY', SELL: 'SELL' } as const;
export type OrderSide = (typeof OrderSide)[keyof typeof OrderSide];

export const OrderType = { MARKET: 'MARKET', LIMIT: 'LIMIT' } as const;
export type OrderType = (typeof OrderType)[keyof typeof OrderType];

export const OrderStatus = { PENDING: 'PENDING', FILLED: 'FILLED', REJECTED: 'REJECTED' } as const;
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export interface Order {
  id: string;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  quantity: number;
  price: number | null;
  status: OrderStatus;
  createdAt: string;
}

export interface CreateOrderRequest {
  symbol: string;
  side: OrderSide;
  type: OrderType;
  quantity: string;
  price?: string;
}
