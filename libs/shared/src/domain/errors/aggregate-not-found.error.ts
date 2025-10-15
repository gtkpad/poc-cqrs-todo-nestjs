import { BaseError } from './base.error';

export class AggregateNotFoundError extends BaseError {
  constructor(
    message: string,
    public aggregateId?: string,
  ) {
    super(message);
    this.name = 'AggregateNotFoundError';
  }
}
