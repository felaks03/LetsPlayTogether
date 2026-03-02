import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-perfil-redirect',
  standalone: true,
  template: '<p>Cargando...</p>'
})
export class PerfilRedirectComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const user = this.auth.currentUser();
    if (user?._id) {
      this.router.navigate(['/usuarios', user._id]);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
