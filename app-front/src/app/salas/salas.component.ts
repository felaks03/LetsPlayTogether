import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-salas',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `
    <h2>Salas disponibles</h2>
    <ul>
      <li *ngFor="let sala of salas()">{{ sala.nombre }}</li>
    </ul>
  `
})
export class SalasComponent implements OnInit {
  salas = signal<any[]>([]);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>('TU_API/salas').subscribe({
      next: (data) => this.salas.set(data),
      error: (err) => console.error('Error al cargar salas', err)
    });
  }
}
