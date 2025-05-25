import { Platform } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';
import { IsNotEmpty } from 'class-validator';

export class CreateTrackDto {
  @IsNotEmpty()
  @IsEnum(Platform)
  platform: Platform;

  @IsNotEmpty()
  @IsString()
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
