import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { SymbolsService } from './symbols.service';

const mockPrismaService = {
  symbol: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

describe('SymbolsService', () => {
  let service: SymbolsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SymbolsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<SymbolsService>(SymbolsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
