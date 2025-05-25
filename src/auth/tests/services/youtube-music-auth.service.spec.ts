import { Test, TestingModule } from '@nestjs/testing';
import { YoutubeMusicAuthService } from '../../services/youtube-music-auth.service';
import YTMusic from 'ytmusic-api';

jest.mock('ytmusic-api');

describe('YoutubeMusicAuthService', () => {
  let service: YoutubeMusicAuthService;
  let mockYTMusic: jest.Mocked<YTMusic>;

  beforeEach(async () => {
    mockYTMusic = {
      initialize: jest.fn(),
      getSong: jest.fn(),
      getPlaylistVideos: jest.fn(),
      getArtist: jest.fn(),
    } as any;

    (YTMusic as jest.Mock).mockImplementation(() => mockYTMusic);

    const module: TestingModule = await Test.createTestingModule({
      providers: [YoutubeMusicAuthService],
    }).compile();

    service = module.get<YoutubeMusicAuthService>(YoutubeMusicAuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize successfully', async () => {
    mockYTMusic.initialize.mockResolvedValueOnce(undefined);
    await expect(service.initialize()).resolves.not.toThrow();
  });

  it('should throw error when initialization fails', async () => {
    mockYTMusic.initialize.mockRejectedValueOnce(
      new Error('Initialization failed'),
    );
    await expect(service.initialize()).rejects.toThrow('Initialization failed');
  });

  it('should get track by id', async () => {
    const mockTrack = {
      type: 'SONG' as const,
      name: 'Test Track',
      videoId: 'track123',
      artist: {
        artistId: 'artist123',
        name: 'Test Artist',
      },
      duration: 180,
      thumbnails: [
        {
          url: 'https://example.com/thumb.jpg',
          width: 640,
          height: 480,
        },
      ],
      formats: [],
      adaptiveFormats: [],
    };
    mockYTMusic.getSong.mockResolvedValueOnce(mockTrack);

    const result = await service.getTrack('track123');
    expect(result).toEqual(mockTrack);
  });

  it('should throw error when getting track fails', async () => {
    mockYTMusic.getSong.mockRejectedValueOnce(new Error('Failed to get track'));
    await expect(service.getTrack('track123')).rejects.toThrow(
      'Failed to get track',
    );
  });

  it('should get playlist by id', async () => {
    const mockPlaylist = [
      {
        type: 'VIDEO' as const,
        name: 'Test Video',
        videoId: 'video1',
        artist: {
          artistId: 'artist123',
          name: 'Test Artist',
        },
        duration: 180,
        thumbnails: [
          {
            url: 'https://example.com/thumb.jpg',
            width: 640,
            height: 480,
          },
        ],
      },
    ];
    mockYTMusic.getPlaylistVideos.mockResolvedValueOnce(mockPlaylist);

    const result = await service.getPlaylist('playlist123');
    expect(result).toEqual(mockPlaylist);
  });

  it('should throw error when getting playlist fails', async () => {
    mockYTMusic.getPlaylistVideos.mockRejectedValueOnce(
      new Error('Failed to get playlist'),
    );
    await expect(service.getPlaylist('playlist123')).rejects.toThrow(
      'Failed to get playlist',
    );
  });

  it('should get artist by id', async () => {
    const mockArtist = {
      type: 'ARTIST' as const,
      artistId: 'artist123',
      name: 'Test Artist',
      thumbnails: [
        {
          url: 'https://example.com/thumb.jpg',
          width: 640,
          height: 480,
        },
      ],
      topSongs: [],
      topAlbums: [],
      topSingles: [],
      topVideos: [],
      featuredOn: [],
      similarArtists: [],
    };
    mockYTMusic.getArtist.mockResolvedValueOnce(mockArtist);

    const result = await service.getArtist('artist123');
    expect(result).toEqual(mockArtist);
  });

  it('should throw error when getting artist fails', async () => {
    mockYTMusic.getArtist.mockRejectedValueOnce(
      new Error('Failed to get artist'),
    );
    await expect(service.getArtist('artist123')).rejects.toThrow(
      'Failed to get artist',
    );
  });
});
