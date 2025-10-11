import { AutowiredEvent, BaseEvent } from '@lib/shared';

@AutowiredEvent
export class TodoMarkedAsDoneEvent extends BaseEvent {
  constructor(stream_id: string, id: string) {
    super(stream_id, id);
  }
}
