import { Test, TestingModule } from '@nestjs/testing';
import { SpotifyAuthService } from '../../services/spotify-auth.service';
import axios from 'axios';

jest.mock('axios');

describe('SpotifyAuthService', () => {
  let service: SpotifyAuthService;
  const mockAxios = axios as jest.Mocked<typeof axios>;

  beforeEach(async () => {
    process.env.SPOTIFY_CLIENT_ID = 'test-client-id';
    process.env.SPOTIFY_CLIENT_SECRET = 'test-client-secret';
    process.env.SPOTIFY_REDIRECT_URI = 'test-redirect-uri';

    (mockAxios.post as jest.Mock).mockResolvedValue({
      data: {
        access_token: 'test-access-token',
      },
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [SpotifyAuthService],
    }).compile();

    service = module.get<SpotifyAuthService>(SpotifyAuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with client credentials', async () => {
    const token = await service.getAccessToken();
    expect(token).toBe('test-access-token');
  });

  it('should set access token manually', async () => {
    service.setAccessToken('manual-token');
    const token = await service.getAccessToken();
    expect(token).toBe('manual-token');
  });

  it('should return access token', async () => {
    jest.clearAllMocks();
    const token = await service.getAccessToken();
    expect(token).toBe('test-access-token');
  });

  it('should generate correct authorization URL', () => {
    const url = service.getAuthorizationUrl();
    expect(url).toContain('https://accounts.spotify.com/authorize');
  });

  it('should include required scopes in authorization URL', () => {
    const url = service.getAuthorizationUrl();
    expect(url).toContain('playlist-read-private');
    expect(url).toContain('playlist-read-collaborative');
    expect(url).toContain('user-read-private');
    expect(url).toContain('user-read-email');
  });

  it('should include client ID in authorization URL', () => {
    const url = service.getAuthorizationUrl();
    expect(url).toContain('test-client-id');
  });

  it('should include redirect URI in authorization URL', () => {
    const url = service.getAuthorizationUrl();
    expect(url).toContain('test-redirect-uri');
  });

  it('should make successful API request', async () => {
    (mockAxios as unknown as jest.Mock).mockResolvedValueOnce({
      data: { items: [] },
    });

    const result = await service.makeRequest('/test-endpoint');
    expect(result).toEqual({ items: [] });
  });

  it('should retry request with new token on 401 error', async () => {
    (mockAxios as unknown as jest.Mock).mockRejectedValueOnce({
      response: { status: 401 },
    });
    (mockAxios as unknown as jest.Mock).mockResolvedValueOnce({
      data: { items: [] },
    });

    const result = await service.makeRequest('/test-endpoint');
    expect(result).toEqual({ items: [] });
  });

  it('should throw error on non-401 API error', async () => {
    (mockAxios as unknown as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    await expect(service.makeRequest('/test-endpoint')).rejects.toThrow();
  });

  it('should include authorization header in API request', async () => {
    (mockAxios as unknown as jest.Mock).mockResolvedValueOnce({
      data: { items: [] },
    });

    await service.makeRequest('/test-endpoint');
    expect(mockAxios).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-access-token',
        }),
      }),
    );
  });
});
