import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../auth/auth.service';
import { Chat } from '../chat/chat.service';
import { API_BASE } from '../shared/api-config';

const API = `${API_BASE}/users`;

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(API);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${API}/${id}`);
  }

  updateUser(id: string, data: Partial<User> & { password?: string }): Observable<User> {
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

  toggleFavoritoVideojuego(userId: string, videojuegoId: string): Observable<User> {
    return this.http.post<User>(`${API}/${userId}/favoritos/${videojuegoId}`, {});
  }

  uploadAvatar(userId: string, file: File): Observable<User> {
    const fd = new FormData();
    fd.append('foto', file);
    return this.http.post<User>(`${API}/${userId}/avatar`, fd);
  }

  getOrCreateChatConUsuario(otroUsuarioId: string): Observable<Chat> {
    return this.http.post<Chat>(`${API_BASE}/chats`, {
      otroUsuarioId,
    });
  }
}
