import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../auth/auth.service';
import { Chat } from '../chat/chat.service';

const API = 'http://localhost:3000/api/users';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(API);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${API}/${id}`);
  }

  updateUser(id: string, data: Partial<User>): Observable<User> {
    return this.http.put<User>(`${API}/${id}`, data);
  }

  deleteUser(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${API}/${id}`);
  }

  addAmigo(userId: string, friendId: string): Observable<User> {
    return this.http.post<User>(`${API}/${userId}/amigos`, { userId: friendId });
  }

  removeAmigo(userId: string, friendId: string): Observable<User> {
    return this.http.delete<User>(`${API}/${userId}/amigos/${friendId}`);
  }

  getOrCreateChatConUsuario(otroUsuarioId: string): Observable<Chat> {
    return this.http.post<Chat>('http://localhost:3000/api/chats', {
      otroUsuarioId,
    });
  }
}
