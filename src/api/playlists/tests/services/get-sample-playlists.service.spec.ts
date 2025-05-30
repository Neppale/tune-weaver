import { Test, TestingModule } from '@nestjs/testing';
import { GetSamplePlaylistsService } from '@Playlists/services/get-sample-playlists.service';
import { GetTrackIdsByPlaylistIdService } from '@Tracks/services/get-track-ids-by-playlist-id.service';
import { GetTrackDataByPlatformService } from '@Tracks/services/get-track-data-by-platform.service';
import { mockTrackData } from '@Playlists/tests/mocks/track-data.mock';
import { Platform } from '@prisma/client';

describe('GetSamplePlaylistsService', () => {
  let service: GetSamplePlaylistsService;
  let getTrackIdsByPlaylistIdService: jest.Mocked<GetTrackIdsByPlaylistIdService>;
  let getTrackDataByPlatformService: jest.Mocked<GetTrackDataByPlatformService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetSamplePlaylistsService,
        {
          provide: GetTrackIdsByPlaylistIdService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: GetTrackDataByPlatformService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GetSamplePlaylistsService>(GetSamplePlaylistsService);
    getTrackIdsByPlaylistIdService = module.get(GetTrackIdsByPlaylistIdService);
    getTrackDataByPlatformService = module.get(GetTrackDataByPlatformService);
  });

  it('should call getTrackIdsByPlaylistIdService.get once', async () => {
    getTrackIdsByPlaylistIdService.get.mockResolvedValue(['track1']);
    getTrackDataByPlatformService.get.mockResolvedValue([mockTrackData]);

    await service.get(Platform.SPOTIFY, 'playlist1');

    expect(getTrackIdsByPlaylistIdService.get).toHaveBeenCalledTimes(1);
  });

  it('should call getTrackDataByPlatformService.get once', async () => {
    getTrackIdsByPlaylistIdService.get.mockResolvedValue(['track1']);
    getTrackDataByPlatformService.get.mockResolvedValue([mockTrackData]);

    await service.get(Platform.SPOTIFY, 'playlist1');

    expect(getTrackDataByPlatformService.get).toHaveBeenCalledTimes(1);
  });
});
