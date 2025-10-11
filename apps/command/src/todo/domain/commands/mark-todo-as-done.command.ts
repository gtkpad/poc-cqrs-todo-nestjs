export class MarkTodoAsDoneCommand {
  public readonly id: string;

  constructor(id: string) {
    this.id = id;
  }
}
