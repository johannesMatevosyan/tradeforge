import { ApiProperty } from "@nestjs/swagger";


export class SymbolResponseDto {
    @ApiProperty({
        example: 'cmnxjaxs40000bwtzs7r5ip2m',
        description: 'Unique symbol identifier',
    })
    id!: string;

    @ApiProperty({
        example: 'BTCUSD',
        description: 'Trading symbol code',
    })
    code!: string;

    @ApiProperty({
        example: 'BTC',
        description: 'Base asset of the trading symbol',
    })
    baseAsset!: string;

    @ApiProperty({
        example: 'USD',
        description: 'Quote asset of the trading symbol',
    })
    quoteAsset!: string;

    @ApiProperty({
        example: 'Bitcoin / US Dollar',
        description: 'Description of the trading symbol',
    })
    description!: string | null;

    @ApiProperty({
        example: true,
        description: 'Indicates if the trading symbol is active',
    })
    isActive!: boolean;

    @ApiProperty({
        example: 'Bitcoin / US Dollar',
        description: 'Display name for UI usage',
    })
    displayName!: string;

    @ApiProperty({
        example: 'BTCUSD - Bitcoin / US Dollar',
        description: 'Combined symbol label for dropdowns and selectors',
    })
    label!: string;
}
