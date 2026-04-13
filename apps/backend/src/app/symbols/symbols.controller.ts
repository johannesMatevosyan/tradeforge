import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
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
}
