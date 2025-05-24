import { Platform } from '@prisma/client';

export class CreateTrackDto {
  platform: Platform;
  platformId: string;
}

export class CreateSourcePlaylistDto {
  platform: Platform;
  platformId: string;
}

export class UpdatePlaylistDto {
  name?: string;
  type?: string;
  value?: string;
}

export class AddTrackDto {
  platform: Platform;
  platformId: string;
}

export class AddTracksDto {
  tracks: AddTrackDto[];
}
