import { Playlist } from '@prisma/client';
import {
  CreatePlaylistDto,
  UpdatePlaylistDto,
  AddTrackDto,
  AddTracksDto,
} from '../dtos/playlist.dto';

export interface ICreatePlaylistRepository {
  create(data: CreatePlaylistDto): Promise<Playlist>;
}

export interface IFindPlaylistRepository {
  findById(id: string): Promise<Playlist | null>;
  findByUserId(userId: string): Promise<Playlist[]>;
}

export interface IUpdatePlaylistRepository {
  update(id: string, data: UpdatePlaylistDto): Promise<Playlist>;
}

export interface IDeletePlaylistRepository {
  delete(id: string): Promise<Playlist>;
}

export interface IAddTrackToPlaylistRepository {
  addTrack(playlistId: string, track: AddTrackDto): Promise<Playlist>;
}

export interface IRemoveTrackFromPlaylistRepository {
  removeTrack(playlistId: string, trackId: string): Promise<Playlist>;
}

export interface IAddTracksToPlaylistRepository {
  addTracks(playlistId: string, data: AddTracksDto): Promise<Playlist>;
}
