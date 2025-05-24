import { Test, TestingModule } from '@nestjs/testing';
import { CreatePlaylistService } from '../../services/create-playlist.service';
import { CreatePlaylistRepository } from '../../repositories/create-playlist.repository';
import { CreateTracksService } from '../../../tracks/services/create-tracks.service';
import { GetTrackDataByPlatformService } from '../../../tracks/services/get-track-data-by-platform.service';
import { LoadTrackPlatformByPlatformIdRepository } from '../../../tracks/repositories/load-track-platform-by-platform-id.repository';
import { FindTrackByMetadataRepository } from '../../../tracks/repositories/find-tracks-by-metadata.repository';
import { mockTrackData } from '../mocks/track-data.mock';
import {
  mockEmptyPlaylistData,
  mockPlaylistData,
  mockPlaylistResponse,
} from '../mocks/playlist.mock';
import {
  mockExistingTrack,
  mockNewTrack,
  mockNewTrackPlatform,
  mockSimilarTrack,
} from '../mocks/track-platform.mock';

describe('CreatePlaylistService', () => {
  let service: CreatePlaylistService;
  let createPlaylistRepository: jest.Mocked<CreatePlaylistRepository>;
  let createTracksService: jest.Mocked<CreateTracksService>;
  let getTrackDataByPlatformService: jest.Mocked<GetTrackDataByPlatformService>;
  let loadTrackPlatformByPlatformIdRepository: jest.Mocked<LoadTrackPlatformByPlatformIdRepository>;
  let findTracksByMetadataRepository: jest.Mocked<FindTrackByMetadataRepository>;

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
          provide: GetTrackDataByPlatformService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: LoadTrackPlatformByPlatformIdRepository,
          useValue: {
            load: jest.fn(),
          },
        },
        {
          provide: FindTrackByMetadataRepository,
          useValue: {
            findSimilarTracks: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CreatePlaylistService>(CreatePlaylistService);
    createPlaylistRepository = module.get(CreatePlaylistRepository);
    createTracksService = module.get(CreateTracksService);
    getTrackDataByPlatformService = module.get(GetTrackDataByPlatformService);
    loadTrackPlatformByPlatformIdRepository = module.get(
      LoadTrackPlatformByPlatformIdRepository,
    );
    findTracksByMetadataRepository = module.get(FindTrackByMetadataRepository);
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

  it('should call getTrackDataByPlatformService.get once when tracks are not empty', async () => {
    loadTrackPlatformByPlatformIdRepository.load.mockResolvedValue([]);
    getTrackDataByPlatformService.get.mockResolvedValue([mockTrackData]);
    findTracksByMetadataRepository.find.mockResolvedValue([]);
    createTracksService.create.mockResolvedValue({
      newTracks: [mockNewTrack],
      newTrackPlatforms: [mockNewTrackPlatform],
    });
    createPlaylistRepository.create.mockResolvedValue(mockPlaylistResponse);

    await service.create(mockPlaylistData);

    expect(getTrackDataByPlatformService.get).toHaveBeenCalledTimes(1);
  });

  it('should call findTracksByMetadataRepository.findSimilarTracks once when tracks are not empty', async () => {
    loadTrackPlatformByPlatformIdRepository.load.mockResolvedValue([]);
    getTrackDataByPlatformService.get.mockResolvedValue([mockTrackData]);
    findTracksByMetadataRepository.find.mockResolvedValue([mockSimilarTrack]);
    createPlaylistRepository.create.mockResolvedValue(mockPlaylistResponse);

    await service.create(mockPlaylistData);

    expect(findTracksByMetadataRepository.find).toHaveBeenCalledTimes(1);
  });

  it('should call createTracksService.create once when tracks are not empty', async () => {
    loadTrackPlatformByPlatformIdRepository.load.mockResolvedValue([]);
    getTrackDataByPlatformService.get.mockResolvedValue([mockTrackData]);
    findTracksByMetadataRepository.find.mockResolvedValue([]);
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
    getTrackDataByPlatformService.get.mockResolvedValue([mockTrackData]);
    findTracksByMetadataRepository.find.mockResolvedValue([]);
    createTracksService.create.mockResolvedValue({
      newTracks: [mockNewTrack],
      newTrackPlatforms: [mockNewTrackPlatform],
    });
    createPlaylistRepository.create.mockResolvedValue(mockPlaylistResponse);

    await service.create(mockPlaylistData);

    expect(createPlaylistRepository.create).toHaveBeenCalledTimes(1);
  });
});
