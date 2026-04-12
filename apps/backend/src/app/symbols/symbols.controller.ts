import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SymbolItem, SymbolsService } from './symbols.service';

@ApiTags('symbols')
@Controller('symbols')
export class SymbolsController {
  constructor(private readonly symbolsService: SymbolsService) {}

  @Get()
  findAll(): SymbolItem[] {
    return this.symbolsService.findAll();
  }
}
