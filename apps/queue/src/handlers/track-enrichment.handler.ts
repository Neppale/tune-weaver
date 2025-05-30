import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Transport } from '@nestjs/microservices';
import { Platform } from '@prisma/client';
import { EnrichTrackService } from '@Queue/src/services/enrich-track.service';

@Controller()
export class TrackEnrichmentHandler {
  private readonly logger = new Logger(TrackEnrichmentHandler.name);
  constructor(private readonly enrichTrackService: EnrichTrackService) {}

  @EventPattern('track.enrichment', Transport.RMQ)
  async handle(data: { trackId: string; platform: Platform }) {
    this.logger.log(`Received track enrichment for trackId: ${data.trackId}`);
    await this.enrichTrackService.enrich(data);
  }
}
