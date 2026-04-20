import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { WatchlistService } from './watchlist.service';

const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
  },
  watchlistItem: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  },
};

describe('WatchlistService', () => {
  let service: WatchlistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WatchlistService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<WatchlistService>(WatchlistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
