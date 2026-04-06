import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../auth/auth.service';
import { API_BASE } from '../shared/api-config';

const API = `${API_BASE}/chats`;

export interface Chat {
  _id: string;
  participante1: User | string;
  participante2: User | string;
  fechaCreacion: string;
  ultimaActividad?: string;
}

export interface Mensaje {
  _id: string;
  chat: string;
  emisor: User | string;
  contenido: string;
  fecha: string;
}

export interface ChatConMensajes {
  chat: Chat;
  mensajes: Mensaje[];
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  constructor(private http: HttpClient) {}

  getChats(): Observable<Chat[]> {
    return this.http.get<Chat[]>(API);
  }

  getChatById(id: string): Observable<ChatConMensajes> {
    return this.http.get<ChatConMensajes>(`${API}/${id}`);
  }

  getOrCreateChat(otroUsuarioId: string): Observable<Chat> {
    return this.http.post<Chat>(API, { otroUsuarioId });
  }

  enviarMensaje(chatId: string, contenido: string): Observable<Mensaje> {
    return this.http.post<Mensaje>(`${API}/${chatId}/mensajes`, { contenido });
  }
}
