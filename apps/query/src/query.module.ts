/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Module } from '@nestjs/common';
import { TodoModule } from './todo/todo.module';
import { CqrsQueryModule } from '@lib/shared/cqrs-query.module';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    CqrsModule.forRoot(),
    CqrsQueryModule,
    MongooseModule.forRoot('mongodb://localhost/todo-api'),
    TodoModule,
  ],
  controllers: [],
  providers: [],
})
export class QueryModule {}
