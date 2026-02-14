import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { VideojuegosService, Videojuego } from '../videojuegos-dashboard/videojuegos.service';

@Component({
  selector: 'app-videojuego-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './videojuego-detalle.component.html',
  styleUrls: ['./videojuego-detalle.component.css'],
})
export class VideojuegoDetalleComponent implements OnInit {
  videojuego: Videojuego | null = null;
  cargando = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private videojuegosService: VideojuegosService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.videojuegosService.obtenerVideojuegoPorId(id).subscribe({
        next: (videojuego) => {
          this.videojuego = videojuego;
          this.cargando = false;
        },
        error: (err) => {
          this.error = 'Error al cargar el videojuego';
          this.cargando = false;
          console.error(err);
        },
      });
    }
  }

  get puntuacionSobre5(): number {
    return (this.videojuego?.puntuacion || 0) / 2;
  }

  obtenerEstrella(index: number): string {
    if (!this.videojuego) return '☆';
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
