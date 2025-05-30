import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '@Auth/services/auth.service';
import { Platform } from '@prisma/client';
import { PlatformNotSupportedException } from '@Exceptions/auth.exception';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';

jest.mock('@spotify/web-api-ts-sdk');
jest.mock('@Auth/services/youtube-music-auth.service');

describe('AuthService', () => {
  let service: AuthService;
  let mockSpotifyApi: jest.Mocked<SpotifyApi>;

  beforeEach(async () => {
    process.env.SPOTIFY_CLIENT_ID = 'test-client-id';
    process.env.SPOTIFY_CLIENT_SECRET = 'test-client-secret';
    process.env.SPOTIFY_REDIRECT_URI = 'test-redirect-uri';

    mockSpotifyApi = {
      createAuthorizeURL: jest.fn().mockReturnValue('spotify-auth-url'),
      authorizationCodeGrant: jest.fn().mockResolvedValue({
        body: {
          access_token: 'test-access-token',
          refresh_token: 'test-refresh-token',
          expires_in: 3600,
        },
      }),
      setRefreshToken: jest.fn(),
      refreshAccessToken: jest.fn().mockResolvedValue({
        body: {
          access_token: 'new-access-token',
          expires_in: 3600,
        },
      }),
    } as any;

    (SpotifyApi.withClientCredentials as jest.Mock).mockReturnValue(
      mockSpotifyApi,
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return Spotify auth URL when platform is Spotify', () => {
    const result = service.getAuthUrl(Platform.SPOTIFY);
    expect(result).toBe('spotify-auth-url');
  });

  it('should return empty string when platform is YouTube Music', () => {
    const result = service.getAuthUrl(Platform.YOUTUBE_MUSIC);
    expect(result).toBe('');
  });

  it('should throw PlatformNotSupportedException for unsupported platform in getAuthUrl', () => {
    expect(() => service.getAuthUrl('UNSUPPORTED' as Platform)).toThrow(
      PlatformNotSupportedException,
    );
  });

  it('should return auth tokens for Spotify', async () => {
    const result = await service.getAccessToken(Platform.SPOTIFY, 'test-code');
    expect(result).toEqual({
      accessToken: 'test-access-token',
      refreshToken: 'test-refresh-token',
      expiresIn: 3600,
      platform: Platform.SPOTIFY,
    });
  });

  it('should throw PlatformNotSupportedException for unsupported platform in getAccessToken', async () => {
    await expect(
      service.getAccessToken('UNSUPPORTED' as Platform, 'test-code'),
    ).rejects.toThrow(PlatformNotSupportedException);
  });

  it('should return new auth tokens for Spotify refresh', async () => {
    const result = await service.refreshAccessToken(
      Platform.SPOTIFY,
      'test-refresh-token',
    );
    expect(result).toEqual({
      accessToken: 'new-access-token',
      expiresIn: 3600,
      platform: Platform.SPOTIFY,
    });
  });

  it('should throw PlatformNotSupportedException for unsupported platform in refreshAccessToken', async () => {
    await expect(
      service.refreshAccessToken(
        'UNSUPPORTED' as Platform,
        'test-refresh-token',
      ),
    ).rejects.toThrow(PlatformNotSupportedException);
  });
});
