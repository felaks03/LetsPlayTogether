import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  constructor(public auth: AuthService, private router: Router) {}

  esMain(): boolean {
    return this.router.url === '/';
  }

  cerrarSesion() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
