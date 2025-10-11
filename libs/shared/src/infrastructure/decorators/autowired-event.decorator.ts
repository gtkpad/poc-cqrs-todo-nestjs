import { EventClsRegistry } from '../event-cls.registry';

export const AutowiredEvent: ClassDecorator = (target: any) => {
  EventClsRegistry.add(target);
};
