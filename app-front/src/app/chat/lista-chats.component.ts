import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ChatService, Chat } from './chat.service';
import { AuthService, User } from '../auth/auth.service';

@Component({
  selector: 'app-lista-chats',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './lista-chats.component.html'
})
export class ListaChatsComponent implements OnInit {
  chats = signal<Chat[]>([]);
  cargando = signal(true);
  error = signal<string | null>(null);

  constructor(
    private chatService: ChatService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.cargando.set(true);
    this.error.set(null);
    this.chatService.getChats().subscribe({
      next: (data) => {
        this.chats.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Error al cargar chats');
        this.cargando.set(false);
      }
    });
  }

  otroParticipante(chat: Chat): User | string {
    const me = this.auth.currentUser()?._id;
    if (!me) return '';
    const p1 = typeof chat.participante1 === 'object' ? (chat.participante1 as User)._id : chat.participante1;
    const p2 = typeof chat.participante2 === 'object' ? (chat.participante2 as User)._id : chat.participante2;
    return p1 === me ? (chat.participante2 as User) : (chat.participante1 as User);
  }

  nombreOtro(chat: Chat): string {
    const o = this.otroParticipante(chat);
    return typeof o === 'object' && o?.nick ? o.nick : String(o);
  }
}
