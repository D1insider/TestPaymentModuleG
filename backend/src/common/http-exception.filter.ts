import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const request = host.switchToHttp().getRequest<Request>();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const raw = exception instanceof HttpException ? exception.getResponse() : null;
    const message = typeof raw === 'string' ? raw : raw && typeof raw === 'object' && 'message' in raw ? (raw as { message: unknown }).message : 'Внутренняя ошибка сервера';
    response.status(status).json({
      error: { statusCode: status, message, path: request.url, timestamp: new Date().toISOString() },
    });
  }
}
