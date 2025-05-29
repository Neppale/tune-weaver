import { Module } from '@nestjs/common';
import { PrismaModule } from '@Prisma/prisma.module';
import { FindTrackByMetadataRepository } from './repositories/find-tracks-by-metadata.repository';
import { CreateTrackPlatformRepository } from './repositories/create-track-platform.repository';
import { UpdateTrackRepository } from './repositories/update-track.repository';
import { GetTrackDataByPlatformService } from '@Tracks/services/get-track-data-by-platform.service';
import { GetSpotifyTrackDataByTrackIdService } from '@Tracks/services/get-spotify-track-data-by-track-id.service';
import { GetYouTubeMusicTrackDataByTrackIdService } from '@Tracks/services/get-youtube-music-track-data-by-track-id.service';
import { AuthModule } from '@Auth/auth.module';
import { GetTrackIdsByPlaylistIdService } from '@Tracks/services/get-track-ids-by-playlist-id.service';
import { CreateTracksService } from '@Tracks/services/create-tracks.service';
import { CreateTracksRepository } from '@Tracks/repositories/create-tracks.repository';
import { LoadTrackPlatformByPlatformIdRepository } from '@Tracks/repositories/load-track-platform-by-platform-id.repository';
import { FindTrackByIdRepository } from './repositories/find-track-by-id.repository';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [
    FindTrackByMetadataRepository,
    CreateTrackPlatformRepository,
    UpdateTrackRepository,
    GetTrackDataByPlatformService,
    GetSpotifyTrackDataByTrackIdService,
    GetYouTubeMusicTrackDataByTrackIdService,
    GetTrackIdsByPlaylistIdService,
    CreateTracksService,
    CreateTracksRepository,
    LoadTrackPlatformByPlatformIdRepository,
    FindTrackByIdRepository,
  ],
  exports: [
    FindTrackByMetadataRepository,
    CreateTrackPlatformRepository,
    UpdateTrackRepository,
    GetTrackDataByPlatformService,
    GetSpotifyTrackDataByTrackIdService,
    GetYouTubeMusicTrackDataByTrackIdService,
    GetTrackIdsByPlaylistIdService,
    CreateTracksService,
    CreateTracksRepository,
    LoadTrackPlatformByPlatformIdRepository,
    FindTrackByIdRepository,
  ],
})
export class TrackModule {}
