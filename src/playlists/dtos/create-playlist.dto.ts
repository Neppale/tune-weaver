import { CreateSourcePlaylistDto, CreateTrackDto } from './playlist.dto';

export class CreatePlaylistDto {
  name: string;
  type: string;
  value?: string;
  userId: string;
  tracks?: CreateTrackDto[];
  sourcePlaylist?: CreateSourcePlaylistDto;
}
