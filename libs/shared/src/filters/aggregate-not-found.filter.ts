import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

import { AggregateNotFoundError } from '../domain/errors/aggregate-not-found.error';

@Catch(AggregateNotFoundError)
export class AggregateNotFoundErrorFilter implements ExceptionFilter {
  catch(exception: AggregateNotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.status(404).json({
      statusCode: 404,
      error: 'Not Found',
      message: `Aggregate with ID ${exception.aggregateId} not found.`,
    });
  }
}
