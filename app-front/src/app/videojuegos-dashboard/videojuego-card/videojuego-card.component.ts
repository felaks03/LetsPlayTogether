import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Videojuego {
  id: string;
  nombre: string;
  descripcion: string;
  imagen: string;
  genero: string;
  plataformas: string[];
  calificacion: number;
  jugadoresOnline: number;
}

@Component({
  selector: 'app-videojuego-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './videojuego-card.component.html',
  styleUrls: ['./videojuego-card.component.css'],
})
export class VideojuegoCardComponent {
  @Input() videojuego!: Videojuego;

  obtenerEstrella(index: number): string {
    if (index < Math.floor(this.videojuego.calificacion)) {
      return '★';
    } else if (index < this.videojuego.calificacion) {
      return '☆';
    }
    return '☆';
  }

  obtenerEstrellas(): string[] {
    return Array.from({ length: 5 }, (_, i) => this.obtenerEstrella(i));
  }
}
