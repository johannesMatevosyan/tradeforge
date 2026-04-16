import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateIf,
} from 'class-validator';

export enum OrderSideDto {
  BUY = 'BUY',
  SELL = 'SELL',
}

export enum OrderTypeDto {
  MARKET = 'MARKET',
  LIMIT = 'LIMIT',
}

export class CreateOrderDto {
  @ApiProperty({ example: 'BTCUSD' })
  @IsString()
  @Length(3, 20)
  @Matches(/^[A-Za-z]+$/, {
    message: 'Symbol code must contain only letters',
  })
  symbolCode!: string;

  @ApiProperty({ enum: OrderSideDto, example: OrderSideDto.BUY })
  @IsEnum(OrderSideDto)
  side!: OrderSideDto;

  @ApiProperty({ enum: OrderTypeDto, example: OrderTypeDto.MARKET })
  @IsEnum(OrderTypeDto)
  type!: OrderTypeDto;

  @ApiProperty({
    example: '0.50',
    description: 'Quantity as decimal string, must be greater than 0',
  })
  @IsNumberString() // property is a string containing only numeric characters
  quantity!: string;

  @ApiPropertyOptional({
    example: '65000.00',
    description: 'Required for LIMIT orders, must be greater than 0',
  })
  @IsOptional()
  @ValidateIf((o) => o.type === OrderTypeDto.LIMIT)
  @IsNumberString() // property is a string containing only numeric characters
  price?: string;
}
