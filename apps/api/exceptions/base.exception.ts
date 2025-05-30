import { HttpException, HttpStatus } from '@nestjs/common';

interface ExceptionResponse {
  message: string;
  source: string;
}

export class BaseException extends HttpException {
  source: string;

  constructor(response: ExceptionResponse, status: HttpStatus) {
    super(response, status);
    this.source = response.source;
  }
}
