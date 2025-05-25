import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../services/auth.service';
import { Platform } from '@prisma/client';
import {
  InvalidAuthCodeException,
  InvalidRefreshTokenException,
} from '../../exceptions/auth.exception';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    authService = {
      getAuthUrl: jest.fn(),
      getAccessToken: jest.fn(),
      refreshAccessToken: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should return auth URL for platform', () => {
    const mockUrl = 'https://example.com/auth';
    authService.getAuthUrl.mockReturnValue(mockUrl);

    const result = controller.getAuthUrl(Platform.SPOTIFY);
    expect(result).toEqual({ url: mockUrl });
  });

  it('should get access token from callback', async () => {
    const mockTokens = {
      accessToken: 'test-access-token',
      refreshToken: 'test-refresh-token',
      expiresIn: 3600,
      platform: Platform.SPOTIFY,
    };
    authService.getAccessToken.mockResolvedValue(mockTokens);

    const result = await controller.handleCallback(
      Platform.SPOTIFY,
      'test-code',
    );
    expect(result).toEqual(mockTokens);
  });

  it('should throw InvalidAuthCodeException when code is missing', async () => {
    await expect(
      controller.handleCallback(Platform.SPOTIFY, ''),
    ).rejects.toThrow(InvalidAuthCodeException);
  });

  it('should refresh access token', async () => {
    const mockTokens = {
      accessToken: 'new-access-token',
      expiresIn: 3600,
      platform: Platform.SPOTIFY,
    };
    authService.refreshAccessToken.mockResolvedValue(mockTokens);

    const result = await controller.refreshToken(
      Platform.SPOTIFY,
      'test-refresh-token',
    );
    expect(result).toEqual(mockTokens);
  });

  it('should throw InvalidRefreshTokenException when refresh token is missing', async () => {
    await expect(controller.refreshToken(Platform.SPOTIFY, '')).rejects.toThrow(
      InvalidRefreshTokenException,
    );
  });
});
