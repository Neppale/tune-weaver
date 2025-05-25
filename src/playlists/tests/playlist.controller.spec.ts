import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistController } from '../playlist.controller';
import { CreatePlaylistService } from '../services/create-playlist.service';
import {
  mockEmptyPlaylistData,
  mockPlaylistResponse,
} from './mocks/playlist.mock';
import { GetSamplePlaylistsService } from '../services/get-sample-playlists.service';
import { Platform } from '@prisma/client';

describe('PlaylistController', () => {
  let controller: PlaylistController;
  let createPlaylistService: jest.Mocked<CreatePlaylistService>;
  let getSamplePlaylistsService: jest.Mocked<GetSamplePlaylistsService>;

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
      ],
    }).compile();

    controller = module.get<PlaylistController>(PlaylistController);
    createPlaylistService = module.get<jest.Mocked<CreatePlaylistService>>(
      CreatePlaylistService,
    );
    getSamplePlaylistsService = module.get<
      jest.Mocked<GetSamplePlaylistsService>
    >(GetSamplePlaylistsService);
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
});
