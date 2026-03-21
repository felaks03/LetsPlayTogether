import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ChatService, ChatConMensajes, Mensaje } from './chat.service';
import { AuthService, User } from '../auth/auth.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  data = signal<ChatConMensajes | null>(null);
  cargando = signal(true);
  error = signal<string | null>(null);
  nuevoMensaje = '';
  enviando = signal(false);

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('ID no válido');
      this.cargando.set(false);
      return;
    }
    this.chatService.getChatById(id).subscribe({
      next: (d) => {
        this.data.set(d);
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Error al cargar chat');
        this.cargando.set(false);
      }
    });
  }

  enviar() {
    const d = this.data();
    if (!d || !this.nuevoMensaje.trim()) return;
    this.enviando.set(true);
    this.chatService.enviarMensaje(d.chat._id, this.nuevoMensaje.trim()).subscribe({
      next: (mensaje) => {
        this.data.update((prev) =>
          prev ? { ...prev, mensajes: [...prev.mensajes, mensaje] } : prev
        );
        this.nuevoMensaje = '';
        this.enviando.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Error al enviar');
        this.enviando.set(false);
      }
    });
  }

  nickEmisor(m: Mensaje): string {
    const e = m.emisor;
    return typeof e === 'object' && e?.nick ? e.nick : String(e);
  }

  esMio(m: Mensaje): boolean {
    const me = this.auth.currentUser()?._id;
    const id = typeof m.emisor === 'object' ? (m.emisor as User)._id : m.emisor;
    return me === id;
  }

  idEmisor(m: Mensaje): string {
    const e = m.emisor;
    return typeof e === 'object' && e && '_id' in e ? (e as User)._id : String(e);
  }

  otroEnChat(): User | null {
    const d = this.data();
    const me = this.auth.currentUser()?._id;
    if (!d || !me) return null;
    const p1 = d.chat.participante1;
    const p2 = d.chat.participante2;
    const u1 = typeof p1 === 'object' ? (p1 as User) : null;
    const u2 = typeof p2 === 'object' ? (p2 as User) : null;
    if (!u1 || !u2) return null;
    return u1._id === me ? u2 : u1;
  }
}
