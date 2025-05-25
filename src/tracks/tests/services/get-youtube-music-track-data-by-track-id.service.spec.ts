import { Test, TestingModule } from '@nestjs/testing';
import { GetYouTubeMusicTrackDataByTrackIdService } from '../../services/get-youtube-music-track-data-by-track-id.service';
import { YoutubeMusicAuthService } from '@Auth/services/youtube-music-auth.service';
import { ServiceUnavailableException } from '@nestjs/common';

describe('GetYouTubeMusicTrackDataByTrackIdService', () => {
  let service: GetYouTubeMusicTrackDataByTrackIdService;
  let youtubeMusicAuthService: jest.Mocked<YoutubeMusicAuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetYouTubeMusicTrackDataByTrackIdService,
        {
          provide: YoutubeMusicAuthService,
          useValue: {
            getTrack: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GetYouTubeMusicTrackDataByTrackIdService>(
      GetYouTubeMusicTrackDataByTrackIdService,
    );
    youtubeMusicAuthService = module.get(YoutubeMusicAuthService);
  });

  it('should fetch track data from YouTube Music API', async () => {
    const mockTrack = {
      type: 'SONG' as const,
      videoId: 'track1',
      name: 'Test Track',
      duration: 180,
      artist: {
        artistId: 'artist1',
        name: 'Test Artist',
      },
      thumbnails: [
        { url: 'http://example.com/thumb.jpg', width: 100, height: 100 },
      ],
      formats: [],
      adaptiveFormats: [],
    };

    youtubeMusicAuthService.getTrack.mockResolvedValue(mockTrack);

    const result = await service.get(['track1']);

    expect(result[0].id).toBe('track1');
  });

  it('should map track data correctly', async () => {
    const mockTrack = {
      type: 'SONG' as const,
      videoId: 'track1',
      name: 'Test Track',
      duration: 180,
      artist: {
        artistId: 'artist1',
        name: 'Test Artist',
      },
      thumbnails: [
        { url: 'http://example.com/thumb.jpg', width: 100, height: 100 },
      ],
      formats: [],
      adaptiveFormats: [],
    };

    youtubeMusicAuthService.getTrack.mockResolvedValue(mockTrack);

    const result = await service.get(['track1']);

    expect(result[0].name).toBe('Test Track');
  });

  it('should map artist data correctly', async () => {
    const mockTrack = {
      type: 'SONG' as const,
      videoId: 'track1',
      name: 'Test Track',
      duration: 180,
      artist: {
        artistId: 'artist1',
        name: 'Test Artist',
      },
      thumbnails: [
        { url: 'http://example.com/thumb.jpg', width: 100, height: 100 },
      ],
      formats: [],
      adaptiveFormats: [],
    };

    youtubeMusicAuthService.getTrack.mockResolvedValue(mockTrack);

    const result = await service.get(['track1']);

    expect(result[0].artists[0].name).toBe('Test Artist');
  });

  it('should handle multiple tracks', async () => {
    const mockTracks = [
      {
        type: 'SONG' as const,
        videoId: 'track1',
        name: 'Test Track 1',
        duration: 180,
        artist: {
          artistId: 'artist1',
          name: 'Test Artist 1',
        },
        thumbnails: [
          { url: 'http://example.com/thumb1.jpg', width: 100, height: 100 },
        ],
        formats: [],
        adaptiveFormats: [],
      },
      {
        type: 'SONG' as const,
        videoId: 'track2',
        name: 'Test Track 2',
        duration: 240,
        artist: {
          artistId: 'artist2',
          name: 'Test Artist 2',
        },
        thumbnails: [
          { url: 'http://example.com/thumb2.jpg', width: 100, height: 100 },
        ],
        formats: [],
        adaptiveFormats: [],
      },
    ];

    youtubeMusicAuthService.getTrack
      .mockResolvedValueOnce(mockTracks[0])
      .mockResolvedValueOnce(mockTracks[1]);

    const result = await service.get(['track1', 'track2']);

    expect(result).toHaveLength(2);
  });

  it('should throw ServiceUnavailableException on API error', async () => {
    youtubeMusicAuthService.getTrack.mockRejectedValue(new Error('API Error'));

    await expect(service.get(['track1'])).rejects.toThrow(
      ServiceUnavailableException,
    );
  });

  it('should map duration correctly', async () => {
    const mockTrack = {
      type: 'SONG' as const,
      videoId: 'track1',
      name: 'Test Track',
      duration: 180,
      artist: {
        artistId: 'artist1',
        name: 'Test Artist',
      },
      thumbnails: [
        { url: 'http://example.com/thumb.jpg', width: 100, height: 100 },
      ],
      formats: [],
      adaptiveFormats: [],
    };

    youtubeMusicAuthService.getTrack.mockResolvedValue(mockTrack);

    const result = await service.get(['track1']);

    expect(result[0].duration).toBe(180);
  });
});
