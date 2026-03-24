import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = isHttpException ? exception.getResponse() : null;

    let message: string | string[] = 'Internal server error';
    let details: unknown = null;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (
      exceptionResponse &&
      typeof exceptionResponse === 'object' &&
      'message' in exceptionResponse
    ) {
      message = (exceptionResponse as any).message;
      details = (exceptionResponse as any);
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const code = HttpStatus[status] ?? 'UNKNOWN_ERROR';

    response.status(status).json({
      success: false,
      error: {
        code,
        message,
        details,
      },
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}

