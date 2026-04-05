import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../admin.service';
import { Videojuego } from '../../videojuegos/videojuegos.service';

type Vista = 'lista' | 'crear' | 'editar';

const GENEROS = ['Aventura', 'Acción', 'RPG', 'Plataformas', 'Sandbox', 'Deportes', 'Shooter', 'Estrategia', 'Simulación', 'Terror', 'Puzzle', 'Carreras', 'Lucha', 'Otro'];
const PLATAFORMAS = ['PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series X', 'Xbox One', 'Nintendo Switch', 'Mobile'];

function videojuegoVacio(): Partial<Videojuego> & { plataformasSeleccionadas: Record<string, boolean> } {
  return {
    titulo: '',
    descripcion: '',
    imagen: '',
    genero: '',
    desarrollador: '',
    fechaLanzamiento: '',
    plataformas: [],
    puntuacion: 0,
    multijugador: false,
    plataformasSeleccionadas: {},
  };
}

@Component({
  selector: 'app-admin-videojuegos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-videojuegos.component.html',
  styleUrls: ['./admin-videojuegos.component.css'],
})
export class AdminVideojuegosComponent implements OnInit {
  videojuegos = signal<Videojuego[]>([]);
  cargando = signal(true);
  error = signal('');
  busqueda = signal('');

  vista = signal<Vista>('lista');
  juegoSeleccionado = signal<Videojuego | null>(null);

  form = signal(videojuegoVacio());
  guardando = signal(false);
  errorForm = signal('');

  confirmarBorrar = signal(false);
  borrando = signal(false);

  generos = GENEROS;
  plataformasDisponibles = PLATAFORMAS;

  videojuegosFiltrados = computed(() => {
    const q = this.busqueda().toLowerCase().trim();
    const lista = this.videojuegos();
    if (!q) return lista;
    return lista.filter(
      (v) =>
        v.titulo.toLowerCase().includes(q) ||
        (v.genero ?? '').toLowerCase().includes(q) ||
        (v.desarrollador ?? '').toLowerCase().includes(q)
    );
  });

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.cargarVideojuegos();
  }

  cargarVideojuegos(): void {
    this.cargando.set(true);
    this.error.set('');
    this.adminService.getVideojuegos().subscribe({
      next: (data) => {
        this.videojuegos.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al cargar videojuegos');
        this.cargando.set(false);
      },
    });
  }

  abrirCrear(): void {
    this.juegoSeleccionado.set(null);
    this.form.set(videojuegoVacio());
    this.errorForm.set('');
    this.vista.set('crear');
  }

  abrirEditar(v: Videojuego): void {
    this.juegoSeleccionado.set(v);
    const platSel: Record<string, boolean> = {};
    (v.plataformas ?? []).forEach((p) => (platSel[p] = true));

    this.form.set({
      titulo: v.titulo,
      descripcion: v.descripcion ?? '',
      imagen: v.imagen ?? '',
      genero: v.genero ?? '',
      desarrollador: v.desarrollador ?? '',
      fechaLanzamiento: v.fechaLanzamiento ? v.fechaLanzamiento.substring(0, 10) : '',
      plataformas: v.plataformas ?? [],
      puntuacion: v.puntuacion ?? 0,
      multijugador: v.multijugador ?? false,
      plataformasSeleccionadas: platSel,
    });
    this.errorForm.set('');
    this.vista.set('editar');
  }

  togglePlataforma(plat: string): void {
    this.form.update((f) => {
      const sel = { ...f.plataformasSeleccionadas, [plat]: !f.plataformasSeleccionadas[plat] };
      const plataformas = Object.entries(sel)
        .filter(([, v]) => v)
        .map(([k]) => k);
      return { ...f, plataformasSeleccionadas: sel, plataformas };
    });
  }

  updateField(field: string, value: any): void {
    this.form.update((f) => ({ ...f, [field]: value }));
  }

  toggleMultijugador(): void {
    this.form.update((f) => ({ ...f, multijugador: !f.multijugador }));
  }

  guardar(): void {
    const f = this.form();
    if (!f.titulo?.trim()) {
      this.errorForm.set('El título es obligatorio');
      return;
    }

    const payload: Partial<Videojuego> = {
      titulo: f.titulo,
      descripcion: f.descripcion,
      imagen: f.imagen,
      genero: f.genero,
      desarrollador: f.desarrollador,
      plataformas: f.plataformas,
      puntuacion: f.puntuacion,
      multijugador: f.multijugador,
    };
    if (f.fechaLanzamiento) {
      payload.fechaLanzamiento = f.fechaLanzamiento;
    }

    this.guardando.set(true);
    this.errorForm.set('');

    const juego = this.juegoSeleccionado();

    if (juego) {
      // Actualizar
      this.adminService.updateVideojuego(juego._id, payload).subscribe({
        next: (actualizado) => {
          this.videojuegos.update((list) =>
            list.map((x) => (x._id === juego._id ? actualizado : x))
          );
          this.guardando.set(false);
          this.vista.set('lista');
        },
        error: (err) => {
          this.errorForm.set(err.error?.message || 'Error al guardar');
          this.guardando.set(false);
        },
      });
    } else {
      // Crear
      this.adminService.createVideojuego(payload).subscribe({
        next: (nuevo) => {
          this.videojuegos.update((list) => [nuevo, ...list]);
          this.guardando.set(false);
          this.vista.set('lista');
        },
        error: (err) => {
          this.errorForm.set(err.error?.message || 'Error al crear');
          this.guardando.set(false);
        },
      });
    }
  }

  pedirConfirmacion(v: Videojuego): void {
    this.juegoSeleccionado.set(v);
    this.confirmarBorrar.set(true);
  }

  cancelarBorrar(): void {
    this.confirmarBorrar.set(false);
  }

  borrarVideojuego(): void {
    const v = this.juegoSeleccionado();
    if (!v) return;

    this.borrando.set(true);
    this.adminService.deleteVideojuego(v._id).subscribe({
      next: () => {
        this.videojuegos.update((list) => list.filter((x) => x._id !== v._id));
        this.borrando.set(false);
        this.confirmarBorrar.set(false);
      },
      error: () => {
        this.borrando.set(false);
      },
    });
  }

  volver(): void {
    this.vista.set('lista');
    this.confirmarBorrar.set(false);
  }

  formatFecha(iso?: string): string {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}
