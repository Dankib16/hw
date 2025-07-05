import { userCreated$, users$, removeUser } from './userService';
import { pushNotification } from './notificationService';
import { banRule$, reviewFlaggedUsers$ } from './banRuleService';
import { timer, combineLatest } from 'rxjs';
import { take, map, startWith, pairwise, filter } from 'rxjs/operators';
import type { User } from './userService';
import type { BanRule } from './banRuleService';
function matchesRule(rule: BanRule, name: string): boolean {
  const lowered = name.toLowerCase();
  if (rule.match === 'includes') return lowered.includes(rule.value.toLowerCase());
  if (rule.match === 'equals') return lowered === rule.value.toLowerCase();
  return false;
}

function isWelcomed(rule: BanRule, name: string): boolean {
  const lowered = name.toLowerCase();

  // Инвертируем правило — кого не баним, того приветствуем
  if (rule.value.toLowerCase() === 'bot') {
    return rule.match === 'equals' ? lowered === 'vip' : lowered.includes('vip');
  }
  if (rule.value.toLowerCase() === 'vip') {
    return rule.match === 'equals' ? lowered.includes('bot') : lowered.includes('bot');
  }

  return false;
}
userCreated$.subscribe(user => {
  combineLatest([
    banRule$,
    reviewFlaggedUsers$,
    users$.pipe(take(1))
  ]).pipe(take(1)).subscribe(([rule, review, currentUsers]) => {
    const name = user.name;

    const shouldBan = matchesRule(rule, name);
    const shouldWelcome = isWelcomed(rule, name);

    if (shouldWelcome) {
      pushNotification({
        date: Date.now(),
        severity: 'trivial',
        reason: `Welcome ${user.name} (${user.id}) to the system`,
      });
    }

    if (!shouldBan) return;

    if (review === 'off') {
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
      const stillExists = users$.value.some(u => u.id === user.id);
      if (!stillExists) return;

      const currentRule = banRule$.value;
      const stillMatches = matchesRule(currentRule, user.name);

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

export const userRemoved$ = users$.pipe(
  startWith([] as User[]),
  pairwise(),
  map(([prev, curr]) => prev.find(p => !curr.some(c => c.id === p.id)) || null),
  filter((u): u is User => !!u)
);
