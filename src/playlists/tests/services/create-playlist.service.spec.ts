import { Test, TestingModule } from '@nestjs/testing';
import { CreatePlaylistService } from '../../services/create-playlist.service';
import { CreatePlaylistRepository } from '../../repositories/create-playlist.repository';
import {
  mockEmptyPlaylistData,
  mockPlaylistResponse,
} from '../mocks/playlist.mock';

describe('CreatePlaylistService', () => {
  let service: CreatePlaylistService;
  let createPlaylistRepository: jest.Mocked<CreatePlaylistRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreatePlaylistService,
        {
          provide: CreatePlaylistRepository,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CreatePlaylistService>(CreatePlaylistService);
    createPlaylistRepository = module.get(CreatePlaylistRepository);
  });

  it('should call createPlaylistRepository.create once', async () => {
    createPlaylistRepository.create.mockResolvedValue(mockPlaylistResponse);

    await service.create(mockEmptyPlaylistData);

    expect(createPlaylistRepository.create).toHaveBeenCalledTimes(1);
  });
});
