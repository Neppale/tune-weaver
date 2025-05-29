import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { QueueService } from './services/queue.service';
import { TrackEnrichmentHandler } from './handlers/track-enrichment.handler';
import { TrackModule } from '@Tracks/track.module';
import { AuthModule } from '@Auth/auth.module';
import { PrismaModule } from '@Prisma/prisma.module';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'TRACK_ENRICHMENT',
        useFactory: () => ({
          transport: Transport.RMQ,
          options: {
            urls: [process.env.RABBITMQ_URL],
            queue: 'track_enrichment',
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [],
      },
    ]),
    TrackModule,
    AuthModule,
    PrismaModule,
  ],
  providers: [QueueService, TrackEnrichmentHandler],
  exports: [QueueService, TrackEnrichmentHandler],
  controllers: [TrackEnrichmentHandler],
})
export class QueueModule {}
