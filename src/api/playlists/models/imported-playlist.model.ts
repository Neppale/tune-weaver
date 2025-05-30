import { Platform } from '@prisma/client';

export class ImportedPlaylist {
  name: string;
  trackIds: string[];
  platform: Platform;
}
