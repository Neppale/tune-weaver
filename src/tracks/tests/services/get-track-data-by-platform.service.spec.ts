import { Test, TestingModule } from '@nestjs/testing';
import { GetTrackDataByPlatformService } from '../../services/get-track-data-by-platform.service';
import { GetSpotifyTrackDataByTrackIdService } from '../../services/get-spotify-track-data-by-track-id.service';
import { GetYouTubeMusicTrackDataByTrackIdService } from '../../services/get-youtube-music-track-data-by-track-id.service';
import { Platform } from '@prisma/client';
import { PlatformNotSupportedException } from '@Exceptions/auth.exception';

describe('GetTrackDataByPlatformService', () => {
  let service: GetTrackDataByPlatformService;
  let getSpotifyTrackDataByTrackIdService: jest.Mocked<GetSpotifyTrackDataByTrackIdService>;
  let getYouTubeMusicTrackDataByTrackIdService: jest.Mocked<GetYouTubeMusicTrackDataByTrackIdService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetTrackDataByPlatformService,
        {
          provide: GetSpotifyTrackDataByTrackIdService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: GetYouTubeMusicTrackDataByTrackIdService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GetTrackDataByPlatformService>(
      GetTrackDataByPlatformService,
    );
    getSpotifyTrackDataByTrackIdService = module.get(
      GetSpotifyTrackDataByTrackIdService,
    );
    getYouTubeMusicTrackDataByTrackIdService = module.get(
      GetYouTubeMusicTrackDataByTrackIdService,
    );
  });

  it('should fetch Spotify track data', async () => {
    const mockSpotifyTrack = {
      id: 'track1',
      name: 'Test Track',
      duration_ms: 180000,
      artists: [{ id: 'artist1', name: 'Test Artist' }],
      album: { id: 'album1', name: 'Test Album', releaseDate: '2024' },
      genres: ['pop'],
    };

    getSpotifyTrackDataByTrackIdService.get.mockResolvedValue([
      mockSpotifyTrack,
    ]);

    const result = await service.get(Platform.SPOTIFY, ['track1']);

    expect(result[0].id).toBe('track1');
  });

  it('should map Spotify track duration correctly', async () => {
    const mockSpotifyTrack = {
      id: 'track1',
      name: 'Test Track',
      duration_ms: 180000,
      artists: [{ id: 'artist1', name: 'Test Artist' }],
      album: { id: 'album1', name: 'Test Album', releaseDate: '2024' },
      genres: ['pop'],
    };

    getSpotifyTrackDataByTrackIdService.get.mockResolvedValue([
      mockSpotifyTrack,
    ]);

    const result = await service.get(Platform.SPOTIFY, ['track1']);

    expect(result[0].duration).toBe(180);
  });

  it('should fetch YouTube Music track data', async () => {
    const mockYouTubeTrack = {
      id: 'track1',
      name: 'Test Track',
      duration: 180,
      artists: [{ id: 'artist1', name: 'Test Artist' }],
      album: { id: 'album1', name: 'Test Album', releaseDate: '2024' },
    };

    getYouTubeMusicTrackDataByTrackIdService.get.mockResolvedValue([
      mockYouTubeTrack,
    ]);

    const result = await service.get(Platform.YOUTUBE_MUSIC, ['track1']);

    expect(result[0].id).toBe('track1');
  });

  it('should map YouTube Music track duration correctly', async () => {
    const mockYouTubeTrack = {
      id: 'track1',
      name: 'Test Track',
      duration: 180,
      artists: [{ id: 'artist1', name: 'Test Artist' }],
      album: { id: 'album1', name: 'Test Album', releaseDate: '2024' },
    };

    getYouTubeMusicTrackDataByTrackIdService.get.mockResolvedValue([
      mockYouTubeTrack,
    ]);

    const result = await service.get(Platform.YOUTUBE_MUSIC, ['track1']);

    expect(result[0].duration).toBe(180);
  });

  it('should throw PlatformNotSupportedException for unsupported platform', async () => {
    await expect(
      service.get('UNSUPPORTED' as Platform, ['track1']),
    ).rejects.toThrow(PlatformNotSupportedException);
  });

  it('should handle multiple Spotify tracks', async () => {
    const mockSpotifyTracks = [
      {
        id: 'track1',
        name: 'Test Track 1',
        duration_ms: 180000,
        artists: [{ id: 'artist1', name: 'Test Artist 1' }],
        album: { id: 'album1', name: 'Test Album 1', releaseDate: '2024' },
        genres: ['pop'],
      },
      {
        id: 'track2',
        name: 'Test Track 2',
        duration_ms: 240000,
        artists: [{ id: 'artist2', name: 'Test Artist 2' }],
        album: { id: 'album2', name: 'Test Album 2', releaseDate: '2024' },
        genres: ['rock'],
      },
    ];

    getSpotifyTrackDataByTrackIdService.get.mockResolvedValue(
      mockSpotifyTracks,
    );

    const result = await service.get(Platform.SPOTIFY, ['track1', 'track2']);

    expect(result).toHaveLength(2);
  });

  it('should handle multiple YouTube Music tracks', async () => {
    const mockYouTubeTracks = [
      {
        id: 'track1',
        name: 'Test Track 1',
        duration: 180,
        artists: [{ id: 'artist1', name: 'Test Artist 1' }],
        album: { id: 'album1', name: 'Test Album 1', releaseDate: '2024' },
      },
      {
        id: 'track2',
        name: 'Test Track 2',
        duration: 240,
        artists: [{ id: 'artist2', name: 'Test Artist 2' }],
        album: { id: 'album2', name: 'Test Album 2', releaseDate: '2024' },
      },
    ];

    getYouTubeMusicTrackDataByTrackIdService.get.mockResolvedValue(
      mockYouTubeTracks,
    );

    const result = await service.get(Platform.YOUTUBE_MUSIC, [
      'track1',
      'track2',
    ]);

    expect(result).toHaveLength(2);
  });
});
