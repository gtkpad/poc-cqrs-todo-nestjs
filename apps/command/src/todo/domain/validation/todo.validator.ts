/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ClassValidatorFields } from '@lib/shared/domain/validations/class-validator-fields';
import { Todo } from '../entities/todo.entity';
import { Notification } from '@lib/shared';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class TodoRules {
  @MaxLength(255)
  @MinLength(3)
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsBoolean()
  done: boolean;

  @IsNotEmpty()
  @IsDate()
  date: Date;

  constructor(aggregate: Todo) {
    this.name = aggregate.name;
    this.done = aggregate.done;
    this.date = aggregate.date;
  }
}

export class TodoValidator extends ClassValidatorFields {
  validate(data: Todo, fields?: string[]): Notification[] {
    const newFields = fields?.length ? fields : ['name', 'done', 'date'];
    return super.validate(new TodoRules(data), newFields);
  }
}

export class TodoValidatorFactory {
  static create() {
    return new TodoValidator();
  }
}
