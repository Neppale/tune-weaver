import { Module } from '@nestjs/common';
import { GetSpotifyTrackDataByTrackIdService } from './services/get-spotify-track-data-by-track-id.service';
import { RemoveTrackFromPlaylistRepository } from './repositories/remove-track-from-playlist.repository';
import { ValidatePlaylistTracksValidator } from './validators/validate-playlist-tracks.validator';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { GetTracksBySpotifyPlaylistId } from './services/get-tracks-by-spotify-playlist-id.service';
import { CreateTracksService } from './services/create-tracks.service';
import { TrackAlreadyExistsValidator } from './validators/track-already-exists.validator';
import { LoadTrackPlatformByPlatformIdRepository } from './repositories/load-track-platform-by-platform-id.repository';
import { FindTracksByMetadataRepository } from './repositories/find-tracks-by-metadata.repository';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [
    GetSpotifyTrackDataByTrackIdService,
    RemoveTrackFromPlaylistRepository,
    ValidatePlaylistTracksValidator,
    GetTracksBySpotifyPlaylistId,
    CreateTracksService,
    TrackAlreadyExistsValidator,
    LoadTrackPlatformByPlatformIdRepository,
    FindTracksByMetadataRepository,
  ],
  exports: [
    GetSpotifyTrackDataByTrackIdService,
    RemoveTrackFromPlaylistRepository,
    ValidatePlaylistTracksValidator,
    GetTracksBySpotifyPlaylistId,
    CreateTracksService,
    TrackAlreadyExistsValidator,
    LoadTrackPlatformByPlatformIdRepository,
    FindTracksByMetadataRepository,
  ],
})
export class TrackModule {}
