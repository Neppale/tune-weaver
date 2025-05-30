import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Platform } from '@prisma/client';

export class ImportPlaylistDto {
  @IsEnum(Platform)
  @IsNotEmpty()
  platform: Platform;

  @IsString()
  @IsNotEmpty()
  platformId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
