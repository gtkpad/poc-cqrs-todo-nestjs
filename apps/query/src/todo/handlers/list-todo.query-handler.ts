import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListTodoQuery } from '../queries/list-todo.query';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo } from '../models/todo.model';

@QueryHandler(ListTodoQuery)
export class ListTodoQueryHandler implements IQueryHandler<ListTodoQuery> {
  constructor(@InjectModel(Todo.name) private todoModel: Model<Todo>) {}

  async execute(query: ListTodoQuery): Promise<any> {
    const { page, limit } = query;
    const todos = await this.todoModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return todos.map((todo) => ({
      id: todo.id,
      name: todo.name,
      date: todo.date,
      done: todo.done,
    }));
  }
}
