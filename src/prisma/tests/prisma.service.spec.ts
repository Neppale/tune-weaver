import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    await service.$disconnect();
  });

  it('should return undefined when onModuleInit is called', async () => {
    const result = await service.onModuleInit();
    expect(result).toBeUndefined();
  });

  it('should return undefined when onModuleDestroy is called', async () => {
    const result = await service.onModuleDestroy();
    expect(result).toBeUndefined();
  });
});
