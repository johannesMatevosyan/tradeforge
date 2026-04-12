import { Injectable, NotFoundException } from '@nestjs/common';

export interface IWatchlistItem {
  id: string;
  symbolCode: string;
  displayName: string;
}

export interface ICreateWatchlistItemDto {
  symbolCode: string;
  displayName: string;
}

@Injectable()
export class WatchlistService {
    private watchlist: IWatchlistItem[] = [
        {
            id: '1',
            symbolCode: 'BTCUSD',
            displayName: 'Bitcoin / US Dollar',
        },
        {
            id: '2',
            symbolCode: 'ETHUSD',
            displayName: 'Ethereum / US Dollar',
        },
    ];

    findAll(): IWatchlistItem[] {
        return this.watchlist;
    }

    create(createWatchlistItemDto: ICreateWatchlistItemDto): IWatchlistItem {
        const newItem: IWatchlistItem = {
            id: (this.watchlist.length + 1).toString(),  // increment id by 1
            ...createWatchlistItemDto,
        };
        this.watchlist.push(newItem);
        return newItem;
    }

    remove(id: string): IWatchlistItem {
        const itemIndex = this.watchlist.findIndex((item) => item.id === id);

        if (itemIndex === -1) {
        throw new NotFoundException(`Watchlist item with id "${id}" not found.`);
        }

        const [removedItem] = this.watchlist.splice(itemIndex, 1);
        return removedItem;
    }
}
