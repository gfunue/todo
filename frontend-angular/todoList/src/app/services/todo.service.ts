import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Item } from '../models/item.module';
import { List } from '../models/list.module';
import { LoginResponse } from '../models/log-response.module';
import { User } from '../models/registration.module';
import { catchError, tap } from 'rxjs/operators';
import { UserWP } from '../models/user-without-password.module';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private apiUrl = 'http://localhost:3000';

  private getAuthHeaders(): { [header: string]: string } {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, {
        email,
        password,
      })
      .pipe(
        tap((response) => {
          console.log('Login response:', response);
          localStorage.setItem('token', response.token);
          localStorage.setItem('lastActivity', String(Date.now()));
          localStorage.setItem('user_id', String(response.user.id));
          localStorage.setItem('lists', JSON.stringify(response.lists));
          console.log('Stored user_id:', localStorage.getItem('user_id'));
        })
      );
  }

  getLoggedInUser(): UserWP | null {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user_id');
    console.log('getLoggedInUser userId:', userId);
    if (token && userId) {
      return { id: Number(userId), firstName: '', lastName: '', email: '' };
    }
    return null;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('lastActivity');
  }

  updateLastActivity(): void {
    localStorage.setItem('lastActivity', String(Date.now()));
  }

  registerUser(newUser: User): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/register`, newUser);
  }

  getAllLists(): Observable<List[]> {
    return this.http.get<List[]>(`${this.apiUrl}/lists`, {
      headers: this.getAuthHeaders(),
    });
  }

  getList(listId: string): Observable<List> {
    return this.http.get<List>(`${this.apiUrl}/lists/${listId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  createList(listName: string, listId?: string): Observable<List> {
    const loggedInUser = this.getLoggedInUser();
    if (!loggedInUser) {
      return throwError('User not logged in or invalid user ID');
    }
    const userId = loggedInUser.id;
    const newList = {
      name: listName,
      user_id: userId, // Convert the user_id to a number
    };
    if (listId) {
      // If a listId is provided, update the existing list
      return this.http.put<List>(`${this.apiUrl}/list/${listId}`, newList, {
        headers: this.getAuthHeaders(),
      });
    } else {
      // Otherwise, create a new list
      return this.http.post<List>(`${this.apiUrl}/list`, newList, {
        headers: this.getAuthHeaders(),
      });
    }
  }

  getUserLists(userId: number): Observable<List[]> {
    return this.http.get<List[]>(`${this.apiUrl}/user-lists/${userId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteList(listId: number): Observable<{}> {
    return this.http.delete(`${this.apiUrl}/lists/${listId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  getItems(listId: number): Observable<Item[]> {
    console.log('getItems called with listId:', listId);
    return this.http
      .get<Item[]>(`${this.apiUrl}/items/${listId}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        tap((items) => {
          console.log('getItems response:', items);
        }),
        catchError((error) => {
          console.error('Error in getItems:', error);
          return throwError(error);
        })
      );
  }

  createItem(listId: number, item: { name: string }): Observable<Item> {
    console.log('createItem request::::', listId, item); // log the request body
    console.log(
      'createItem request URL:',
      `${this.apiUrl}/lists/${listId}/items`
    );
    console.log('createItem request body:', item);

    return this.http.post<Item>(`${this.apiUrl}/lists/${listId}/items`, item, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteItem(listId: number, itemId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete-item/${listId}/${itemId}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
