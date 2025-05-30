import { HttpStatus } from '@nestjs/common';
import { Platform } from '@prisma/client';
import { AuthService } from '@Auth/services/auth.service';
import { BaseException } from './base.exception';

export class InvalidAuthCodeException extends BaseException {
  constructor(platform: Platform) {
    super(
      {
        message: `Invalid authorization code for ${platform}`,
        source: AuthService.name,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class InvalidRefreshTokenException extends BaseException {
  constructor(platform: Platform) {
    super(
      {
        message: `Invalid refresh token for ${platform}`,
        source: AuthService.name,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class PlatformNotSupportedException extends BaseException {
  constructor(platform: Platform) {
    super(
      {
        message: `Platform ${platform} is not supported`,
        source: AuthService.name,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
