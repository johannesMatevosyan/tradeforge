import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiConflictResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateWatchlistItemDto } from './dto/create-watchlist-item.dto';
import { WatchlistItemResponseDto } from './dto/watchlist-item-response.dto';
import { WatchlistService } from './watchlist.service';

@ApiTags('watchlist')
@Controller('watchlist')
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @ApiOperation({ summary: 'Get saved watchlist items' })
  @ApiOkResponse({
    type: WatchlistItemResponseDto,
    isArray: true,
  })
  @Get()
  async findAll(): Promise<WatchlistItemResponseDto[]> {
    return this.watchlistService.findAll();
  }

  @ApiOperation({ summary: 'Add symbol to watchlist' })
  @ApiOkResponse({
    type: WatchlistItemResponseDto,
  })
  @ApiConflictResponse({
    description: 'Symbol already exists in watchlist',
  })
  @Post()
  async create(
    @Body() payload: CreateWatchlistItemDto,
  ): Promise<WatchlistItemResponseDto> {
    return this.watchlistService.create(payload);
  }

  @ApiOperation({ summary: 'Remove watchlist item by id' })
  @ApiOkResponse({
    type: WatchlistItemResponseDto,
  })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<WatchlistItemResponseDto> {
    return this.watchlistService.remove(id);
  }
}
