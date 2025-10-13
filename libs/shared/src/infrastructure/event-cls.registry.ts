/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Type } from '@nestjs/common';

export class EventClsRegistry {
  public static readonly eventClsMap = new Map<string, any>();

  static add(eventCls: Type): void {
    console.log(`Adding event class for type :`, this.eventClsMap);

    this.eventClsMap.set(eventCls.name, eventCls);
  }

  static get(eventClsName: string): Type {
    const eventCls = this.eventClsMap.get(eventClsName);
    if (!eventCls) {
      throw new Error(`Event class "${eventClsName}" not registered`);
    }
    return eventCls;
  }
}
