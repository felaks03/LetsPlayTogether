import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { AVATAR_PRESETS } from '../shared/avatar-presets';
import { urlFotoPerfil } from '../shared/foto-url';
import { validatePassword } from '../shared/password-rules';

@Component({
  selector: 'app-login-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css']
})
export class LoginRegisterComponent implements OnInit {
  esLogin = signal(true);
  email = '';
  password = '';
  nick = '';
  edad = 18;
  /** Si no eliges foto, el servidor asigna la por defecto */
  fotoElegida = '';
  readonly avataresRegistro = [...AVATAR_PRESETS];
  readonly urlAvatarPreset = (src: string) => urlFotoPerfil(src);
  error = signal<string | null>(null);
  cargando = signal(false);

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.esLogin.set(true);
  }

  toggleModo() {
    this.esLogin.update((v) => !v);
    this.error.set(null);
    this.fotoElegida = '';
  }

  enviarLogin() {
    this.error.set(null);
    this.cargando.set(true);
    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.cargando.set(false);
        const destino = this.auth.isAdmin() ? '/admin/usuarios' : '/videojuegos';
        this.router.navigate([destino]);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Error al iniciar sesión');
        this.cargando.set(false);
      }
    });
  }

  enviarRegister() {
    this.error.set(null);
    if (!this.nick || !this.email || !this.password) {
      this.error.set('Completa todos los campos');
      return;
    }
    const errPw = validatePassword(this.password);
    if (errPw) {
      this.error.set(errPw);
      return;
    }
    this.cargando.set(true);
    const body: Parameters<AuthService['register']>[0] = {
      nick: this.nick,
      email: this.email,
      password: this.password,
      edad: this.edad
    };
    if (this.fotoElegida) {
      body.foto = this.fotoElegida;
    }
    this.auth.register(body).subscribe({
      next: () => {
        this.auth.login(this.email, this.password).subscribe({
          next: () => {
            this.cargando.set(false);
            const destino = this.auth.isAdmin() ? '/admin/usuarios' : '/videojuegos';
            this.router.navigate([destino]);
          },
          error: () => {
            this.cargando.set(false);
            this.error.set('Registrado. Inicia sesión.');
          }
        });
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Error al registrarse');
        this.cargando.set(false);
      }
    });
  }
}
