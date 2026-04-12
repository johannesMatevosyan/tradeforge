import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetSymbolsQueryDto } from './dto/get-symbols-query.dto';
import { SymbolItem, SymbolsService } from './symbols.service';

@ApiTags('symbols')
@Controller('symbols')
export class SymbolsController {
  constructor(private readonly symbolsService: SymbolsService) {}

  @Get()
  findAll(@Query() query: GetSymbolsQueryDto): SymbolItem[] {
    return this.symbolsService.findAll(query);
  }
}
