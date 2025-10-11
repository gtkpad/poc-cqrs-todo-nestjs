export class MarkTodoAsUndoneCommand {
  public readonly id: string;

  constructor(id: string) {
    this.id = id;
  }
}
