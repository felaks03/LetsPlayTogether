import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from './user.service';
import { User } from '../auth/auth.service';

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './lista-usuarios.component.html'
})
export class ListaUsuariosComponent implements OnInit {
  usuarios = signal<User[]>([]);
  cargando = signal(true);
  error = signal<string | null>(null);

  constructor(private userService: UserService) {}

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
}
