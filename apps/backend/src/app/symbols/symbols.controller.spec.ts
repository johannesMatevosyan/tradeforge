import { Test, TestingModule } from '@nestjs/testing';
import { SymbolsController } from './symbols.controller';
import { SymbolsService } from './symbols.service';

const mockSymbolsService = {
  findAll: jest.fn(),
  findByCode: jest.fn(),
  toggleActive: jest.fn(),
};

describe('SymbolsController', () => {
  let controller: SymbolsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SymbolsController],
      providers: [
        { provide: SymbolsService, useValue: mockSymbolsService },
      ],
    }).compile();

    controller = module.get<SymbolsController>(SymbolsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
