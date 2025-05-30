import { Platform } from '@prisma/client';

export interface CreateTrackPlatformParams {
  trackId: string;
  platform: Platform;
  platformId: string;
}
