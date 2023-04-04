import { Item } from './item.module';

export interface List {
  id: number;
  name: string;
  user_id: number;
  items?: Item[];
}
