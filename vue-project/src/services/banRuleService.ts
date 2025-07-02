import { BehaviorSubject, interval, timer, Subject } from 'rxjs';
import { map, tap, switchMap, startWith } from 'rxjs/operators';

export type BanRule = 'bot' | 'vip';
export const banRule$ = new BehaviorSubject<BanRule>('bot');

export const manualSwitch$ = new Subject<void>();

export const countdown$ = new BehaviorSubject<number>(180); 

export const reviewFlaggedUsers$ = new BehaviorSubject<boolean>(false);

export const toggleReviewFlag = () => {
  reviewFlaggedUsers$.next(!reviewFlaggedUsers$.value);
};

export const toggleBanRule = () => {
  const current = banRule$.value;
  banRule$.next(current === 'bot' ? 'vip' : 'bot');
};

export function startBanRuleTimer() {

  interval(1000).pipe(
    tap(() => {
      const current = countdown$.value;
      if (current > 0) {
        countdown$.next(current - 1);
      }
    })
  ).subscribe();

  interval(180000).pipe(
    startWith(0),
    switchMap(() => manualSwitch$.pipe(startWith(null)))
  ).subscribe(() => {
    toggleBanRule();
    countdown$.next(180);
  });
}
