import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@Prisma/prisma.service';
import { PrismaClient } from '@prisma/client';

describe('PrismaService', () => {
  let service: PrismaService;
  let mockPrismaClient: jest.Mocked<PrismaClient>;

  beforeEach(async () => {
    mockPrismaClient = {
      $connect: jest.fn(),
      $disconnect: jest.fn(),
    } as any;

    jest
      .spyOn(PrismaClient.prototype, '$connect')
      .mockImplementation(mockPrismaClient.$connect);
    jest
      .spyOn(PrismaClient.prototype, '$disconnect')
      .mockImplementation(mockPrismaClient.$disconnect);

    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call $connect when onModuleInit is called', async () => {
    await service.onModuleInit();
    expect(mockPrismaClient.$connect).toHaveBeenCalled();
  });

  it('should call $disconnect when onModuleDestroy is called', async () => {
    await service.onModuleDestroy();
    expect(mockPrismaClient.$disconnect).toHaveBeenCalled();
  });
});
