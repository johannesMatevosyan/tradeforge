import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class WatchlistIdParamDto {
    @ApiProperty({
        example: 'cmnxjaxs40000bwtzs7r5ip2m',
        description: 'Watchlist item id',
    })
    @IsString()
    @Length(10, 50) // cuid is long
    id!: string;
}
