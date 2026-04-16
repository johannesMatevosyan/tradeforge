import { ApiProperty } from '@nestjs/swagger';

export class OrderResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  symbolId!: string;

  @ApiProperty()
  symbolCode!: string;

  @ApiProperty()
  displayName!: string;

  @ApiProperty({ example: 'BUY' })
  side!: string;

  @ApiProperty({ example: 'MARKET' })
  type!: string;

  @ApiProperty({ example: '0.50' })
  quantity!: string;

  @ApiProperty({ example: '65000.00', nullable: true })
  price!: string | null;

  @ApiProperty({ example: 'OPEN' })
  status!: string;

  @ApiProperty()
  isActive!: boolean;
}
