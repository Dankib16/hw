import { BehaviorSubject } from 'rxjs';
import { map, pairwise, startWith, filter } from 'rxjs/operators';

export type NotificationSeverity = 'error' | 'notice' | 'trivial';

export interface Notification {
  date: number;
  reason: string;
  severity: NotificationSeverity;
  dismissed?: boolean; 
}

const _notifications$ = new BehaviorSubject<Notification[]>([]);

export const notifications$ = _notifications$.asObservable();

export const notificationAdded$ = _notifications$.pipe(
  startWith([] as Notification[]),
  pairwise(),
  map(([prev, curr]) => curr.find(n => !prev.includes(n))),
  filter((n): n is Notification => !!n)
);

export function pushNotification(notification: Notification) {
  _notifications$.next([notification, ..._notifications$.getValue()]);
}

export function addNotification(reason: string, severity: NotificationSeverity) {
  pushNotification({
    date: Date.now(),
    reason,
    severity,
    dismissed: false,
  });
}

export function dismissNotification(index: number) {
  const list = _notifications$.value;
  const updated = [...list];
  if (updated[index]) updated[index] = { ...updated[index], dismissed: true };
  _notifications$.next(updated);
}

addNotification('Welcome Kibish to the system', 'trivial');
