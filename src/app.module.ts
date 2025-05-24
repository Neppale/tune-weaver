import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PlaylistController } from './playlists/playlist.controller';
import { AuthController } from './auth/auth.controller';
import { SpotifyAuthService } from './auth/services/spotify-auth.service';
import { GetSpotifyTrackDataByTrackIdService } from './tracks/services/get-spotify-track-data-by-track-id.service';
import { SpotifyPlaylistService } from './playlists/services/spotify-playlist.service';
import { PlaylistOrganizerService } from './playlists/services/playlist-organizer.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthService } from './auth/services/auth.service';
import { CreatePlaylistRepository } from './playlists/repositories/create-playlist.repository';
import { AddTracksToPlaylistRepository } from './tracks/repositories/add-tracks-to-playlist.repository';

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
    SpotifyPlaylistService,
    PlaylistOrganizerService,
    PrismaService,
    AuthService,
    CreatePlaylistRepository,
    AddTracksToPlaylistRepository,
  ],
})
export class AppModule {}
