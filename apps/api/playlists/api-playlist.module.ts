import { Module } from '@nestjs/common';
import { PlaylistServicesModule } from './playlist-services.module';
import { TrackServicesModule } from '@Tracks/track-services.module';
import { TrackRepositoriesModule } from '@Tracks/track-repositories.module';
import { PlaylistController } from '@Playlists/playlist.controller';

@Module({
  imports: [
    PlaylistServicesModule,
    TrackServicesModule,
    TrackRepositoriesModule,
  ],
  controllers: [PlaylistController],
})
export class ApiPlaylistModule {}
