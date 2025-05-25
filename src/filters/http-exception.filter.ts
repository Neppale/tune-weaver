import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Logger,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseException } from 'src/exceptions/base.exception';

@Catch(BaseException, HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: BaseException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const internalMessage =
      (
        exception.getResponse() as {
          message: string | string[];
          source?: string;
        }
      ).message || exception.message;
    const message = `[${exception.getResponse()['source']}] ${request.method} ${request.url} ${status} - ${internalMessage}`;
    this.logger.error(message);

    response.status(status).json({
      message: internalMessage,
    });
  }
}
