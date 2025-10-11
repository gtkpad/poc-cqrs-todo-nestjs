import { Module } from '@nestjs/common';
import { TodoModule } from './todo/todo.module';
import { SharedModule } from '@lib/shared';
import { CreateTodoCommandHandler } from './todo/application/handlers/create-todo.command-handler';
import { TodoController } from './todo/application/controllers/todo.controller';
import { RenameTodoCommandHandler } from './todo/application/handlers/rename-todo.command-handler';
import { MarkTodoAsDoneCommandHandler } from './todo/application/handlers/mark-todo-as-done.command-handler';
import { MarkTodoAsUndoneCommandHandler } from './todo/application/handlers/mark-todo-as-undone.command-handler';

@Module({
  imports: [SharedModule, TodoModule],
  controllers: [TodoController],
  providers: [
    CreateTodoCommandHandler,
    RenameTodoCommandHandler,
    MarkTodoAsDoneCommandHandler,
    MarkTodoAsUndoneCommandHandler,
  ],
})
export class CommandModule {}
