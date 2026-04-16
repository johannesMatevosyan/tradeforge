import { Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { GetSymbolsQueryDto } from './dto/get-symbols-query.dto';
import { SymbolCodeParamDto } from './dto/symbol-code-param.dto';
import { SymbolResponseDto } from './dto/symbol-respomnse.dto';
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

  @ApiOperation({ summary: 'Get one symbol by code' })
  @ApiParam({
    name: 'code',
    example: 'BTCUSD',
    description: 'Trading symbol code',
  })
  @ApiOkResponse({
    type: SymbolResponseDto,
  })
  @Get(':code')
  async findOne(@Param() params: SymbolCodeParamDto): Promise<SymbolResponseDto> {
    return this.symbolsService.findOneByCode(params.code);
  }

  @ApiOperation({ summary: 'Activate symbol by code' })
  @ApiParam({
    name: 'code',
    example: 'XAUUSD',
    description: 'Trading symbol code',
  })
  @ApiOkResponse({
    type: SymbolResponseDto,
  })
  @Patch(':code/activate')
  async activate(@Param() params: SymbolCodeParamDto): Promise<SymbolResponseDto> {
    return this.symbolsService.activate(params.code);
  }

  @ApiOperation({ summary: 'Deactivate symbol by code' })
  @ApiParam({
    name: 'code',
    example: 'BTCUSD',
    description: 'Trading symbol code',
  })
  @ApiOkResponse({
    type: SymbolResponseDto,
  })
  @Patch(':code/deactivate')
  async deactivate(@Param() params: SymbolCodeParamDto): Promise<SymbolResponseDto> {
    return this.symbolsService.deactivate(params.code);
  }
}
