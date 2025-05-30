import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { QueueService } from './src/services/queue.service';
import { TrackEnrichmentHandler } from './src/handlers/track-enrichment.handler';
import { TrackServicesModule } from '@Tracks/track-services.module';
import { TrackRepositoriesModule } from '@Tracks/track-repositories.module';
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
    TrackServicesModule,
    TrackRepositoriesModule,
    AuthModule,
    PrismaModule,
  ],
  providers: [QueueService, TrackEnrichmentHandler],
  exports: [QueueService, TrackEnrichmentHandler],
  controllers: [TrackEnrichmentHandler],
})
export class QueueModule {}
