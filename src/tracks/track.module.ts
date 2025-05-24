import { Module } from '@nestjs/common';
import { GetSpotifyTrackDataByTrackIdService } from './services/get-spotify-track-data-by-track-id.service';
import { AddTracksToPlaylistRepository } from './repositories/add-tracks-to-playlist.repository';
import { RemoveTrackFromPlaylistRepository } from './repositories/remove-track-from-playlist.repository';
import { ValidatePlaylistTracksValidator } from './validators/validate-playlist-tracks.validator';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { GetTracksBySpotifyPlaylistId } from './services/get-tracks-by-spotify-playlist-id.service';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [
    GetSpotifyTrackDataByTrackIdService,
    AddTracksToPlaylistRepository,
    RemoveTrackFromPlaylistRepository,
    ValidatePlaylistTracksValidator,
    GetTracksBySpotifyPlaylistId,
  ],
  exports: [
    GetSpotifyTrackDataByTrackIdService,
    AddTracksToPlaylistRepository,
    RemoveTrackFromPlaylistRepository,
    ValidatePlaylistTracksValidator,
    GetTracksBySpotifyPlaylistId,
  ],
})
export class TrackModule {}
