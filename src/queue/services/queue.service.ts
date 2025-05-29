import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { Platform } from '@prisma/client';

@Injectable()
export class QueueService implements OnModuleInit {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL],
        queue: 'track_enrichment',
        queueOptions: {
          durable: true,
        },
      },
    });
  }

  async onModuleInit() {
    await this.client.connect();
  }

  async publishTrackEnrichment(trackId: string, platform: Platform) {
    return this.client.emit('track.enrichment', { trackId, platform });
  }
}
