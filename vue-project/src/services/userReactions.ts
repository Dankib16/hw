import { userCreated$, users$, userRemoved$ } from './userService';
import { pushNotification } from './notificationService';
import { banRule$, reviewFlaggedUsers$ } from './banRuleService';
import { timer, combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';

userCreated$.subscribe(user => {
  combineLatest([banRule$])
    .pipe(take(1))
    .subscribe(([rule]) => {
      const name = user.name.toLowerCase();

      const isWelcomed =
        (rule === 'bot' && name === 'vip') ||
        (rule === 'vip' && name.includes('bot'));

      if (isWelcomed) {
        pushNotification({
          date: Date.now(),
          severity: 'trivial',
          reason: `Welcome ${user.name} (${user.id}) to the system`,
        });
      }
    });
});

userCreated$.subscribe(user => {
  const name = user.name.toLowerCase();

  combineLatest([banRule$, reviewFlaggedUsers$])
    .pipe(take(1))
    .subscribe(([rule, review]) => {
      const isBannedNow =
        (rule === 'bot' && name.includes('bot')) ||
        (rule === 'vip' && name === 'vip');

      if (!isBannedNow) return;

      if (!review) {
        removeUser(user.id);
        pushNotification({
          date: Date.now(),
          severity: 'notice',
          reason: `User ${user.id} was banned`,
        });
        return;
      }

      pushNotification({
        date: Date.now(),
        severity: 'notice',
        reason: `User ${user.id} "${user.name}" is under review`,
      });

      timer(2 * 60 * 1000).subscribe(() => {
        const currentUsers = users$.value;
        const stillExists = currentUsers.some(u => u.id === user.id);

        if (!stillExists) return;

        const currentRule = banRule$.value;
        const stillMatches =
          (currentRule === 'bot' && name.includes('bot')) ||
          (currentRule === 'vip' && name === 'vip');

        if (stillMatches) {
          removeUser(user.id);
          pushNotification({
            date: Date.now(),
            severity: 'notice',
            reason: `User ${user.id} was banned`,
          });
        } else {
          pushNotification({
            date: Date.now(),
            severity: 'trivial',
            reason: `User ${user.id} was cleared`,
          });
        }
      });
    });
});

function removeUser(userId: string) {
  const currentUsers = users$.getValue();
  const userToRemove = currentUsers.find(u => u.id === userId);

  if (userToRemove) {
    users$.next(currentUsers.filter(u => u.id !== userId));
    userRemoved$.next(userToRemove);
  }
}
