import { IsArray } from 'class-validator';

export class DeleteTracksFromPlaylistDto {
  @IsArray()
  trackIds: string[];
}
