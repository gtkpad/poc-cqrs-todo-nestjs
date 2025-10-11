import { Module } from '@nestjs/common';
import { TodoModule } from './todo/todo.module';
import { SharedModule } from '@lib/shared';
import { CreateTodoCommandHandler } from './todo/application/handlers/create-todo.command-handler';
import { TodoController } from './todo/application/controllers/todo.controller';
import { RenameTodoCommandHandler } from './todo/application/handlers/rename-todo.command-handler';

@Module({
  imports: [SharedModule, TodoModule],
  controllers: [TodoController],
  providers: [CreateTodoCommandHandler, RenameTodoCommandHandler],
})
export class CommandModule {}
