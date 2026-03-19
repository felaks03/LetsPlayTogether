import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { LoginRegisterComponent } from '../auth/login-register.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LoginRegisterComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  noticias = [
    {
      titulo: 'Entra en salas para jugar',
      texto: 'Encuentra jugadores de tu nivel, crea una sala en segundos y organiza partidas rapidas.',
      foto:
        'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80'
    },
    {
      titulo: 'Chat directo estilo Steam',
      texto: 'Habla con tus amigos antes de jugar, comparte ideas y coordina la estrategia del equipo.',
      foto:
        'https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=900&q=80'
    },
    {
      titulo: 'Fichas de videojuegos',
      texto: 'Consulta informacion de juegos, descubre novedades y encuentra a quien le guste lo mismo.',
      foto:
        'https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&w=900&q=80'
    }
  ];

  indiceActual = signal(0);
  private autoPlayId: ReturnType<typeof setInterval> | null = null;

  get noticiaActual() {
    return this.noticias[this.indiceActual()];
  }

  ngOnInit() {
    this.autoPlayId = setInterval(() => {
      this.siguiente();
    }, 4500);
  }

  ngOnDestroy() {
    if (this.autoPlayId) {
      clearInterval(this.autoPlayId);
      this.autoPlayId = null;
    }
  }

  anterior() {
    const nuevo = (this.indiceActual() - 1 + this.noticias.length) % this.noticias.length;
    this.indiceActual.set(nuevo);
  }

  siguiente() {
    const nuevo = (this.indiceActual() + 1) % this.noticias.length;
    this.indiceActual.set(nuevo);
  }
}
