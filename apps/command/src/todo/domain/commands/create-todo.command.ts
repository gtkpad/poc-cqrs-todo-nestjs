export class CreateTodoCommand {
  public name: string;
  public date: Date;

  constructor(name: string, date: Date) {
    this.name = name;
    this.date = date;
  }
}
