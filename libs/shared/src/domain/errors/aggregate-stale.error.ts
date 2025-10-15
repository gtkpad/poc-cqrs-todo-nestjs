import { BaseError } from './base.error';

export class AggregateStaleError extends BaseError {
  constructor(
    message: string,
    public aggregateId: string,
  ) {
    super(message);
    this.name = 'AggregateErrorStale';
  }
}
