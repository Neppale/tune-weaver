import { Test, TestingModule } from '@nestjs/testing';
import { GetSpotifyTrackDataByTrackIdService } from '@Tracks/services/get-spotify-track-data-by-track-id.service';
import { SpotifyAuthService } from '@Auth/services/spotify-auth.service';
import { ServiceUnavailableException } from '@nestjs/common';

describe('GetSpotifyTrackDataByTrackIdService', () => {
  let service: GetSpotifyTrackDataByTrackIdService;
  let spotifyAuthService: jest.Mocked<SpotifyAuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetSpotifyTrackDataByTrackIdService,
        {
          provide: SpotifyAuthService,
          useValue: {
            makeRequest: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GetSpotifyTrackDataByTrackIdService>(
      GetSpotifyTrackDataByTrackIdService,
    );
    spotifyAuthService = module.get(SpotifyAuthService);
  });

  it('should fetch track data from Spotify API', async () => {
    const mockTrackResponse = {
      tracks: [
        {
          id: 'track1',
          name: 'Test Track',
          duration_ms: 180000,
          artists: [{ id: 'artist1', name: 'Test Artist' }],
          album: { id: 'album1', name: 'Test Album', release_date: '2024' },
        },
      ],
    };

    const mockArtistResponse = {
      id: 'artist1',
      genres: ['pop', 'rock'],
    };

    spotifyAuthService.makeRequest
      .mockResolvedValueOnce(mockTrackResponse)
      .mockResolvedValueOnce(mockArtistResponse);

    const result = await service.get(['track1']);

    expect(result[0].id).toBe('track1');
  });

  it('should map track data correctly', async () => {
    const mockTrackResponse = {
      tracks: [
        {
          id: 'track1',
          name: 'Test Track',
          duration_ms: 180000,
          artists: [{ id: 'artist1', name: 'Test Artist' }],
          album: { id: 'album1', name: 'Test Album', release_date: '2024' },
        },
      ],
    };

    const mockArtistResponse = {
      id: 'artist1',
      genres: ['pop', 'rock'],
    };

    spotifyAuthService.makeRequest
      .mockResolvedValueOnce(mockTrackResponse)
      .mockResolvedValueOnce(mockArtistResponse);

    const result = await service.get(['track1']);

    expect(result[0].name).toBe('Test Track');
  });

  it('should include artist genres in track data', async () => {
    const mockTrackResponse = {
      tracks: [
        {
          id: 'track1',
          name: 'Test Track',
          duration_ms: 180000,
          artists: [{ id: 'artist1', name: 'Test Artist' }],
          album: { id: 'album1', name: 'Test Album', release_date: '2024' },
        },
      ],
    };

    const mockArtistResponse = {
      id: 'artist1',
      genres: ['pop', 'rock'],
    };

    spotifyAuthService.makeRequest
      .mockResolvedValueOnce(mockTrackResponse)
      .mockResolvedValueOnce(mockArtistResponse);

    const result = await service.get(['track1']);

    expect(result[0].genres).toEqual(['pop', 'rock']);
  });

  it('should handle multiple tracks', async () => {
    const mockTrackResponse = {
      tracks: [
        {
          id: 'track1',
          name: 'Test Track 1',
          duration_ms: 180000,
          artists: [{ id: 'artist1', name: 'Test Artist 1' }],
          album: { id: 'album1', name: 'Test Album 1', release_date: '2024' },
        },
        {
          id: 'track2',
          name: 'Test Track 2',
          duration_ms: 240000,
          artists: [{ id: 'artist2', name: 'Test Artist 2' }],
          album: { id: 'album2', name: 'Test Album 2', release_date: '2024' },
        },
      ],
    };

    const mockArtistResponses = [
      { id: 'artist1', genres: ['pop'] },
      { id: 'artist2', genres: ['rock'] },
    ];

    spotifyAuthService.makeRequest
      .mockResolvedValueOnce(mockTrackResponse)
      .mockResolvedValueOnce(mockArtistResponses[0])
      .mockResolvedValueOnce(mockArtistResponses[1]);

    const result = await service.get(['track1', 'track2']);

    expect(result).toHaveLength(2);
  });

  it('should throw ServiceUnavailableException on API error', async () => {
    spotifyAuthService.makeRequest.mockRejectedValue(new Error('API Error'));

    await expect(service.get(['track1'])).rejects.toThrow(
      ServiceUnavailableException,
    );
  });

  it('should deduplicate genres from multiple artists', async () => {
    const mockTrackResponse = {
      tracks: [
        {
          id: 'track1',
          name: 'Test Track',
          duration_ms: 180000,
          artists: [
            { id: 'artist1', name: 'Test Artist 1' },
            { id: 'artist2', name: 'Test Artist 2' },
          ],
          album: { id: 'album1', name: 'Test Album', release_date: '2024' },
        },
      ],
    };

    const mockArtistResponses = [
      { id: 'artist1', genres: ['pop', 'rock'] },
      { id: 'artist2', genres: ['pop', 'jazz'] },
    ];

    spotifyAuthService.makeRequest
      .mockResolvedValueOnce(mockTrackResponse)
      .mockResolvedValueOnce(mockArtistResponses[0])
      .mockResolvedValueOnce(mockArtistResponses[1]);

    const result = await service.get(['track1']);

    expect(result[0].genres).toEqual(['pop', 'rock', 'jazz']);
  });
});
