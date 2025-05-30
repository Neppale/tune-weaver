import { NestFactory } from '@nestjs/core';
import { ApiQueueModule } from '../api-queue.module';
import { Logger } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('TrackEnrichmentMicroservice');

  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(ApiQueueModule, {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL],
        queue: 'track_enrichment',
        queueOptions: {
          durable: true,
        },
      },
    });

  await microservice.listen();
  logger.log('Microservice is listening for track enrichment messages');
}

bootstrap();
