import { Notification } from './notification';

export interface INotifiable {
  isValid: boolean;
  getNotifications(): Notification[];
  addNotification(notification: Notification): void;
  clearNotifications(): void;
}
