/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { CreateTodoCommand } from '../../domain/commands/create-todo.command';
import { CommandBus } from '@nestjs/cqrs';
import { RenameTodoCommand } from '../../domain/commands/rename-todo.command';

@Controller('todo')
export class TodoController {
  constructor(private readonly commandBus: CommandBus) {}
  @Post()
  async createTodo(@Body() data: CreateTodoCommand) {
    return await this.commandBus.execute(
      new CreateTodoCommand(data.name, data.date),
    );
  }

  @Patch(':id/name')
  async renameTodo(@Param('id') id: string, @Body() data: { name: string }) {
    return await this.commandBus.execute(new RenameTodoCommand(id, data.name));
  }
}
