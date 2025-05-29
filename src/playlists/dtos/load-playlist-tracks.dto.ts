import { IsNumber, IsString, IsOptional } from 'class-validator';

export class LoadPlaylistTracksDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  size?: number;
}
