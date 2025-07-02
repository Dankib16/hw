
import { faker } from '@faker-js/faker';
import { BehaviorSubject, Subject, interval } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  name: string;
  createdAt: number;
}

export const users$ = new BehaviorSubject<User[]>([]);
export const userCreated$ = new Subject<User>();
export const userRemoved$ = new Subject<User>();

const kibish: User = {
  id: uuidv4(),
  name: 'Kibish',
  createdAt: Date.now()
};
users$.next([kibish]);
userCreated$.next(kibish);

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

  users$.next([...users$.value, user]);
  userCreated$.next(user);
});
