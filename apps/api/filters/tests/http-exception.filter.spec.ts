import { HttpExceptionFilter } from '@Filters/http-exception.filter';
import { BaseException } from '@Exceptions/base.exception';
import { HttpException, Logger } from '@nestjs/common';
import { ArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface';
import { Request, Response } from 'express';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let mockLogger: jest.SpyInstance;
  let mockResponse: Partial<Response>;
  let mockRequest: Partial<Request>;
  let mockHost: Partial<ArgumentsHost>;

  beforeEach(() => {
    filter = new HttpExceptionFilter();
    mockLogger = jest.spyOn(Logger.prototype, 'error').mockImplementation();

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockRequest = {
      method: 'GET',
      url: '/test',
    };

    mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle BaseException with message', () => {
    const exception = new BaseException(
      { message: 'Test error', source: 'TestSource' },
      400,
    );
    exception.getStatus = () => 400;

    filter.catch(exception, mockHost as ArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Test error' });
  });

  it('should handle BaseException with source', () => {
    const exception = new BaseException(
      { message: 'Test error', source: 'TestSource' },
      400,
    );
    exception.getStatus = () => 400;

    filter.catch(exception, mockHost as ArgumentsHost);

    expect(mockLogger).toHaveBeenCalledWith(
      '[TestSource] GET /test 400 - Test error',
    );
  });

  it('should handle HttpException', () => {
    const exception = new HttpException({ message: 'Test error' }, 400);
    exception.getStatus = () => 400;

    filter.catch(exception as any, mockHost as ArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Test error' });
  });

  it('should handle exception with array message', () => {
    const exception = new BaseException(
      {
        message: 'Error 1, Error 2',
        source: 'TestSource',
      },
      400,
    );
    exception.getStatus = () => 400;

    filter.catch(exception, mockHost as ArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Error 1, Error 2',
    });
  });

  it('should use exception message when response message is not available', () => {
    const exception = new BaseException(
      {
        message: 'Test error',
        source: 'TestSource',
      },
      400,
    );
    exception.getStatus = () => 400;

    filter.catch(exception, mockHost as ArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Test error' });
  });

  it('should log error with correct format', () => {
    const exception = new BaseException(
      {
        message: 'Test error',
        source: 'TestSource',
      },
      400,
    );
    exception.getStatus = () => 400;

    filter.catch(exception, mockHost as ArgumentsHost);

    expect(mockLogger).toHaveBeenCalledWith(
      '[TestSource] GET /test 400 - Test error',
    );
  });
});
