/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { CreateTodoCommand } from '../../domain/commands/create-todo.command';
import { CommandBus } from '@nestjs/cqrs';
import { RenameTodoCommand } from '../../domain/commands/rename-todo.command';
import { MarkTodoAsDoneCommand } from '../../domain/commands/mark-todo-as-done.command';
import { MarkTodoAsUndoneCommand } from '../../domain/commands/mark-todo-as-undone.command';
import { CreateTodoDto } from '../dtos/create-todo.dto';
import { RenameTodoDto } from '../dtos/rename-todo.dto';

@Controller('todo')
export class TodoController {
  constructor(private readonly commandBus: CommandBus) {}
  @Post()
  async createTodo(@Body() data: CreateTodoDto) {
    return await this.commandBus.execute(
      new CreateTodoCommand(data.name, data.date),
    );
  }

  @Patch(':id/name')
  async renameTodo(@Param('id') id: string, @Body() data: RenameTodoDto) {
    return await this.commandBus.execute(new RenameTodoCommand(id, data.name));
  }

  @Patch(':id/done')
  async markTodoAsDone(@Param('id') id: string) {
    return await this.commandBus.execute(new MarkTodoAsDoneCommand(id));
  }

  @Patch(':id/undone')
  async markTodoAsUndone(@Param('id') id: string) {
    return await this.commandBus.execute(new MarkTodoAsUndoneCommand(id));
  }
}
