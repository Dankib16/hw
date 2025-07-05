import { BehaviorSubject, interval, Subject, merge } from 'rxjs';
import { map, tap, switchMap, startWith, withLatestFrom, filter } from 'rxjs/operators';

export type BanRule = { match: 'includes' | 'equals'; value: string };

const RULES: BanRule[] = [
  { match: 'includes', value: 'bot' },
  { match: 'equals', value: 'vip' },
];

export const banRule$ = new BehaviorSubject<BanRule>(RULES[0]);

export const manualSwitch$ = new Subject<void>();

export const countdown$ = new BehaviorSubject<number>(180);

export type ReviewMode = 'off' | 'on';
export const reviewFlaggedUsers$ = new BehaviorSubject<ReviewMode>('off');

export const toggleReviewFlag = () => {
  const current = reviewFlaggedUsers$.value;
  const next = current === 'on' ? 'off' : 'on';
  reviewFlaggedUsers$.next(next);
};

export const toggleBanRule = () => {
  const current = banRule$.value;
  const currentIndex = RULES.findIndex(r => r.value === current.value && r.match === current.match);
  const nextRule = RULES[(currentIndex + 1) % RULES.length];
  banRule$.next(nextRule);
};

export function startBanRuleTimer() {

  interval(1000).pipe(
    withLatestFrom(countdown$),
    tap(([_, time]) => {
      if (time > 0) countdown$.next(time - 1);
    })
  ).subscribe();

  merge(
    countdown$.pipe(
      filter(val => val <= 0)
    ),
    manualSwitch$
  ).subscribe(() => {
    toggleBanRule();
    countdown$.next(180);
  });
}
