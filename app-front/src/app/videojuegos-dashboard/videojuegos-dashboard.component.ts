import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VideojuegoCardComponent } from './videojuego-card/videojuego-card.component';

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
  selector: 'app-videojuegos-dashboard',
  standalone: true,
  imports: [CommonModule, VideojuegoCardComponent, FormsModule],
  templateUrl: './videojuegos-dashboard.component.html',
  styleUrls: ['./videojuegos-dashboard.component.css'],
})
export class VideojuegosDashboardComponent implements OnInit {
  videojuegos: Videojuego[] = [];
  terminoBusqueda: string = '';

  ngOnInit() {
    this.cargarVideojuegos();
  }

  cargarVideojuegos() {
    // Datos de prueba
    this.videojuegos = [
      {
        id: '1',
        nombre: 'Cyberpunk 2077',
        descripcion:
          'Un emocionante juego RPG de rol en primera persona ambientado en un futuro distópico.',
        imagen: 'https://via.placeholder.com/300x400?text=Cyberpunk+2077',
        genero: 'RPG',
        plataformas: ['PC', 'PS5', 'Xbox'],
        calificacion: 4.5,
        jugadoresOnline: 125000,
      },
      {
        id: '2',
        nombre: 'Call of Duty: Modern Warfare III',
        descripcion: 'El último capítulo de la saga con intensas batallas multijugador.',
        imagen: 'https://via.placeholder.com/300x400?text=Call+of+Duty',
        genero: 'FPS',
        plataformas: ['PC', 'PS5', 'Xbox'],
        calificacion: 4.3,
        jugadoresOnline: 450000,
      },
      {
        id: '3',
        nombre: 'Elden Ring',
        descripcion: 'Un épico juego de rol de acción en un mundo abierto lleno de misterios.',
        imagen: 'https://via.placeholder.com/300x400?text=Elden+Ring',
        genero: 'RPG',
        plataformas: ['PC', 'PS5', 'Xbox'],
        calificacion: 4.8,
        jugadoresOnline: 250000,
      },
      {
        id: '4',
        nombre: 'StarCraft II',
        descripcion:
          'Estrategia en tiempo real competitiva con profundidad estratégica sin límites.',
        imagen: 'https://via.placeholder.com/300x400?text=StarCraft+II',
        genero: 'Estrategia',
        plataformas: ['PC'],
        calificacion: 4.6,
        jugadoresOnline: 80000,
      },
      {
        id: '5',
        nombre: 'The Legend of Zelda: Tears of the Kingdom',
        descripcion: 'Una aventura épica en un mundo mágico lleno de peligros y tesoros.',
        imagen: 'https://via.placeholder.com/300x400?text=Zelda',
        genero: 'Aventura',
        plataformas: ['Nintendo Switch'],
        calificacion: 4.9,
        jugadoresOnline: 300000,
      },
      {
        id: '6',
        nombre: 'FIFA 24',
        descripcion: 'El simulador de fútbol más realista con los mejores jugadores del mundo.',
        imagen: 'https://via.placeholder.com/300x400?text=FIFA+24',
        genero: 'Deportes',
        plataformas: ['PC', 'PS5', 'Xbox'],
        calificacion: 4.2,
        jugadoresOnline: 500000,
      },
    ];
  }

  get videojuegosFiltrados(): Videojuego[] {
    if (!this.terminoBusqueda.trim()) {
      return this.videojuegos;
    }
    const termino = this.terminoBusqueda.toLowerCase();
    return this.videojuegos.filter(
      (vj) =>
        vj.nombre.toLowerCase().includes(termino) || vj.genero.toLowerCase().includes(termino),
    );
  }
}
