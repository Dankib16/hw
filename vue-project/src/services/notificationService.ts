
import { BehaviorSubject, Subject } from 'rxjs';

export type NotificationSeverity = 'error' | 'notice' | 'trivial';

export interface Notification {
  date: number;
  reason: string;
  severity: NotificationSeverity;
}

export const notifications$ = new BehaviorSubject<Notification[]>([]);
export const notificationAdded$ = new Subject<Notification>();
export function pushNotification(notification: Notification) {
  notifications$.next([notification, ...notifications$.getValue()]);
  notificationAdded$.next(notification);
}

export const addNotification = (reason: string, severity: NotificationSeverity) => {
  const notif: Notification = {
    date: Date.now(),
    reason,
    severity,
  };
  notifications$.next([notif, ...notifications$.value]);
  notificationAdded$.next(notif);
};

addNotification('Welcome Kibish to the system', 'trivial');
