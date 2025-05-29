import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistController } from '../playlist.controller';
import { CreatePlaylistService } from '../services/create-playlist.service';
import {
  mockEmptyPlaylistData,
  mockPlaylistResponse,
} from './mocks/playlist.mock';
import { GetSamplePlaylistsService } from '../services/get-sample-playlists.service';
import { Platform } from '@prisma/client';
import { QueueService } from '@Queue/services/queue.service';
import { LoadPlaylistTracksService } from '@Playlists/services/load-playlist-tracks.service';
import { LoadPlaylistDataService } from '@Playlists/services/load-playlist-data.service';
import { ImportPlaylistService } from '@Playlists/services/import-playlist.service';
import { AddTracksToPlaylistService } from '@Playlists/services/add-tracks-to-playlist.service';

describe('PlaylistController', () => {
  let controller: PlaylistController;
  let createPlaylistService: jest.Mocked<CreatePlaylistService>;
  let getSamplePlaylistsService: jest.Mocked<GetSamplePlaylistsService>;
  let loadPlaylistDataService: jest.Mocked<LoadPlaylistDataService>;
  let loadPlaylistTracksService: jest.Mocked<LoadPlaylistTracksService>;
  let importPlaylistService: jest.Mocked<ImportPlaylistService>;
  let addTracksToPlaylistService: jest.Mocked<AddTracksToPlaylistService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlaylistController],
      providers: [
        {
          provide: CreatePlaylistService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: GetSamplePlaylistsService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: LoadPlaylistDataService,
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
        {
          provide: LoadPlaylistTracksService,
          useValue: {
            load: jest.fn(),
          },
        },
        {
          provide: ImportPlaylistService,
          useValue: {
            import: jest.fn(),
          },
        },
        {
          provide: AddTracksToPlaylistService,
          useValue: {
            addTracks: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PlaylistController>(PlaylistController);
    createPlaylistService = module.get<jest.Mocked<CreatePlaylistService>>(
      CreatePlaylistService,
    );
    getSamplePlaylistsService = module.get<
      jest.Mocked<GetSamplePlaylistsService>
    >(GetSamplePlaylistsService);
    loadPlaylistDataService = module.get<jest.Mocked<LoadPlaylistDataService>>(
      LoadPlaylistDataService,
    );
    loadPlaylistTracksService = module.get<
      jest.Mocked<LoadPlaylistTracksService>
    >(LoadPlaylistTracksService);
    importPlaylistService = module.get<jest.Mocked<ImportPlaylistService>>(
      ImportPlaylistService,
    );
    addTracksToPlaylistService = module.get<
      jest.Mocked<AddTracksToPlaylistService>
    >(AddTracksToPlaylistService);
  });

  it('should call createPlaylistService.create once', async () => {
    createPlaylistService.create.mockResolvedValue(mockPlaylistResponse);

    await controller.create(mockEmptyPlaylistData);

    expect(createPlaylistService.create).toHaveBeenCalledTimes(1);
  });

  it('should call getSamplePlaylistsService.get once', async () => {
    createPlaylistService.create.mockResolvedValue(mockPlaylistResponse);

    await controller.sample('123', Platform.SPOTIFY);

    expect(getSamplePlaylistsService.get).toHaveBeenCalledTimes(1);
  });

  it('should call loadPlaylistDataService.load once', async () => {
    loadPlaylistDataService.load.mockResolvedValue(mockPlaylistResponse);

    await controller.load('123');

    expect(loadPlaylistDataService.load).toHaveBeenCalledTimes(1);
  });

  it('should call loadPlaylistTracksService.load once', async () => {
    loadPlaylistTracksService.load.mockResolvedValue({
      tracks: [],
      total: 0,
    });

    await controller.loadTracks('123', {
      search: 'test',
    });

    expect(loadPlaylistTracksService.load).toHaveBeenCalledTimes(1);
  });

  it('should call importPlaylistService.import once', async () => {
    importPlaylistService.import.mockResolvedValue(mockPlaylistResponse);

    await controller.import({
      platform: Platform.YOUTUBE_MUSIC,
      platformId: '123',
      userId: '456',
    });

    expect(importPlaylistService.import).toHaveBeenCalledTimes(1);
  });

  it('should call addTracksToPlaylistService.add once', async () => {
    addTracksToPlaylistService.addTracks.mockResolvedValue(undefined);

    await controller.addTracks('123', {
      tracks: [
        {
          platform: Platform.SPOTIFY,
          platformId: '123',
        },
      ],
    });

    expect(addTracksToPlaylistService.addTracks).toHaveBeenCalledTimes(1);
  });
});
