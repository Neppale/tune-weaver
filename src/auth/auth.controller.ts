import { Controller, Get, Query, Param, ParseEnumPipe } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { Platform } from '@prisma/client';
import {
  InvalidAuthCodeException,
  InvalidRefreshTokenException,
} from '@Exceptions/auth.exception';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get(':platform')
  getAuthUrl(
    @Param('platform', new ParseEnumPipe(Platform)) platform: Platform,
  ) {
    const url = this.authService.getAuthUrl(platform);
    return { url };
  }

  @Get(':platform/callback')
  async handleCallback(
    @Param('platform', new ParseEnumPipe(Platform)) platform: Platform,
    @Query('code') code: string,
  ) {
    if (!code) {
      throw new InvalidAuthCodeException(platform);
    }

    return this.authService.getAccessToken(platform, code);
  }

  @Get(':platform/refresh')
  async refreshToken(
    @Param('platform', new ParseEnumPipe(Platform)) platform: Platform,
    @Query('refreshToken') refreshToken: string,
  ) {
    if (!refreshToken) {
      throw new InvalidRefreshTokenException(platform);
    }

    return this.authService.refreshAccessToken(platform, refreshToken);
  }
}
