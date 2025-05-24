import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PlaylistController } from './playlists/playlist.controller';
import { AuthController } from './auth/auth.controller';
import { SpotifyAuthService } from './auth/services/spotify-auth.service';
import { GetSpotifyTrackDataByTrackIdService } from './tracks/services/get-spotify-track-data-by-track-id.service';
import { GetTracksBySpotifyPlaylistId } from './playlists/services/get-tracks-by-spotify-playlist-id.service';
import { GetSamplePlaylistsService } from './playlists/services/get-sample-playlists.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthService } from './auth/services/auth.service';
import { CreatePlaylistRepository } from './playlists/repositories/create-playlist.repository';
import { AddTracksToPlaylistRepository } from './tracks/repositories/add-tracks-to-playlist.repository';
import { RemoveTrackFromPlaylistRepository } from './tracks/repositories/remove-track-from-playlist.repository';
import { CreatePlaylistService } from './playlists/services/create-playlist.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [PlaylistController, AuthController],
  providers: [
    SpotifyAuthService,
    GetSpotifyTrackDataByTrackIdService,
    GetTracksBySpotifyPlaylistId,
    GetSamplePlaylistsService,
    PrismaService,
    AuthService,
    CreatePlaylistRepository,
    AddTracksToPlaylistRepository,
    RemoveTrackFromPlaylistRepository,
    CreatePlaylistService,
  ],
})
export class AppModule {}
