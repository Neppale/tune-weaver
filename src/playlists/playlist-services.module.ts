import { Module } from '@nestjs/common';
import { GetSamplePlaylistsService } from './services/get-sample-playlists.service';
import { CreatePlaylistService } from './services/create-playlist.service';
import { DeletePlaylistService } from './services/delete-playlist.service';
import { LoadPlaylistDataByIdService } from './services/load-playlist-data.service';
import { LoadPlaylistTracksService } from './services/load-playlist-tracks.service';
import { ImportPlaylistService } from './services/import-playlist.service';
import { FetchYoutubeMusicPlaylistService } from './services/youtube-music/fetch-youtube-music-playlist.service';
import { FetchSpotifyPlaylistService } from './services/spotify/fetch-spotify-playlist.service';
import { AddTracksToPlaylistService } from './services/add-tracks-to-playlist.service';
import { DeleteTracksFromPlaylistService } from './services/delete-tracks-from-playlist.service';
import { TrackServicesModule } from '@Tracks/track-services.module';
import { QueueModule } from '@Queue/queue.module';
import { PlaylistRepositoriesModule } from '@Playlists/playlist-repositories.module';
import { TrackRepositoriesModule } from '@Tracks/track-repositories.module';
import { AuthModule } from '@Auth/auth.module';

@Module({
  imports: [
    TrackServicesModule,
    QueueModule,
    PlaylistRepositoriesModule,
    TrackRepositoriesModule,
    AuthModule,
  ],
  providers: [
    GetSamplePlaylistsService,
    CreatePlaylistService,
    DeletePlaylistService,
    AddTracksToPlaylistService,
    LoadPlaylistDataByIdService,
    LoadPlaylistTracksService,
    ImportPlaylistService,
    FetchYoutubeMusicPlaylistService,
    FetchSpotifyPlaylistService,
    AddTracksToPlaylistService,
    DeleteTracksFromPlaylistService,
  ],
  exports: [
    GetSamplePlaylistsService,
    CreatePlaylistService,
    DeletePlaylistService,
    LoadPlaylistDataByIdService,
    LoadPlaylistTracksService,
    ImportPlaylistService,
    FetchYoutubeMusicPlaylistService,
    FetchSpotifyPlaylistService,
    AddTracksToPlaylistService,
    DeleteTracksFromPlaylistService,
  ],
})
export class PlaylistServicesModule {}
