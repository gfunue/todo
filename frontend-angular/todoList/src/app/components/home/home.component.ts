import { Component, OnInit } from '@angular/core';
import { List } from '../../models/list.module';
import { TodoService } from '../../services/todo.service';
import { Item } from '../../models/item.module';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  allLists: List[] = [];
  newListName: string = '';
  currentDate: Date = new Date();
  newListItems: Item[] = [];
  newItemName!: string;
  lists!: List[];
  selectedList!: List;
  items!: Item[];

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.fetchLists();
  }

  fetchLists(): void {
    const userId = this.todoService.getLoggedInUser()?.id;
    //console.log('Here is the usr ID::' + userId);
    if (userId) {
      this.todoService.getUserLists(userId).subscribe((lists) => {
        if (lists.length === 0) {
          this.createDefaultList();
        } else {
          this.allLists = lists;
          this.selectList(this.allLists[0]);
          //console.log('All of the list::' + lists);
        }
      });
    }
  }

  createDefaultList() {
    const defaultListName = 'My Default List2';
    this.todoService.createList(defaultListName).subscribe((response) => {
      this.allLists.push(response);
      this.updateLocalStorage();
      this.selectList(response);
      this.fetchLists();
    });
  }

  // async createNewList(): Promise<void> {
  //   const defaultItems: string[] = ['Item 1', 'Item 2', 'Item 3'];
  //   if (!this.newListName) return;
  //   const listResponse = await this.todoService
  //     .createList(this.newListName)
  //     .toPromise();
  //   this.allLists.push(listResponse!);
  //   this.newListName = '';
  //   this.updateLocalStorage();
  //   this.fetchLists();

  //   for (const itemName of defaultItems) {
  //     const createdItem = await this.todoService
  //       .createItem(listResponse!.id, { name: itemName })
  //       .toPromise();
  //     this.newListItems.push(createdItem!);
  //   }
  // }
  createNewList(): void {
    if (!this.newListName) return;
    this.todoService.createList(this.newListName).subscribe((response) => {
      this.allLists.push(response);
      this.newListName = '';
      this.updateLocalStorage();

      const defaultItems: string[] = ['Item 1', 'Item 2', 'Item 3'];
      defaultItems.forEach((itemName) => {
        this.todoService
          .createItem(response.id, { name: itemName })
          .subscribe((createdItem) => {
            this.newListItems.push(createdItem);
          });
      });
    });
  }

  deleteList(listId: number): void {
    this.todoService.deleteList(listId).subscribe(() => {
      this.allLists = this.allLists.filter((list) => list.id !== listId);
      this.updateLocalStorage();
      this.fetchLists();
    });
  }
  updateLocalStorage(): void {
    localStorage.setItem('lists', JSON.stringify(this.allLists));
  }

  selectList(list: List): void {
    console.log('Selected list:', list);
    this.selectedList = list;
    this.fetchItems(list.id);
  }

  fetchItems(listId: number): void {
    console.log('listId:', listId); // add this line to log the value of listId
    this.todoService.getItems(listId).subscribe((items) => {
      this.newListItems = items;
      this.selectedList.items = items;
      console.log('newListItems:', this.newListItems); // add this line to log the value of newListItems
    });
  }

  createNewItem() {
    if (this.newItemName.trim() === '') {
      return;
    }
    if (!this.selectedList || !this.selectedList.id) {
      console.error('No list selected or invalid list ID');
      return;
    }
    this.todoService
      .createItem(this.selectedList.id, {
        name: this.newItemName.trim(),
      })
      .subscribe(
        (createdItem: Item) => {
          this.newItemName = '';
          this.todoService
            .getItems(this.selectedList.id)
            .subscribe((items: Item[]) => {
              this.selectedList.items = items;
              this.newListItems = items;
            });
        },
        (error) => {
          console.error('Error creating new item:', error);
        }
      );
  }

  deleteItem(itemId: number): void {
    this.todoService.deleteItem(this.selectedList.id, itemId).subscribe(() => {
      this.newListItems = this.newListItems.filter(
        (item) => item.id !== itemId
      );
    });
  }
}
