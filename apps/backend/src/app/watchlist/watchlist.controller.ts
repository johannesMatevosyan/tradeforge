import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateWatchlistItemDto } from './dto/create-watchlist-item.dto';
import { IWatchlistItem, WatchlistService } from './watchlist.service';

@ApiTags('watchlist')
@Controller('watchlist')
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @ApiOperation({ summary: 'Get saved watchlist items' })
  @Get()
  findAll(): IWatchlistItem[] {
    return this.watchlistService.findAll();
  }

  @Post()
  create(@Body() payload: CreateWatchlistItemDto): IWatchlistItem {
    return this.watchlistService.create(payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string): IWatchlistItem {
    return this.watchlistService.remove(id);
  }
}
