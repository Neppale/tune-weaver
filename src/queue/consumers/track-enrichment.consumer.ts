import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { GetTrackDataByPlatformService } from '@Tracks/services/get-track-data-by-platform.service';
import { FindTrackByMetadataRepository } from '@Tracks/repositories/find-tracks-by-metadata.repository';
import { CreateTrackPlatformRepository } from '@Tracks/repositories/create-track-platform.repository';
import { UpdateTrackRepository } from '@Tracks/repositories/update-track.repository';
import { FindTrackByIdRepository } from '@Tracks/repositories/find-track-by-id.repository';
import { Platform } from '@prisma/client';

@Controller()
export class TrackEnrichmentConsumer {
  private readonly logger = new Logger(TrackEnrichmentConsumer.name);

  constructor(
    private readonly getTrackDataByPlatformService: GetTrackDataByPlatformService,
    private readonly findTrackByMetadataRepository: FindTrackByMetadataRepository,
    private readonly createTrackPlatformRepository: CreateTrackPlatformRepository,
    private readonly updateTrackRepository: UpdateTrackRepository,
    private readonly findTrackByIdRepository: FindTrackByIdRepository,
  ) {}

  @EventPattern('track.enrichment')
  async handleTrackEnrichment(data: { trackId: string; platform: Platform }) {
    this.logger.log(`Starting track enrichment for trackId: ${data.trackId}`);

    try {
      const track = await this.findTrackByIdRepository.find(
        data.trackId,
        data.platform,
      );

      if (!track) {
        this.logger.warn(`Track not found for trackId: ${data.trackId}`);
        return;
      }

      if (track.isEnriched) {
        this.logger.log(`Track ${data.trackId} is already enriched`);
        return;
      }

      const platformTrack = track.platforms[0];
      this.logger.log(
        `Fetching track data for platform: ${platformTrack.platform}, platformId: ${platformTrack.platformId}`,
      );

      const trackData = await this.getTrackDataByPlatformService.get(
        platformTrack.platform,
        [platformTrack.platformId],
      );

      if (!trackData || trackData.length === 0) {
        this.logger.warn(
          `No track data returned for platformId: ${platformTrack.platformId}`,
        );
        return;
      }

      this.logger.log(
        `Searching for similar track with metadata: ${JSON.stringify({
          name: trackData[0].name,
          artist: trackData[0].artists[0].name,
          album: trackData[0].album?.name,
          duration: trackData[0].duration,
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
          `Found similar track with id: ${similarTrack.id}, creating platform link`,
        );
        await this.createTrackPlatformRepository.create({
          trackId: similarTrack.id,
          platform: platformTrack.platform,
          platformId: platformTrack.platformId,
          existingTrackId: track.id,
        });
      } else {
        this.logger.log(
          `No similar track found, updating track ${track.id} with enriched data`,
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
        `Successfully completed track enrichment for trackId: ${data.trackId}`,
      );
    } catch (error) {
      this.logger.error(
        `Error processing track enrichment for trackId ${data.trackId}:`,
        error.stack,
      );
      this.logger.error('Error details:', error);
      throw error;
    }
  }
}
