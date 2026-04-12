import { Controller, Get } from '@nestjs/common';
import { SymbolItem, SymbolsService } from './symbols.service';

@Controller('symbols')
export class SymbolsController {
  constructor(private readonly symbolsService: SymbolsService) {}

  @Get()
  findAll(): SymbolItem[] {
    return this.symbolsService.findAll();
  }
}
