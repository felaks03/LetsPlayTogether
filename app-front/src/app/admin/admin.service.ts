import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../shared/api-config';
import { User } from '../auth/auth.service';
import { Videojuego } from '../videojuegos/videojuegos.service';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private usersUrl = `${API_BASE}/users`;
  private videojuegosUrl = `${API_BASE}/videojuegos`;

  constructor(private http: HttpClient) {}

  // ─── Usuarios ───
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.usersUrl}/${id}`);
  }

  createUser(data: Partial<User> & { password: string }): Observable<User> {
    return this.http.post<User>(this.usersUrl, data);
  }

  updateUser(id: string, data: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.usersUrl}/${id}`, data);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.usersUrl}/${id}`);
  }

  // ─── Videojuegos ───
  getVideojuegos(): Observable<Videojuego[]> {
    return this.http.get<Videojuego[]>(this.videojuegosUrl);
  }

  getVideojuegoById(id: string): Observable<Videojuego> {
    return this.http.get<Videojuego>(`${this.videojuegosUrl}/${id}`);
  }

  createVideojuego(data: Partial<Videojuego>): Observable<Videojuego> {
    return this.http.post<Videojuego>(this.videojuegosUrl, data);
  }

  updateVideojuego(id: string, data: Partial<Videojuego>): Observable<Videojuego> {
    return this.http.put<Videojuego>(`${this.videojuegosUrl}/${id}`, data);
  }

  deleteVideojuego(id: string): Observable<void> {
    return this.http.delete<void>(`${this.videojuegosUrl}/${id}`);
  }
}
