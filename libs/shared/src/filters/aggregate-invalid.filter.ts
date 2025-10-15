import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

import { AggregateInvalidError } from '../domain/errors/aggregate-invalid.error';

@Catch(AggregateInvalidError)
export class AggregateInvalidErrorFilter implements ExceptionFilter {
  catch(exception: AggregateInvalidError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.status(422).json({
      statusCode: 422,
      error: 'Unprocessable Entity',
      message: exception.notifications.map((n) => `${n.field}: ${n.message}`),
    });
  }
}
