import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type TodoDocument = HydratedDocument<Todo>;

@Schema()
export class Todo {
  @Prop({ type: mongoose.Schema.Types.String, unique: true, required: true })
  public id: string;

  @Prop({ required: true })
  public name: string;

  @Prop({ default: false })
  public done: boolean;

  @Prop()
  public date: Date;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
