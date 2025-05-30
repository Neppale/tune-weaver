import { IsNumber, IsString, IsOptional } from 'class-validator';

export class LoadPlaylistTracksDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsNumber()
  @IsOptional()
  page?: number = 1;

  @IsNumber()
  @IsOptional()
  size?: number = 100;
}
