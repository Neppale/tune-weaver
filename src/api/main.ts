import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';
import { Logger } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('TuneWeaver API');

  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(ApiModule, {
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

  const app = await NestFactory.create(ApiModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(process.env.API_PORT);
  logger.log(
    `Application is running on: http://localhost:${process.env.API_PORT}`,
  );
}

bootstrap();
