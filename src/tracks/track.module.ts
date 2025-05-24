import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTracksService } from './services/create-tracks.service';
import { CreateTrackRepository } from './repositories/create-track.repository';
import { LoadTrackPlatformByPlatformIdRepository } from './repositories/load-track-platform-by-platform-id.repository';
import { FindTrackByMetadataRepository } from './repositories/find-tracks-by-metadata.repository';
import { GetSpotifyTrackDataByTrackIdService } from './services/get-spotify-track-data-by-track-id.service';
import { GetYouTubeMusicTrackDataByTrackIdService } from './services/get-youtube-music-track-data-by-track-id.service';
import { GetTrackDataByPlatformService } from './services/get-track-data-by-platform.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { GetTrackIdsByPlaylistIdService } from './services/get-track-ids-by-playlist-id.service';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [
    PrismaService,
    CreateTracksService,
    CreateTrackRepository,
    LoadTrackPlatformByPlatformIdRepository,
    FindTrackByMetadataRepository,
    GetSpotifyTrackDataByTrackIdService,
    GetYouTubeMusicTrackDataByTrackIdService,
    GetTrackDataByPlatformService,
    GetSpotifyTrackDataByTrackIdService,
    GetTrackIdsByPlaylistIdService,
  ],
  exports: [
    CreateTracksService,
    LoadTrackPlatformByPlatformIdRepository,
    FindTrackByMetadataRepository,
    GetTrackDataByPlatformService,
    GetSpotifyTrackDataByTrackIdService,
    GetYouTubeMusicTrackDataByTrackIdService,
    GetTrackIdsByPlaylistIdService,
  ],
})
export class TrackModule {}
