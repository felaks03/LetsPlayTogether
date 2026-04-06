import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { VideojuegosService, Videojuego } from '../videojuegos.service';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../user/user.service';

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
  favoritoCargando = false;

  constructor(
    private route: ActivatedRoute,
    private videojuegosService: VideojuegosService,
    public auth: AuthService,
    private userService: UserService
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
    if (!this.videojuego) return 'empty';
    const puntuacion = this.puntuacionSobre5;
    if (index < Math.floor(puntuacion)) {
      return 'filled';
    } else if (index < puntuacion) {
      return 'half';
    }
    return 'empty';
  }

  obtenerEstrellas(): string[] {
    return Array.from({ length: 5 }, (_, i) => this.obtenerEstrella(i));
  }

  esFavoritoUsuario(): boolean {
    const me = this.auth.currentUser();
    const v = this.videojuego;
    if (!me?.favoritos?.length || !v) return false;
    const vid = String(v._id);
    return me.favoritos.some((f) => {
      const id =
        typeof f === 'object' && f !== null && '_id' in f
          ? String((f as { _id: string })._id)
          : String(f);
      return id === vid;
    });
  }

  toggleFavorito() {
    const me = this.auth.currentUser();
    const v = this.videojuego;
    if (!me || !v || this.favoritoCargando) return;
    this.favoritoCargando = true;
    this.error = null;
    this.userService.toggleFavoritoVideojuego(me._id, v._id).subscribe({
      next: (u) => {
        this.auth.syncCurrentUser(u);
        this.favoritoCargando = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al actualizar favoritos';
        this.favoritoCargando = false;
      }
    });
  }
}
