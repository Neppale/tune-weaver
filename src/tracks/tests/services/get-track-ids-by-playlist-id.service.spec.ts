import { Test, TestingModule } from '@nestjs/testing';
import { GetTrackIdsByPlaylistIdService } from '../../services/get-track-ids-by-playlist-id.service';
import { SpotifyAuthService } from '@Auth/services/spotify-auth.service';
import { YoutubeMusicAuthService } from '@Auth/services/youtube-music-auth.service';
import { Platform } from '@prisma/client';
import { PlatformNotSupportedException } from '@Exceptions/auth.exception';

describe('GetTrackIdsByPlaylistIdService', () => {
  let service: GetTrackIdsByPlaylistIdService;
  let spotifyAuthService: jest.Mocked<SpotifyAuthService>;
  let youtubeMusicAuthService: jest.Mocked<YoutubeMusicAuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetTrackIdsByPlaylistIdService,
        {
          provide: SpotifyAuthService,
          useValue: {
            makeRequest: jest.fn(),
          },
        },
        {
          provide: YoutubeMusicAuthService,
          useValue: {
            getPlaylist: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GetTrackIdsByPlaylistIdService>(
      GetTrackIdsByPlaylistIdService,
    );
    spotifyAuthService = module.get(SpotifyAuthService);
    youtubeMusicAuthService = module.get(YoutubeMusicAuthService);
  });

  it('should fetch Spotify playlist track IDs', async () => {
    const mockSpotifyPlaylist = {
      tracks: {
        items: [
          { track: { id: 'track1' } },
          { track: { id: 'track2' } },
          { track: null },
        ],
      },
    };

    spotifyAuthService.makeRequest.mockResolvedValue(mockSpotifyPlaylist);

    const result = await service.get(Platform.SPOTIFY, 'playlist1');

    expect(result).toEqual(['track1', 'track2']);
  });

  it('should fetch YouTube Music playlist track IDs', async () => {
    const mockYouTubePlaylist = [
      {
        type: 'VIDEO' as const,
        videoId: 'track1',
        name: 'Test Track 1',
        artist: {
          artistId: 'artist1',
          name: 'Test Artist 1',
        },
        duration: 180,
        thumbnails: [
          { url: 'http://example.com/thumb1.jpg', width: 100, height: 100 },
        ],
      },
      {
        type: 'VIDEO' as const,
        videoId: 'track2',
        name: 'Test Track 2',
        artist: {
          artistId: 'artist2',
          name: 'Test Artist 2',
        },
        duration: 240,
        thumbnails: [
          { url: 'http://example.com/thumb2.jpg', width: 100, height: 100 },
        ],
      },
    ];

    youtubeMusicAuthService.getPlaylist.mockResolvedValue(mockYouTubePlaylist);

    const result = await service.get(Platform.YOUTUBE_MUSIC, 'playlist1');

    expect(result).toEqual(['track1', 'track2']);
  });

  it('should throw PlatformNotSupportedException for unsupported platform', async () => {
    await expect(
      service.get('UNSUPPORTED' as Platform, 'playlist1'),
    ).rejects.toThrow(PlatformNotSupportedException);
  });

  it('should throw exception on Spotify API error', async () => {
    spotifyAuthService.makeRequest.mockRejectedValue(new Error('API Error'));

    await expect(service.get(Platform.SPOTIFY, 'playlist1')).rejects.toThrow();
  });

  it('should throw exception on YouTube Music API error', async () => {
    youtubeMusicAuthService.getPlaylist.mockRejectedValue(
      new Error('API Error'),
    );

    await expect(
      service.get(Platform.YOUTUBE_MUSIC, 'playlist1'),
    ).rejects.toThrow();
  });

  it('should filter out null tracks from Spotify playlist', async () => {
    const mockSpotifyPlaylist = {
      tracks: {
        items: [
          { track: { id: 'track1' } },
          { track: null },
          { track: { id: 'track2' } },
        ],
      },
    };

    spotifyAuthService.makeRequest.mockResolvedValue(mockSpotifyPlaylist);

    const result = await service.get(Platform.SPOTIFY, 'playlist1');

    expect(result).toEqual(['track1', 'track2']);
  });

  it('should handle empty Spotify playlist', async () => {
    const mockSpotifyPlaylist = {
      tracks: {
        items: [],
      },
    };

    spotifyAuthService.makeRequest.mockResolvedValue(mockSpotifyPlaylist);

    const result = await service.get(Platform.SPOTIFY, 'playlist1');

    expect(result).toEqual([]);
  });

  it('should handle empty YouTube Music playlist', async () => {
    const mockYouTubePlaylist = [];

    youtubeMusicAuthService.getPlaylist.mockResolvedValue(mockYouTubePlaylist);

    const result = await service.get(Platform.YOUTUBE_MUSIC, 'playlist1');

    expect(result).toEqual([]);
  });
});
