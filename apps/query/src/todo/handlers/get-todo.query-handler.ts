import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo } from '../models/todo.model';
import { GetTodoQuery } from '../queries/get-todo.query';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(GetTodoQuery)
export class GetTodoQueryHandler implements IQueryHandler<GetTodoQuery> {
  constructor(@InjectModel(Todo.name) private todoModel: Model<Todo>) {}

  async execute(query: GetTodoQuery): Promise<any> {
    const { id } = query;
    const todo = await this.todoModel.findOne({ id }).exec();

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    return {
      id: todo.id,
      name: todo.name,
      date: todo.date,
      done: todo.done,
    };
  }
}
