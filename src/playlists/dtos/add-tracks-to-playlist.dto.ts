import { IsArray, IsEnum, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Platform } from '@prisma/client';

export class TrackPlatformDto {
  @IsString()
  platformId: string;

  @IsEnum(Platform)
  platform: Platform;
}

export class AddTracksToPlaylistDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TrackPlatformDto)
  tracks: TrackPlatformDto[];
}
