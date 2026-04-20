import { Test, TestingModule } from '@nestjs/testing';
import { WatchlistController } from './watchlist.controller';
import { WatchlistService } from './watchlist.service';

const mockWatchlistService = {
  findAll: jest.fn(),
  addItem: jest.fn(),
  removeItem: jest.fn(),
};

describe('WatchlistController', () => {
  let controller: WatchlistController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WatchlistController],
      providers: [
        { provide: WatchlistService, useValue: mockWatchlistService },
      ],
    }).compile();

    controller = module.get<WatchlistController>(WatchlistController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
