import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateWatchlistItemDto {
  @ApiProperty({
    example: 'EURUSD',
    description: 'Trading symbol code',
  })
  @IsString()
  @Length(3, 20)
  symbolCode!: string;

  @ApiProperty({
    example: 'Euro / US Dollar',
    description: 'Human-readable symbol name',
  })
  @IsString()
  @Length(3, 100)
  displayName!: string;
}
