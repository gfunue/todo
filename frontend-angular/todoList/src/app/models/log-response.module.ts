import { UserWP } from './user-without-password.module';
import { List } from './list.module';

export interface LoginResponse {
  user: UserWP;
  token: string;
  lists: List[];
}
