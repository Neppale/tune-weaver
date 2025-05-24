import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PlaylistController } from './controllers/playlist.controller';
import { AuthController } from './controllers/auth.controller';
import { SpotifyService } from './services/spotify.service';
import { PlaylistOrganizerService } from './services/playlist-organizer.service';
import { PrismaService } from './services/prisma.service';
import { AuthService } from './services/auth.service';
import { CreatePlaylistRepository } from './repositories/implementations/playlists/create-playlist.repository';
import { AddTracksToPlaylistRepository } from './repositories/implementations/tracks/add-tracks-to-playlist.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [PlaylistController, AuthController],
  providers: [
    SpotifyService,
    PlaylistOrganizerService,
    PrismaService,
    AuthService,
    CreatePlaylistRepository,
    AddTracksToPlaylistRepository,
  ],
})
export class AppModule {}
