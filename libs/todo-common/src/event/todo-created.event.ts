import { BaseEvent } from '@lib/shared';
import { AutowiredEvent } from '@lib/shared/infrastructure';

@AutowiredEvent
export class TodoCreatedEvent extends BaseEvent {
  public name: string;
  public done: boolean;
  public date: Date;

  constructor(
    stream_id: string,
    id: string,
    name: string,
    done: boolean,
    date: Date,
  ) {
    super(stream_id, id);
    this.name = name;
    this.done = done;
    this.date = date;
  }
}
