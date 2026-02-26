import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

const API = 'http://localhost:3000/api';

export interface User {
  _id: string;
  nick: string;
  email: string;
  edad: number;
  foto?: string;
  redes?: { twitter?: string; discord?: string; twitch?: string };
  favoritos?: unknown[];
  amigos?: unknown[];
  role?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = `${API}/auth`;
  private tokenKey = 'token';
  private userKey = 'user';

  currentUser = signal<User | null>(null);
  token = signal<string | null>(null);

  constructor(private http: HttpClient) {
    const t = sessionStorage.getItem(this.tokenKey);
    const u = sessionStorage.getItem(this.userKey);
    if (t) this.token.set(t);
    if (u) this.currentUser.set(JSON.parse(u));
  }

  register(data: { nick: string; email: string; password: string; edad: number }): Observable<User> {
    return this.http.post<User>(`${this.api}/register`, data);
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.api}/login`, { email, password }).pipe(
      tap((res) => {
        this.token.set(res.token);
        this.currentUser.set(res.user);
        sessionStorage.setItem(this.tokenKey, res.token);
        sessionStorage.setItem(this.userKey, JSON.stringify(res.user));
      })
    );
  }

  logout(): void {
    this.token.set(null);
    this.currentUser.set(null);
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.userKey);
  }

  getToken(): string | null {
    return this.token() ?? sessionStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
