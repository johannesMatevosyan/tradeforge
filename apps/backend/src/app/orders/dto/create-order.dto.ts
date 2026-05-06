import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderSide, OrderType } from '@tradeforge/shared-types';
import {
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
  Matches,
  ValidateIf,
} from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ example: 'BTCUSD' })
  @IsString()
  @Length(3, 20)
  @Matches(/^[A-Z]+\/[A-Z]+$/, {
    message: 'Symbol must be in format BASE/QUOTE',
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
  @ValidateIf((order: CreateOrderDto) => order.type === 'LIMIT')
  @IsNotEmpty({ message: 'Price is required for LIMIT orders.' })
  @IsNumberString()
  @Matches(/^(?!0+(\.0+)?$)\d+(\.\d+)?$/, {
    message: 'Price must be greater than 0',
  })
  price?: string;
}
