import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VideojuegoCardComponent } from './videojuego-card/videojuego-card.component';
import { VideojuegosService, Videojuego } from '../videojuegos.service';
import { AuthService } from '../../auth/auth.service';

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
  cargando = false;
  error: string | null = null;

  // Admin modal
  mostrarModal = false;
  modoEdicion = false;
  videojuegoEditando: Partial<Videojuego> = {};

  // Confirmación eliminar
  mostrarConfirmacion = false;
  videojuegoAEliminar: Videojuego | null = null;

  constructor(
    private videojuegosService: VideojuegosService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.cargarVideojuegos();
  }

  get esAdmin(): boolean {
    return this.authService.isAdmin();
  }

  cargarVideojuegos() {
    this.cargando = true;
    this.error = null;
    this.videojuegosService.obtenerVideojuegos().subscribe({
      next: (data) => {
        this.videojuegos = data;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar videojuegos. Asegúrate de estar logueado.';
        console.error(err);
        this.cargando = false;
      },
    });
  }

  get videojuegosFiltrados(): Videojuego[] {
    if (!this.terminoBusqueda.trim()) {
      return this.videojuegos;
    }
    const termino = this.terminoBusqueda.toLowerCase();
    return this.videojuegos.filter(
      (vj) =>
        vj.titulo.toLowerCase().includes(termino) ||
        (vj.genero && vj.genero.toLowerCase().includes(termino)),
    );
  }

  // ---- Admin CRUD ----

  abrirModalCrear() {
    this.modoEdicion = false;
    this.videojuegoEditando = {
      titulo: '',
      descripcion: '',
      imagen: '',
      genero: '',
      desarrollador: '',
      plataformas: [],
      puntuacion: 0,
      multijugador: false,
    };
    this.mostrarModal = true;
  }

  abrirModalEditar(vj: Videojuego) {
    this.modoEdicion = true;
    this.videojuegoEditando = { ...vj, plataformas: [...vj.plataformas] };
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.videojuegoEditando = {};
  }

  get plataformasTexto(): string {
    return this.videojuegoEditando.plataformas?.join(', ') || '';
  }

  set plataformasTexto(val: string) {
    this.videojuegoEditando.plataformas = val
      .split(',')
      .map((p) => p.trim())
      .filter((p) => p);
  }

  guardarVideojuego() {
    if (!this.videojuegoEditando.titulo) {
      this.error = 'El título es obligatorio';
      return;
    }

    if (this.modoEdicion && this.videojuegoEditando._id) {
      this.videojuegosService
        .actualizarVideojuego(this.videojuegoEditando._id, this.videojuegoEditando)
        .subscribe({
          next: () => {
            this.cerrarModal();
            this.cargarVideojuegos();
          },
          error: (err) => {
            this.error = 'Error al actualizar videojuego';
            console.error(err);
          },
        });
    } else {
      this.videojuegosService.crearVideojuego(this.videojuegoEditando).subscribe({
        next: () => {
          this.cerrarModal();
          this.cargarVideojuegos();
        },
        error: (err) => {
          this.error = 'Error al crear videojuego';
          console.error(err);
        },
      });
    }
  }

  confirmarEliminar(vj: Videojuego) {
    this.videojuegoAEliminar = vj;
    this.mostrarConfirmacion = true;
  }

  cancelarEliminar() {
    this.videojuegoAEliminar = null;
    this.mostrarConfirmacion = false;
  }

  eliminarVideojuego() {
    if (!this.videojuegoAEliminar) return;
    this.videojuegosService.eliminarVideojuego(this.videojuegoAEliminar._id).subscribe({
      next: () => {
        this.cancelarEliminar();
        this.cargarVideojuegos();
      },
      error: (err) => {
        this.error = 'Error al eliminar videojuego';
        console.error(err);
      },
    });
  }
}
