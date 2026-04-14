import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { GetSymbolsQueryDto } from './dto/get-symbols-query.dto';
import { SymbolsService } from './symbols.service';

@ApiTags('symbols')
@Controller('symbols')
export class SymbolsController {
  constructor(private readonly symbolsService: SymbolsService) {}

  @ApiOperation({ summary: 'Get trading symbols with optional search/filter' })
  @Get()
  async findAll(@Query() query: GetSymbolsQueryDto) {
    return this.symbolsService.findAll(query);
  }

  @ApiOperation({ summary: 'Get a single trading symbol by its code' })
  @ApiParam({
    name: 'code',
    example: 'BTCUSD',
    description: 'Trading symbol code',
  })
  @Get(':code')
  async findOneByCode(@Param('code') code: string) {
    return this.symbolsService.findOneByCode(code);
  }
}
