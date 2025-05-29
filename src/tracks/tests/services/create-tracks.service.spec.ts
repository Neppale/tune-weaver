import { Test, TestingModule } from '@nestjs/testing';
import { CreateTracksService } from '../../services/create-tracks.service';
import { CreateTracksRepository } from '../../repositories/create-tracks.repository';
import { Platform } from '@prisma/client';

describe('CreateTracksService', () => {
  let service: CreateTracksService;
  let createTrackRepository: jest.Mocked<CreateTracksRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTracksService,
        {
          provide: CreateTracksRepository,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CreateTracksService>(CreateTracksService);
    createTrackRepository = module.get(CreateTracksRepository);
  });

  it('should call createTrackRepository once', async () => {
    const mockTracks = [
      {
        name: 'Test Track',
        artist: 'Test Artist',
        album: 'Test Album',
        duration: 180,
        platform: Platform.SPOTIFY,
        platformId: 'test123',
      },
    ];

    createTrackRepository.create.mockResolvedValue([
      {
        id: 'track1',
        name: 'Test Track',
        artist: 'Test Artist',
        album: 'Test Album',
        duration: 180,
        createdAt: new Date(),
        updatedAt: new Date(),
        isEnriched: false,
        platforms: [
          {
            id: 'platform1',
            trackId: 'track1',
            platform: Platform.SPOTIFY,
            platformId: 'test123',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      },
    ]);

    await service.create(mockTracks);

    expect(createTrackRepository.create).toHaveBeenCalledTimes(1);
  });
});
