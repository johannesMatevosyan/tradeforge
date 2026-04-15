import { ApiProperty } from '@nestjs/swagger';

export class WatchlistItemResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  symbolId!: string;

  @ApiProperty()
  symbolCode!: string;

  @ApiProperty()
  displayName!: string;

  @ApiProperty()
  label!: string;

  @ApiProperty()
  isActive!: boolean;
}
