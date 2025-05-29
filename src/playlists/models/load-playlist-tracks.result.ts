import { Track } from '@prisma/client';

export interface LoadPlaylistTracksResult {
  tracks: Track[];
  total: number;
}
