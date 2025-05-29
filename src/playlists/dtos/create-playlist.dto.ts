import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreatePlaylistDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  sourcePlaylistId?: string;
}
