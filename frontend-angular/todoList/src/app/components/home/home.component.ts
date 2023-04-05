import { Component, OnInit } from '@angular/core';
import { List } from '../../models/list.module';
import { TodoService } from '../../services/todo.service';
import { Item } from '../../models/item.module';
import { Router } from '@angular/router';

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

  constructor(private todoService: TodoService, private router: Router) {}

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
    const defaultListName = 'My Default Todo List';
    this.todoService.createList(defaultListName).subscribe((response: any) => {
      // Change the response type to 'any'

      console.log('Response:', response); // Log the entire response object

      const createdList = response[0]; // Access the list object inside the response array

      this.allLists.push(createdList);
      this.updateLocalStorage();
      this.selectList(createdList); // Pass the createdList object instead of the response
      this.fetchLists();

      const defaultItems: string[] = [
        'Click on the "List Menu button to create a new list',
        'Click on the chekbox to delete items from a list',
        'Click on the "Add New Todo..." to a items to your to do list',
      ];
      defaultItems.forEach((itemName) => {
        // Use this.selectedList.id instead of response.id
        this.todoService
          .createItem(this.selectedList.id, { name: itemName })
          .subscribe((createdItem) => {
            this.newListItems.push(createdItem);
          });
      });
    });
  }

  createNewList(): void {
    if (!this.newListName) return;
    this.todoService.createList(this.newListName).subscribe((response: any) => {
      // Change the response type to 'any'

      console.log('Response:', response); // Log the entire response object

      const createdList = response[0]; // Access the list object inside the response array
      this.newListItems = [];
      this.allLists.push(createdList);
      this.newListName = '';
      this.updateLocalStorage();

      // Set the selectedList to the newly created list
      this.selectedList = createdList;
      console.log('Here is the selectedlist: ' + this.selectedList.id);

      const defaultItems: string[] = [
        'Click on the "List Menu" on the top left to create a new list',
        'Click on the chekbox on the left to delete items from a list',
        'Click on the "Add New Todo..." to a items to your to do list',
      ];
      defaultItems.forEach((itemName) => {
        // Use this.selectedList.id instead of response.id
        this.todoService
          .createItem(this.selectedList.id, { name: itemName })
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

  logout(): void {
    this.todoService.logout();
    this.router.navigate(['/']); // Navigate to the default route
  }
}
