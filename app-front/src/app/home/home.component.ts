import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  template: ''
})
export class HomeComponent implements OnInit {
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/salas']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
