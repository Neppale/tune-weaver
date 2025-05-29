import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Transport } from '@nestjs/microservices';
import { Platform } from '@prisma/client';
import { GetTrackDataByPlatformService } from '@Tracks/services/get-track-data-by-platform.service';
import { FindTrackByMetadataRepository } from '@Tracks/repositories/find-tracks-by-metadata.repository';
import { CreateTrackPlatformRepository } from '@Tracks/repositories/create-track-platform.repository';
import { UpdateTrackRepository } from '@Tracks/repositories/update-track.repository';
import { FindTrackByIdRepository } from '@Tracks/repositories/find-track-by-id.repository';

@Controller()
export class TrackEnrichmentHandler {
  private readonly logger = new Logger(TrackEnrichmentHandler.name);
  constructor(
    private readonly getTrackDataByPlatformService: GetTrackDataByPlatformService,
    private readonly findTrackByMetadataRepository: FindTrackByMetadataRepository,
    private readonly createTrackPlatformRepository: CreateTrackPlatformRepository,
    private readonly updateTrackRepository: UpdateTrackRepository,
    private readonly findTrackByIdRepository: FindTrackByIdRepository,
  ) {}

  @EventPattern('track.enrichment', Transport.RMQ)
  async handle(data: { trackId: string; platform: Platform }) {
    this.logger.log('Received track enrichment message:', JSON.stringify(data));

    try {
      const track = await this.findTrackByIdRepository.find(
        data.trackId,
        data.platform,
      );
      if (!track) {
        this.logger.log('Track not found:', data.trackId);
        return;
      }

      if (track.isEnriched) {
        this.logger.log(
          `Track ${data.trackId} is already enriched for platform: ${data.platform}`,
        );
        return;
      }

      const platformTrack = track.platforms[0];
      this.logger.log(
        `Processing track enrichment for platform: ${platformTrack.platform}, platformId: ${platformTrack.platformId}`,
      );

      const trackData = await this.getTrackDataByPlatformService.get(
        platformTrack.platform,
        [platformTrack.platformId],
      );

      if (!trackData || trackData.length === 0) {
        this.logger.log(
          `No track data returned for platformId: ${platformTrack.platformId}, platform: ${platformTrack.platform}`,
        );
        return;
      }

      this.logger.log(
        `Searching for similar track with metadata: ${JSON.stringify({
          name: trackData[0].name,
          artist: trackData[0].artists[0].name,
          album: trackData[0].album?.name,
          duration: trackData[0].duration,
          platform: platformTrack.platform,
        })}`,
      );

      const similarTrack = await this.findTrackByMetadataRepository.find({
        name: trackData[0].name,
        artist: trackData[0].artists[0].name,
        album: trackData[0].album?.name,
        duration: trackData[0].duration,
        platform: platformTrack.platform,
        platformId: platformTrack.platformId,
      });

      if (similarTrack) {
        this.logger.log(
          `Found similar track with id: ${similarTrack.id}, creating platform link for platform: ${platformTrack.platform}`,
        );
        await this.createTrackPlatformRepository.create({
          trackId: similarTrack.id,
          platform: platformTrack.platform,
          platformId: platformTrack.platformId,
          existingTrackId: track.id,
        });
      } else {
        this.logger.log(
          `No similar track found, updating track ${track.id} with enriched data for platform: ${platformTrack.platform}`,
        );
        await this.updateTrackRepository.update(track.id, {
          name: trackData[0].name,
          artist: trackData[0].artists[0].name,
          album: trackData[0].album?.name,
          duration: trackData[0].duration,
          isEnriched: true,
        });
      }

      this.logger.log(
        `Successfully completed track enrichment for trackId: ${data.trackId}, platform: ${data.platform}`,
      );
    } catch (error) {
      this.logger.error('Error handling track enrichment:', error);
      throw error;
    }
  }
}
