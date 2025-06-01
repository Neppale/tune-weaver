import { Module } from '@nestjs/common';
import { GetSpotifyTrackDataByTrackIdService } from './services/get-spotify-track-data-by-track-id.service';
import { GetYouTubeMusicTrackDataByTrackIdService } from './services/get-youtube-music-track-data-by-track-id.service';
import { GetTrackDataByPlatformService } from '@Tracks/services/get-track-data-by-platform.service';
import { AuthModule } from '@Auth/auth.module';
import { GetTrackIdsByPlaylistIdService } from '@Tracks/services/get-track-ids-by-playlist-id.service';
import { TrackRepositoriesModule } from '@Tracks/track-repositories.module';
import { CreateTracksService } from '@Tracks/services/create-tracks.service';
import { SearchTracksService } from '@Tracks/services/search-tracks.service';
import { SendTrackToEnrichmentQueue } from './services/send-track-to-enrichment-queue.service';
import { QueueClientsModule } from '@Queue/queue-clients.module';
import { UpdateTrackService } from '@Tracks/services/update-track.service';

@Module({
  imports: [AuthModule, TrackRepositoriesModule, QueueClientsModule],
  providers: [
    GetTrackDataByPlatformService,
    GetSpotifyTrackDataByTrackIdService,
    GetYouTubeMusicTrackDataByTrackIdService,
    GetTrackIdsByPlaylistIdService,
    CreateTracksService,
    SearchTracksService,
    SendTrackToEnrichmentQueue,
    UpdateTrackService,
  ],
  exports: [
    GetTrackDataByPlatformService,
    GetSpotifyTrackDataByTrackIdService,
    GetYouTubeMusicTrackDataByTrackIdService,
    GetTrackIdsByPlaylistIdService,
    CreateTracksService,
    SearchTracksService,
    SendTrackToEnrichmentQueue,
    UpdateTrackService,
  ],
})
export class TrackServicesModule {}
