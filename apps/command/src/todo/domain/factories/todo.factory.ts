import { Todo } from '../entities/todo.entity';

export class TodoFactory {
  static create(name: string, date: Date): Todo {
    const id = crypto.randomUUID();
    return new Todo(id, name, date);
  }
}
