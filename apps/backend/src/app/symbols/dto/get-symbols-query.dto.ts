import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, Length } from "class-validator";


export class GetSymbolsQueryDto {
    @ApiPropertyOptional({
        example: 'BTC',
        description: 'Search by symbol code, base asset, quote asset, or description',
    })
    @IsOptional()
    @IsString()
    @Length(1, 50)
    search?: string;

    @ApiPropertyOptional({
        example: true,
        description: 'Filter by active status',
    })
    @IsOptional()
    @Transform(({ value }) => {
        if (value === 'true' || value === true) return true;
        if (value === 'false' || value === false) return false;
        return value;
    })
    @IsBoolean()
    isActive?: boolean;
}
