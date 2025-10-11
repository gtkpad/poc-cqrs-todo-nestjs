import { AutowiredEvent } from '@lib/shared';

@AutowiredEvent
export class RenameTodoCommand {
  public readonly id: string;
  public readonly name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}
