import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistController } from '@Playlists/playlist.controller';
import { CreatePlaylistService } from '@Playlists/services/create-playlist.service';
import {
  mockEmptyPlaylistData,
  mockPlaylistResponse,
} from './mocks/playlist.mock';
import { GetSamplePlaylistsService } from '@Playlists/services/get-sample-playlists.service';
import { Platform } from '@prisma/client';
import { SendTrackToEnrichmentQueue } from '@Tracks/services/send-track-to-enrichment-queue.service';
import { LoadPlaylistTracksService } from '@Playlists/services/load-playlist-tracks.service';
import { LoadPlaylistDataByIdService } from '@Playlists/services/load-playlist-data.service';
import { ImportPlaylistService } from '@Playlists/services/import-playlist.service';
import { AddTracksToPlaylistService } from '@Playlists/services/add-tracks-to-playlist.service';
import { DeleteTracksFromPlaylistService } from '@Playlists/services/delete-tracks-from-playlist.service';
import { DeletePlaylistService } from '@Playlists/services/delete-playlist.service';

describe('PlaylistController', () => {
  let controller: PlaylistController;
  let createPlaylistService: jest.Mocked<CreatePlaylistService>;
  let getSamplePlaylistsService: jest.Mocked<GetSamplePlaylistsService>;
  let loadPlaylistDataByIdService: jest.Mocked<LoadPlaylistDataByIdService>;
  let loadPlaylistTracksService: jest.Mocked<LoadPlaylistTracksService>;
  let importPlaylistService: jest.Mocked<ImportPlaylistService>;
  let addTracksToPlaylistService: jest.Mocked<AddTracksToPlaylistService>;
  let deleteTracksFromPlaylistService: jest.Mocked<DeleteTracksFromPlaylistService>;
  let deletePlaylistService: jest.Mocked<DeletePlaylistService>;

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
          provide: LoadPlaylistDataByIdService,
          useValue: {
            load: jest.fn(),
          },
        },
        {
          provide: SendTrackToEnrichmentQueue,
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
            add: jest.fn(),
          },
        },
        {
          provide: DeleteTracksFromPlaylistService,
          useValue: {
            delete: jest.fn(),
          },
        },
        {
          provide: DeletePlaylistService,
          useValue: {
            delete: jest.fn(),
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
    loadPlaylistDataByIdService = module.get<
      jest.Mocked<LoadPlaylistDataByIdService>
    >(LoadPlaylistDataByIdService);
    loadPlaylistTracksService = module.get<
      jest.Mocked<LoadPlaylistTracksService>
    >(LoadPlaylistTracksService);
    importPlaylistService = module.get<jest.Mocked<ImportPlaylistService>>(
      ImportPlaylistService,
    );
    addTracksToPlaylistService = module.get<
      jest.Mocked<AddTracksToPlaylistService>
    >(AddTracksToPlaylistService);
    deleteTracksFromPlaylistService = module.get<
      jest.Mocked<DeleteTracksFromPlaylistService>
    >(DeleteTracksFromPlaylistService);
    deletePlaylistService = module.get<jest.Mocked<DeletePlaylistService>>(
      DeletePlaylistService,
    );
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

  it('should call loadPlaylistDataByIdService.load once', async () => {
    loadPlaylistDataByIdService.load.mockResolvedValue(mockPlaylistResponse);

    await controller.load('123');

    expect(loadPlaylistDataByIdService.load).toHaveBeenCalledTimes(1);
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
    addTracksToPlaylistService.add.mockResolvedValue(undefined);

    await controller.addTracks('123', {
      tracks: [
        {
          platform: Platform.SPOTIFY,
          platformId: '123',
        },
      ],
    });

    expect(addTracksToPlaylistService.add).toHaveBeenCalledTimes(1);
  });

  it('should call deleteTracksFromPlaylistService.delete once', async () => {
    deleteTracksFromPlaylistService.delete.mockResolvedValue(undefined);

    await controller.deleteTracks('123', {
      trackIds: ['123'],
    });

    expect(deleteTracksFromPlaylistService.delete).toHaveBeenCalledTimes(1);
  });

  it('should call deletePlaylistService.delete once', async () => {
    deletePlaylistService.delete.mockResolvedValue(undefined);

    await controller.delete('123');

    expect(deletePlaylistService.delete).toHaveBeenCalledTimes(1);
  });
});
