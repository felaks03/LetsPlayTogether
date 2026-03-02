import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from './user.service';
import { AuthService, User } from '../auth/auth.service';
import { ChatService } from '../chat/chat.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './perfil.component.html'
})
export class PerfilComponent implements OnInit {
  user = signal<User | null>(null);
  cargando = signal(true);
  error = signal<string | null>(null);

  esMiPerfil = computed(() => {
    const u = this.user();
    const current = this.auth.currentUser();
    return u && current && u._id === current._id;
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    public auth: AuthService,
    private chatService: ChatService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('ID no válido');
      this.cargando.set(false);
      return;
    }
    this.userService.getUserById(id).subscribe({
      next: (data) => {
        this.user.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Error al cargar perfil');
        this.cargando.set(false);
      }
    });
  }

  eliminar() {
    const u = this.user();
    if (!u || !confirm('¿Borrar tu cuenta?')) return;
    this.userService.deleteUser(u._id).subscribe({
      next: () => {
        this.auth.logout();
        this.router.navigate(['/login']);
      },
      error: (err) => this.error.set(err.error?.message || 'Error al borrar')
    });
  }

  anadirAmigo() {
    const u = this.user();
    const current = this.auth.currentUser();
    if (!u || !current || u._id === current._id) return;
    this.userService.addAmigo(current._id, u._id).subscribe({
      next: () => this.ngOnInit(),
      error: (err) => this.error.set(err.error?.message || 'Error al añadir amigo')
    });
  }

  quitarAmigo(amigoId: string) {
    const current = this.auth.currentUser();
    if (!current) return;
    this.userService.removeAmigo(current._id, amigoId).subscribe({
      next: () => this.ngOnInit(),
      error: (err) => this.error.set(err.error?.message || 'Error al quitar amigo')
    });
  }

  esAmigo(amigoId: string): boolean {
    const current = this.auth.currentUser();
    if (!current || !current.amigos) return false;
    return (current.amigos as unknown[]).some(
      (a: unknown) => (typeof a === 'object' && a && '_id' in a ? (a as { _id: string })._id : a) === amigoId
    );
  }

  yaEsAmigo(userId: string): boolean {
    return this.esAmigo(userId);
  }

  abrirChat() {
    const u = this.user();
    const current = this.auth.currentUser();
    if (!u || !current || u._id === current._id) return;
    this.chatService.getOrCreateChat(u._id).subscribe({
      next: (chat) => this.router.navigate(['/chats', chat._id]),
      error: (err) => this.error.set(err.error?.message || 'Error al abrir chat')
    });
  }
}
