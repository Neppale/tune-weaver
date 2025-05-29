import { Type } from 'class-transformer';
import { CreateTrackDto } from './playlist.dto';
import {
  IsString,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class CreatePlaylistDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsOptional()
  value?: string;

  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTrackDto)
  tracks: CreateTrackDto[];

  @IsOptional()
  @IsArray({ each: true })
  existingTrackIds?: string[];

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  sourcePlaylistId?: string;
}
