import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { NavigationEnd, Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  menuJuegoAbierto = signal(false);

  constructor(public auth: AuthService, private router: Router) {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => this.menuJuegoAbierto.set(false));
  }

  esMain(): boolean {
    return this.router.url === '/';
  }

  toggleMenuJuego(): void {
    this.menuJuegoAbierto.update((v) => !v);
  }

  cerrarMenuJuego(): void {
    this.menuJuegoAbierto.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.menuJuegoAbierto()) {
      this.cerrarMenuJuego();
    }
  }

  cerrarSesion(): void {
    this.cerrarMenuJuego();
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
