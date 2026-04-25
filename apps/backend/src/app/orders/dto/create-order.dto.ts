import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumberString,
  IsString,
  Length,
  Matches,
  ValidateIf,
} from 'class-validator';
import { OrderSide, OrderType } from '@tradeforge/shared-types';

export class CreateOrderDto {
  @ApiProperty({ example: 'BTCUSD' })
  @IsString()
  @Length(3, 20)
  @Matches(/^[A-Za-z]+$/, {
    message: 'Symbol must contain only letters',
  })
  symbol!: string;

  @ApiProperty({ enum: OrderSide, example: OrderSide.BUY })
  @IsEnum(OrderSide)
  side!: OrderSide;

  @ApiProperty({ enum: OrderType, example: OrderType.MARKET })
  @IsEnum(OrderType)
  type!: OrderType;

  @ApiProperty({
    example: '0.50',
    description: 'Quantity as decimal string, must be greater than 0',
  })
  @IsNumberString()
  @Matches(/^(?!0+(\.0+)?$)\d+(\.\d+)?$/, {
    message: 'Quantity must be greater than 0',
  })
  quantity!: string;

  @ApiPropertyOptional({
    example: '65000.00',
    description: 'Required for LIMIT orders, must be greater than 0',
  })
  @ValidateIf((order: CreateOrderDto) => order.type === OrderType.LIMIT)
  @IsNumberString()
  @Matches(/^(?!0+(\.0+)?$)\d+(\.\d+)?$/, {
    message: 'Price must be greater than 0',
  })
  price?: string;
}
