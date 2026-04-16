import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches } from 'class-validator';

export class SymbolCodeParamDto {
    @ApiProperty({
        example: 'BTCUSD',
        description: 'Trading symbol code',
    })
    @IsString()
    @Length(3, 20)
    @Matches(/^[A-Za-z]+$/, {
        message: 'Symbol code must contain only letters',
    })
    code!: string;
}
