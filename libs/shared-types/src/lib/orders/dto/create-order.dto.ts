import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';
import { OrderSide, OrderType } from '@tradeforge/shared-types';

export class CreateOrderDto {
  @IsString()
  symbol: string;

  @IsEnum(['BUY', 'SELL'])
  side: OrderSide;

  @IsEnum(['MARKET', 'LIMIT'])
  type: OrderType;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @ValidateIf((order: CreateOrderDto) => order.type === 'LIMIT')
  @IsNumber()
  @Min(0.01)
  price?: number;
}
