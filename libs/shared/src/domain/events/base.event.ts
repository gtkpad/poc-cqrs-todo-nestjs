import { IEvent } from '@nestjs/cqrs';

export abstract class BaseEvent implements IEvent {
  public occurredAt: Date;
  public stream_id: string;
  public id: string;

  constructor(stream_id: string, id: string) {
    this.stream_id = stream_id;
    this.id = id;
    this.occurredAt = new Date();
  }
}
