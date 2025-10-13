import { Module } from '@nestjs/common';
import { TodoModule } from './todo/todo.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CqrsCommandModule } from '@lib/shared/cqrs-command.module';

@Module({
  imports: [CqrsModule.forRoot(), CqrsCommandModule, TodoModule],
  controllers: [],
  providers: [],
})
export class CommandModule {}
