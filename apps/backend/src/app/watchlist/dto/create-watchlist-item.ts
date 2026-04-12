import { IsString, Length } from 'class-validator';

export class CreateWatchlistItemDto {
  @IsString()
  @Length(3, 20)
  symbolCode!: string;

  @IsString()
  @Length(3, 100)
  displayName!: string;
}
