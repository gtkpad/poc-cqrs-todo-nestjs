export class Event {
  id: string;

  stream_id: string;

  type: string;

  position: number;

  data: Record<string, any>;

  timestamp: Date;
}
