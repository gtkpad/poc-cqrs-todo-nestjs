import { Notification } from './notification';

export type FieldsErrors =
  | {
      [field: string]: string[];
    }
  | string;

export interface IValidatorFields {
  validate(data: any, fields: string[]): Notification[];
}
