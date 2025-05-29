import { Test, TestingModule } from '@nestjs/testing';
import { CreatePlaylistService } from '../../services/create-playlist.service';
import { CreatePlaylistRepository } from '../../repositories/create-playlist.repository';
import { CreateTracksService } from '../../../tracks/services/create-tracks.service';
import {
  mockEmptyPlaylistData,
  mockPlaylistData,
  mockPlaylistResponse,
} from '../mocks/playlist.mock';
import {
  mockExistingTrack,
  mockNewTrack,
  mockNewTrackPlatform,
} from '../mocks/track-platform.mock';
import { QueueService } from '@Queue/services/queue.service';
import { Platform } from '@prisma/client';
import { LoadTrackPlatformByPlatformIdRepository } from '@Tracks/repositories/load-track-platform-by-platform-id.repository';

describe('CreatePlaylistService', () => {
  let service: CreatePlaylistService;
  let createPlaylistRepository: jest.Mocked<CreatePlaylistRepository>;
  let createTracksService: jest.Mocked<CreateTracksService>;
  let loadTrackPlatformByPlatformIdRepository: jest.Mocked<LoadTrackPlatformByPlatformIdRepository>;
  let queueService: jest.Mocked<QueueService>;

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
        {
          provide: CreateTracksService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: LoadTrackPlatformByPlatformIdRepository,
          useValue: {
            load: jest.fn(),
          },
        },
        {
          provide: QueueService,
          useValue: {
            publishTrackEnrichment: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CreatePlaylistService>(CreatePlaylistService);
    createPlaylistRepository = module.get(CreatePlaylistRepository);
    createTracksService = module.get(CreateTracksService);
    loadTrackPlatformByPlatformIdRepository = module.get(
      LoadTrackPlatformByPlatformIdRepository,
    );
    queueService = module.get(QueueService);
  });

  it('should call createPlaylistRepository.create once when tracks are empty', async () => {
    createPlaylistRepository.create.mockResolvedValue(mockPlaylistResponse);

    await service.create(mockEmptyPlaylistData);

    expect(createPlaylistRepository.create).toHaveBeenCalledTimes(1);
  });

  it('should call loadTrackPlatformByPlatformIdRepository.load once when tracks are not empty', async () => {
    loadTrackPlatformByPlatformIdRepository.load.mockResolvedValue([
      mockExistingTrack,
    ]);
    createPlaylistRepository.create.mockResolvedValue(mockPlaylistResponse);

    await service.create(mockPlaylistData);

    expect(loadTrackPlatformByPlatformIdRepository.load).toHaveBeenCalledTimes(
      1,
    );
  });

  it('should call createTracksService.create once when tracks are not empty', async () => {
    loadTrackPlatformByPlatformIdRepository.load.mockResolvedValue([]);
    createTracksService.create.mockResolvedValue({
      newTracks: [mockNewTrack],
      newTrackPlatforms: [mockNewTrackPlatform],
    });
    createPlaylistRepository.create.mockResolvedValue(mockPlaylistResponse);

    await service.create(mockPlaylistData);

    expect(createTracksService.create).toHaveBeenCalledTimes(1);
  });

  it('should call createPlaylistRepository.create once when tracks are not empty', async () => {
    loadTrackPlatformByPlatformIdRepository.load.mockResolvedValue([]);
    createTracksService.create.mockResolvedValue({
      newTracks: [mockNewTrack],
      newTrackPlatforms: [mockNewTrackPlatform],
    });
    createPlaylistRepository.create.mockResolvedValue(mockPlaylistResponse);

    await service.create(mockPlaylistData);

    expect(createPlaylistRepository.create).toHaveBeenCalledTimes(1);
  });

  it('should call queueService.publishTrackEnrichment with platform for each new track', async () => {
    const mockPlatform = Platform.SPOTIFY;
    loadTrackPlatformByPlatformIdRepository.load.mockResolvedValue([]);
    createTracksService.create.mockResolvedValue({
      newTracks: [mockNewTrack],
      newTrackPlatforms: [{ ...mockNewTrackPlatform, platform: mockPlatform }],
    });
    createPlaylistRepository.create.mockResolvedValue(mockPlaylistResponse);

    await service.create(mockPlaylistData);

    expect(queueService.publishTrackEnrichment).toHaveBeenCalledWith(
      mockNewTrack.id,
      mockPlatform,
    );
  });
});
