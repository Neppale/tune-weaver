import { Module } from '@nestjs/common';
import { GetSpotifyTrackDataByTrackIdService } from './services/get-spotify-track-data-by-track-id.service';
import { GetYouTubeMusicTrackDataByTrackIdService } from './services/get-youtube-music-track-data-by-track-id.service';
import { GetTrackDataByPlatformService } from '@Tracks/services/get-track-data-by-platform.service';
import { AuthModule } from '@Auth/auth.module';
import { GetTrackIdsByPlaylistIdService } from '@Tracks/services/get-track-ids-by-playlist-id.service';
import { TrackRepositoriesModule } from '@Tracks/track-repositories.module';
import { CreateTracksService } from '@Tracks/services/create-tracks.service';
import { SearchTracksService } from '@Tracks/services/search-tracks.service';

@Module({
  imports: [AuthModule, TrackRepositoriesModule],
  providers: [
    GetTrackDataByPlatformService,
    GetSpotifyTrackDataByTrackIdService,
    GetYouTubeMusicTrackDataByTrackIdService,
    GetTrackIdsByPlaylistIdService,
    CreateTracksService,
    SearchTracksService,
  ],
  exports: [
    GetTrackDataByPlatformService,
    GetSpotifyTrackDataByTrackIdService,
    GetYouTubeMusicTrackDataByTrackIdService,
    GetTrackIdsByPlaylistIdService,
    CreateTracksService,
    SearchTracksService,
  ],
})
export class TrackServicesModule {}
