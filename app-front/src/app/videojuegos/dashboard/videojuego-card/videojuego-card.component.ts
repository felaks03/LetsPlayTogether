import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Videojuego } from '../../videojuegos.service';

@Component({
  selector: 'app-videojuego-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './videojuego-card.component.html',
  styleUrls: ['./videojuego-card.component.css'],
})
export class VideojuegoCardComponent {
  @Input() videojuego!: Videojuego;

  get puntuacionSobre5(): number {
    return (this.videojuego.puntuacion || 0) / 2;
  }

  obtenerEstrella(index: number): string {
    const puntuacion = this.puntuacionSobre5;
    if (index < Math.floor(puntuacion)) {
      return '★';
    } else if (index < puntuacion) {
      return '☆';
    }
    return '☆';
  }

  obtenerEstrellas(): string[] {
    return Array.from({ length: 5 }, (_, i) => this.obtenerEstrella(i));
  }
}
