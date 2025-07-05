import { faker } from '@faker-js/faker';
import { BehaviorSubject, Subject, interval, distinctUntilChanged, map, pairwise, startWith , filter} from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  name: string;
  createdAt: number;
}

export const users$ = new BehaviorSubject<User[]>([]);
export const userCreated$ = users$.pipe(
  startWith([] as User[]),
  pairwise(),
  map(([prev, curr]) => curr.filter(u => !prev.some(p => p.id === u.id))),
  filter(newUsers => newUsers.length > 0), 
  map(newUsers => newUsers[0]),
  distinctUntilChanged((a, b) => a?.id === b?.id)
);


export const userRemoved$ = new Subject<User>(); 

export function addUser(user: User) {
  users$.next([...users$.value, user]);
}

export function removeUser(userId: string) {
  const current = users$.value;
  const user = current.find(u => u.id === userId);
  if (!user) return;
  users$.next(current.filter(u => u.id !== userId));
  userRemoved$.next(user);
}

addUser({
  id: uuidv4(),
  name: 'Kibish',
  createdAt: Date.now(),
});

interval(6000).subscribe(() => {
  const chance = Math.random();
  let name: string;

  if (chance < 0.4) name = 'Bot';
  else if (chance < 0.5) name = 'VIP';
  else name = faker.person.firstName();

  const user: User = {
    id: uuidv4(),
    name,
    createdAt: Date.now(),
  };

  addUser(user);
});
