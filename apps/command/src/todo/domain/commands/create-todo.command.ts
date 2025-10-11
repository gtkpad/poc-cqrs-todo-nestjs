export class CreateTodoCommand {
  public readonly name: string;
  public readonly date: Date;

  constructor(name: string, date: Date) {
    this.name = name;
    this.date = date;
  }
}
