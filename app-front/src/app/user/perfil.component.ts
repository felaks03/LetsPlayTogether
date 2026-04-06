import { Component, OnInit, signal, computed, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, map, switchMap, tap, distinctUntilChanged } from 'rxjs';
import { UserService } from './user.service';
import { AuthService, User, VideojuegoFavorito } from '../auth/auth.service';
import { ChatService } from '../chat/chat.service';
import { urlFotoPerfil } from '../shared/foto-url';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  user = signal<User | null>(null);
  cargando = signal(true);
  error = signal<string | null>(null);
  modalBorrar = signal(false);
  borrando = signal(false);
  private idPerfil = '';
  private destroyRef = inject(DestroyRef);

  esMiPerfil = computed(() => {
    const u = this.user();
    const current = this.auth.currentUser();
    return !!(u && current && u._id === current._id);
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    public auth: AuthService,
    private chatService: ChatService
  ) {}

  ngOnInit() {
    this.route.paramMap
      .pipe(
        map((p) => p.get('id')),
        filter((id): id is string => !!id),
        distinctUntilChanged(),
        tap((id) => {
          this.idPerfil = id;
          this.cargando.set(true);
          this.error.set(null);
          this.modalBorrar.set(false);
        }),
        switchMap((id) => this.userService.getUserById(id)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
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

  // recargar sin poner toda la pantalla en "cargando"
  refrescarPerfil() {
    this.userService.getUserById(this.idPerfil).subscribe({
      next: (d) => this.user.set(d),
      error: (err) => this.error.set(err.error?.message || 'Error al actualizar perfil')
    });
  }

  nickAmigo(a: unknown): string {
    if (a && typeof a === 'object' && 'nick' in a && (a as { nick?: string }).nick) {
      return String((a as { nick: string }).nick);
    }
    return 'Usuario';
  }

  idAmigo(a: unknown): string {
    if (a && typeof a === 'object' && '_id' in a) {
      return String((a as { _id: string })._id);
    }
    return String(a);
  }

  juegosFavoritos(u: User): VideojuegoFavorito[] {
    const fav = u.favoritos;
    if (!fav?.length) return [];
    return fav
      .map((x) =>
        typeof x === 'object' && x !== null && '_id' in x
          ? (x as VideojuegoFavorito)
          : null
      )
      .filter((x): x is VideojuegoFavorito => x !== null);
  }

  abrirModalBorrar() {
    this.modalBorrar.set(true);
  }

  cerrarModalBorrar() {
    if (!this.borrando()) {
      this.modalBorrar.set(false);
    }
  }

  confirmarBorrarCuenta() {
    const u = this.user();
    if (!u) return;
    this.borrando.set(true);
    this.error.set(null);
    this.userService.deleteUser(u._id).subscribe({
      next: () => {
        this.borrando.set(false);
        this.modalBorrar.set(false);
        this.auth.logout();
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.borrando.set(false);
        this.error.set(err.error?.message || 'Error al borrar');
      }
    });
  }

  anadirAmigo() {
    const u = this.user();
    const current = this.auth.currentUser();
    if (!u || !current || u._id === current._id) return;
    this.userService.addAmigo(current._id, u._id).subscribe({
      next: (updated) => {
        this.auth.syncCurrentUser(updated);
        if (this.esMiPerfil()) {
          this.user.set(updated);
        }
      },
      error: (err) => this.error.set(err.error?.message || 'Error al añadir amigo')
    });
  }

  quitarAmigo(amigoId: string) {
    const current = this.auth.currentUser();
    if (!current) return;
    this.userService.removeAmigo(current._id, amigoId).subscribe({
      next: (updated) => {
        this.auth.syncCurrentUser(updated);
        this.refrescarPerfil();
      },
      error: (err) => this.error.set(err.error?.message || 'Error al quitar amigo')
    });
  }

  yaEsAmigo(userId: string): boolean {
    const current = this.auth.currentUser();
    if (!current || !current.amigos) return false;
    return (current.amigos as unknown[]).some(
      (a: unknown) =>
        (typeof a === 'object' && a && '_id' in a ? (a as { _id: string })._id : a) === userId
    );
  }

  urlFoto(foto?: string): string {
    return urlFotoPerfil(foto);
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
