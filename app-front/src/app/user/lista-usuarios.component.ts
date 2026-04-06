import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from './user.service';
import { User } from '../auth/auth.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.css']
})
export class ListaUsuariosComponent implements OnInit {
  usuarios = signal<User[]>([]);
  filtroNick = signal('');
  filtroNickValue = '';
  cargando = signal(true);
  error = signal<string | null>(null);

  constructor(
    private userService: UserService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.cargando.set(true);
    this.error.set(null);
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.usuarios.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Error al cargar usuarios');
        this.cargando.set(false);
      }
    });
  }

  get usuariosFiltrados(): User[] {
    const termino = this.filtroNickValue.toLowerCase().trim();
    if (!termino) {
      return this.usuarios();
    }
    return this.usuarios().filter((u) =>
      u.nick.toLowerCase().includes(termino)
    );
  }

  puedeAgregar(u: User): boolean {
    const current = this.auth.currentUser();
    if (!current || current._id === u._id) return false;
    const amigos = (current.amigos || []) as any[];
    return !amigos.some((a) => a === u._id || (a as any)._id === u._id);
  }

  agregarAmigo(u: User) {
    const current = this.auth.currentUser();
    if (!current) return;
    this.userService.addAmigo(current._id, u._id).subscribe({
      next: (updated) => {
        this.auth.currentUser.set(updated);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'No se pudo añadir amigo');
      },
    });
  }

  iniciarChat(u: User) {
    this.error.set(null);
    const current = this.auth.currentUser();
    if (!current || current._id === u._id) return;
    this.userService
      .getOrCreateChatConUsuario(u._id)
      .subscribe({
        next: (chat) => {
          this.router.navigate(['/chats', chat._id]);
        },
        error: (err) => {
          this.error.set(err.error?.message || 'No se pudo iniciar el chat');
        },
      });
  }
}
