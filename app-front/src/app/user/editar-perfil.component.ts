import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from './user.service';
import { AuthService, User } from '../auth/auth.service';
import { urlFotoPerfil } from '../shared/foto-url';
import { validatePassword } from '../shared/password-rules';

@Component({
  selector: 'app-editar-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.css']
})
export class EditarPerfilComponent implements OnInit, OnDestroy {
  user = signal<User | null>(null);
  cargando = signal(true);
  guardando = signal(false);
  error = signal<string | null>(null);

  nick = '';
  edad = 18;
  twitter = '';
  discord = '';
  twitch = '';
  passwordNueva = '';
  passwordRepite = '';

  archivoSeleccionado: File | null = null;
  private previewObjectUrl: string | null = null;

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
    const yo = this.auth.currentUser();
    if (!yo || yo._id !== id) {
      this.router.navigate(['/usuarios', id]);
      return;
    }
    this.userService.getUserById(id).subscribe({
      next: (data) => {
        this.user.set(data);
        this.nick = data.nick;
        this.edad = data.edad;
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

  ngOnDestroy() {
    if (this.previewObjectUrl) {
      URL.revokeObjectURL(this.previewObjectUrl);
    }
  }

  vistaPreviaFoto(): string {
    if (this.previewObjectUrl) return this.previewObjectUrl;
    return urlFotoPerfil(this.user()?.foto);
  }

  onArchivo(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      this.error.set('Elige un archivo de imagen.');
      return;
    }
    this.error.set(null);
    if (this.previewObjectUrl) {
      URL.revokeObjectURL(this.previewObjectUrl);
    }
    this.archivoSeleccionado = file;
    this.previewObjectUrl = URL.createObjectURL(file);
  }

  guardar() {
    const u = this.user();
    if (!u) return;

    if (this.passwordNueva.trim()) {
      const errPw = validatePassword(this.passwordNueva);
      if (errPw) {
        this.error.set(errPw);
        return;
      }
      if (this.passwordNueva !== this.passwordRepite) {
        this.error.set('Las contraseñas no coinciden.');
        return;
      }
    }

    this.error.set(null);
    this.guardando.set(true);

    const body: Record<string, unknown> = {
      nick: this.nick,
      edad: this.edad,
      redes: { twitter: this.twitter, discord: this.discord, twitch: this.twitch }
    };
    if (this.passwordNueva.trim()) {
      body['password'] = this.passwordNueva;
    }

    const uid = u._id;

    const hacerPut = () => {
      this.userService.updateUser(uid, body as Partial<User> & { password?: string }).subscribe({
        next: (updated) => {
          this.auth.syncCurrentUser(updated);
          this.guardando.set(false);
          this.passwordNueva = '';
          this.passwordRepite = '';
          this.router.navigate(['/usuarios', uid]);
        },
        error: (err) => {
          this.error.set(err.error?.message || 'Error al guardar');
          this.guardando.set(false);
        }
      });
    };

    if (this.archivoSeleccionado) {
      this.userService.uploadAvatar(uid, this.archivoSeleccionado).subscribe({
        next: (userActualizado) => {
          this.user.set(userActualizado);
          this.auth.syncCurrentUser(userActualizado);
          if (this.previewObjectUrl) {
            URL.revokeObjectURL(this.previewObjectUrl);
            this.previewObjectUrl = null;
          }
          this.archivoSeleccionado = null;
          hacerPut();
        },
        error: (err) => {
          this.error.set(err.error?.message || 'Error al subir la imagen');
          this.guardando.set(false);
        }
      });
    } else {
      hacerPut();
    }
  }
}
