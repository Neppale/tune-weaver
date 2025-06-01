import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class UpdateTrackDto {
  @IsString()
  name: string;

  @IsString()
  artist: string;

  @IsString()
  album: string;

  @IsNumber()
  duration: number;

  @IsBoolean()
  isEnriched: boolean;
}
