import { AutowiredEvent, BaseEvent } from '@lib/shared';

@AutowiredEvent
export class TodoMarkedAsUndoneEvent extends BaseEvent {
  constructor(stream_id: string, id: string) {
    super(stream_id, id);
  }
}
