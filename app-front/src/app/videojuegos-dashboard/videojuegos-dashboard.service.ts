import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Videojuego {
  id: string;
  nombre: string;
  descripcion: string;
  imagen: string;
  genero: string;
  plataformas: string[];
  calificacion: number;
  jugadoresOnline: number;
}

@Injectable({
  providedIn: 'root',
})
export class VideojuegosService {
  private videojuegos: Videojuego[] = [
    {
      id: '1',
      nombre: 'Cyberpunk 2077',
      descripcion:
        'Un emocionante juego RPG de rol en primera persona ambientado en un futuro distópico. Explora la megalópolis de Night City, toma decisiones que cambian tu destino y experimenta una historia única con múltiples finales.',
      imagen: 'https://via.placeholder.com/300x400?text=Cyberpunk+2077',
      genero: 'RPG',
      plataformas: ['PC', 'PS5', 'Xbox'],
      calificacion: 4.5,
      jugadoresOnline: 125000,
    },
    {
      id: '2',
      nombre: 'Call of Duty: Modern Warfare III',
      descripcion:
        'El último capítulo de la saga con intensas batallas multijugador. Únete a amigos en combates emocionantes, domina nuevas armas y mapas, y demuestra tus habilidades contra jugadores de todo el mundo.',
      imagen: 'https://via.placeholder.com/300x400?text=Call+of+Duty',
      genero: 'FPS',
      plataformas: ['PC', 'PS5', 'Xbox'],
      calificacion: 4.3,
      jugadoresOnline: 450000,
    },
    {
      id: '3',
      nombre: 'Elden Ring',
      descripcion:
        'Un épico juego de rol de acción en un mundo abierto lleno de misterios. Colabora con otros jugadores para derrotar jefes legendarios, descubre secretos ocultos y forja tu propio camino hacia la gloria.',
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
        'Estrategia en tiempo real competitiva con profundidad estratégica sin límites. Domina tres razas distintas, compite en torneos internacionales y demuéstrate como un verdadero campeón estratega.',
      imagen: 'https://via.placeholder.com/300x400?text=StarCraft+II',
      genero: 'Estrategia',
      plataformas: ['PC'],
      calificacion: 4.6,
      jugadoresOnline: 80000,
    },
    {
      id: '5',
      nombre: 'The Legend of Zelda: Tears of the Kingdom',
      descripcion:
        'Una aventura épica en un mundo mágico lleno de peligros y tesoros. Descubre el misterio del reino, resuelve acertijos fantásticos y enfrenta enemigos formidables en tu viaje épico.',
      imagen: 'https://via.placeholder.com/300x400?text=Zelda',
      genero: 'Aventura',
      plataformas: ['Nintendo Switch'],
      calificacion: 4.9,
      jugadoresOnline: 300000,
    },
    {
      id: '6',
      nombre: 'FIFA 24',
      descripcion:
        'El simulador de fútbol más realista con los mejores jugadores del mundo. Crea tu equipo de ensueño, compite en divisiones online y vive la experiencia del fútbol profesional.',
      imagen: 'https://via.placeholder.com/300x400?text=FIFA+24',
      genero: 'Deportes',
      plataformas: ['PC', 'PS5', 'Xbox'],
      calificacion: 4.2,
      jugadoresOnline: 500000,
    },
  ];

  obtenerVideojuegos(): Observable<Videojuego[]> {
    return of(this.videojuegos);
  }

  obtenerVideojuegoPorId(id: string): Observable<Videojuego | undefined> {
    const videojuego = this.videojuegos.find((v) => v.id === id);
    return of(videojuego);
  }
}
