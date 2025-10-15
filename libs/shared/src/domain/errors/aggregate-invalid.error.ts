import { Notification } from '../validations/notification';
import { BaseError } from './base.error';

export class AggregateInvalidError extends BaseError {
  constructor(
    message: string,
    public notifications: Notification[],
  ) {
    super(message);
    this.name = 'AggregateInvalidError';
  }
}
