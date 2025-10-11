import { AutowiredEvent, BaseEvent } from '@lib/shared';

@AutowiredEvent
export class TodoRenamedEvent extends BaseEvent {
  public name: string;

  constructor(stream_id: string, id: string, name: string) {
    super(stream_id, id);
    this.name = name;
  }
}
