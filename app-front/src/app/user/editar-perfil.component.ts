import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from './user.service';
import { AuthService, User } from '../auth/auth.service';

@Component({
  selector: 'app-editar-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './editar-perfil.component.html'
})
export class EditarPerfilComponent implements OnInit {
  user = signal<User | null>(null);
  cargando = signal(true);
  guardando = signal(false);
  error = signal<string | null>(null);

  nick = '';
  edad = 18;
  foto = '';
  twitter = '';
  discord = '';
  twitch = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private auth: AuthService
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
        this.nick = data.nick;
        this.edad = data.edad;
        this.foto = data.foto || '';
        this.twitter = data.redes?.twitter || '';
        this.discord = data.redes?.discord || '';
        this.twitch = data.redes?.twitch || '';
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Error al cargar');
        this.cargando.set(false);
      }
    });
  }

  guardar() {
    const u = this.user();
    if (!u) return;
    this.error.set(null);
    this.guardando.set(true);
    this.userService
      .updateUser(u._id, {
        nick: this.nick,
        edad: this.edad,
        foto: this.foto || undefined,
        redes: { twitter: this.twitter, discord: this.discord, twitch: this.twitch }
      })
      .subscribe({
        next: (updated) => {
          this.auth.currentUser.set(updated);
          this.guardando.set(false);
          this.router.navigate(['/usuarios', u._id]);
        },
        error: (err) => {
          this.error.set(err.error?.message || 'Error al guardar');
          this.guardando.set(false);
        }
      });
  }
}
