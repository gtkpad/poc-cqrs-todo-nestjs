import { validateSync } from 'class-validator';
import { Notification } from './notification';
import { IValidatorFields } from './validator-fields.interface';

export abstract class ClassValidatorFields implements IValidatorFields {
  validate(data: any): Notification[] {
    const errors = validateSync(data);

    const notifications: Notification[] = [];
    if (errors.length) {
      for (const error of errors) {
        const field = error.property;
        Object.values(error.constraints!).forEach((message) => {
          notifications.push(new Notification(field, message));
        });
      }
    }
    return notifications;
  }
}
