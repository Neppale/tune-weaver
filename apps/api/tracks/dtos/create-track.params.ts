import { Platform } from '@prisma/client';

export class CreateTrackParams {
  platform: Platform;
  platformId: string;
  name: string;
  artist: string;
  album?: string;
  duration: number;
}
