import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { VideojuegosService } from '../videojuegos-dashboard/videojuegos-dashboard.service';

@Component({
  selector: 'app-videojuego-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './videojuego-detalle.component.html',
  styleUrls: ['./videojuego-detalle.component.css'],
})
export class VideojuegoDetalleComponent implements OnInit {
  videojuego: any = null;

  constructor(
    private route: ActivatedRoute,
    private videojuegosService: VideojuegosService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.videojuegosService.obtenerVideojuegoPorId(id).subscribe({
        next: (videojuego: any) => {
          this.videojuego = videojuego;
        },
      });
    }
  }

  obtenerEstrella(index: number): string {
    if (!this.videojuego) return '☆';
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
