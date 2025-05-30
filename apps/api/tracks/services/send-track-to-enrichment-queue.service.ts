import { Injectable, Logger, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Platform } from '@prisma/client';

@Injectable()
export class SendTrackToEnrichmentQueue {
  private readonly logger = new Logger(SendTrackToEnrichmentQueue.name);

  constructor(
    @Inject('TRACK_ENRICHMENT') private readonly client: ClientProxy,
  ) {}

  async publishTrackEnrichment(trackId: string, platform: Platform) {
    this.logger.log(
      `Publishing track enrichment for trackId: ${trackId}, platform: ${platform}`,
    );

    return this.client.emit('track.enrichment', { trackId, platform });
  }
}
