import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ICreateWatchlistItemDto, IWatchlistItem, WatchlistService } from './watchlist.service';

@Controller('watchlist')
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Get()
  findAll(): IWatchlistItem[] {
    return this.watchlistService.findAll();
  }

  @Post()
  create(@Body() payload: ICreateWatchlistItemDto): IWatchlistItem {
    return this.watchlistService.create(payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string): IWatchlistItem {
    return this.watchlistService.remove(id);
  }
}
