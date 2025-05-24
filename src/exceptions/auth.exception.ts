import { HttpException, HttpStatus } from '@nestjs/common';

export enum Platform {
  SPOTIFY = 'spotify',
  // Add more platforms here as they are implemented
  // SOUNDCLOUD = 'soundcloud',
  // APPLE_MUSIC = 'apple_music',
}

export class AuthException extends HttpException {
  constructor(message: string, platform?: Platform) {
    const errorMessage = platform
      ? `Authentication error for ${platform}: ${message}`
      : `Authentication error: ${message}`;
    super(errorMessage, HttpStatus.UNAUTHORIZED);
  }
}

export class PlatformNotSupportedException extends AuthException {
  constructor(platform: string) {
    super(`Platform ${platform} is not supported`);
  }
}

export class InvalidAuthCodeException extends AuthException {
  constructor(platform: Platform) {
    super('No authorization code provided', platform);
  }
}

export class InvalidRefreshTokenException extends AuthException {
  constructor(platform: Platform) {
    super('No refresh token provided', platform);
  }
}
