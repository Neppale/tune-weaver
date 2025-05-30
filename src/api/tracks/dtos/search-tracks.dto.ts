import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class SearchTracksDto {
  @IsString()
  @IsNotEmpty()
  search: string;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  page: number = 1;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  size: number = 10;
}
