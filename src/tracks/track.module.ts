import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTracksService } from './services/create-tracks.service';
import { CreateTrackRepository } from './repositories/create-track.repository';
import { LoadTrackPlatformByPlatformIdRepository } from './repositories/load-track-platform-by-platform-id.repository';
import { FindTracksByMetadataRepository } from './repositories/find-tracks-by-metadata.repository';
import { GetSpotifyTrackDataByTrackIdService } from './services/get-spotify-track-data-by-track-id.service';
import { GetYouTubeMusicTrackDataByTrackIdService } from './services/get-youtube-music-track-data-by-track-id.service';
import { GetTrackDataByPlatformService } from './services/get-track-data-by-platform.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [
    PrismaService,
    CreateTracksService,
    CreateTrackRepository,
    LoadTrackPlatformByPlatformIdRepository,
    FindTracksByMetadataRepository,
    GetSpotifyTrackDataByTrackIdService,
    GetYouTubeMusicTrackDataByTrackIdService,
    GetTrackDataByPlatformService,
  ],
  exports: [
    CreateTracksService,
    LoadTrackPlatformByPlatformIdRepository,
    FindTracksByMetadataRepository,
    GetTrackDataByPlatformService,
  ],
})
export class TrackModule {}
