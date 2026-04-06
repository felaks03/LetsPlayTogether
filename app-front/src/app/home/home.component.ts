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
      titulo: 'Deja de jugar siempre solo',
      texto:
        'La web te ayuda a conocer gente con tus mismos juegos e intereses, para que organices partidas y no vuelvas a quedarte sin equipo.',
      foto:
        'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=900&q=80'
    },
    {
      titulo: 'Chat en Stream',
      texto:
        'Habla con quien va a jugar contigo: mensajes claros, tono de comunidad gamer y coordinación antes de entrar a la partida.',
      foto: '/avatars/chat.png'
    },
    {
      titulo: 'Conoce más sobre tus videojuegos favoritos',
      texto:
        'Fichas con descripción, género y detalles para descubrir juegos afines y encontrar jugadores que aman lo mismo que tú.',
      foto:
        'https://sm.ign.com/t/ign_es/feature/t/the-top-10/the-top-100-video-games-of-all-time_53uq.1200.jpg'
    },
    {
      titulo: 'Salas listas en segundos',
      texto:
        'Crea o únete a una sala ligada al juego que quieras: filtra, entra y empieza sin complicaciones.',
      foto:
        'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80'
    },
    {
      titulo: 'Amigos, perfil y favoritos',
      texto:
        'Añade amigos, muestra tu perfil con avatar y guarda tus videojuegos favoritos para que otros sepan con qué te gusta jugar.',
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
