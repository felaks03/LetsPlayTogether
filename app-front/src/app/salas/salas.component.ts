import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalasService, Sala, Videojuego } from './salas.service';
import { ViewChild, ElementRef } from '@angular/core';



interface MensajeLocal {
  id: string;
  emisor: string;
  contenido: string;
  fecha: Date;
}

@Component({
  selector: 'app-salas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './salas.component.html',
  styleUrls: ['./salas.component.css']
})

export class SalasComponent implements OnInit {
  salas = signal<Sala[]>([]);
  videojuegos = signal<Videojuego[]>([]);
  cargando = signal(true);
  error = signal<string | null>(null);
  vistaActual = signal<'listado' | 'sala'>('listado');
  salaActiva = signal<Sala | null>(null);
  filtroNombre = signal('');
  filtroEstado = signal<'ALL' | 'OPEN' | 'IN_GAME' | 'FULL' | 'CLOSED'>('ALL');
  mensajes = signal<MensajeLocal[]>([]);
  nuevoMensaje = '';

  @ViewChild('chatScroll') chatScroll!: ElementRef;


  
  // Para crear sala
  nuevaSalaNombre = '';
  nuevaSalaVideojuegoId = '';
  nuevaSalaMaxUsuarios = 4;

  // Reemplaza con el ID del usuario actual
  // hostId = '69810b5fa840472affc1ba43';
  hostId = '698119804374cee72b4cf6e7';

  constructor(private salasService: SalasService) {}

  ngOnInit() {
    this.cargarSalas();
    this.cargarVideojuegos
  }

  cargarSalas() {
  this.cargando.set(true);
  this.error.set(null);

  this.salasService.getSalas().subscribe({
    next: (data) => {
      this.salas.set(data);

      const salaDelUsuario = data.find(sala =>
        sala.usuarios
          .map(u => u.toString())
          .includes(this.hostId)
      );

      if (salaDelUsuario) {
        this.salaActiva.set(salaDelUsuario);
        this.vistaActual.set('sala');
      }

      this.cargando.set(false);
    },
    error: (err) => {
      this.error.set('Error al cargar salas');
      console.error(err);
      this.cargando.set(false);
    }
  });
}


  cargarVideojuegos() {
    this.salasService.getVideojuegos().subscribe({
      next: (data) => {
        this.videojuegos.set(data);
      },
      error: (err) => {
        console.error('Error cargando videojuegos', err);
      }
    });
  }


  crearSala() {
    if (!this.nuevaSalaNombre || !this.nuevaSalaVideojuegoId) {
      this.error.set('Debes ingresar nombre y videojuego de la sala');
      return;
    }

    this.salasService.createSala({
      nombre: this.nuevaSalaNombre,
      videojuego: this.nuevaSalaVideojuegoId,
      host: this.hostId,
      maxUsuarios: this.nuevaSalaMaxUsuarios
    }).subscribe({
      next: (sala) => {
        this.salas.update(salas => [...salas, sala]);
        this.nuevaSalaNombre = '';
        this.nuevaSalaVideojuegoId = '';
        this.error.set(null);
      },
      error: (err) => {
        this.error.set('Error al crear la sala');
        console.error(err);
      }
    });
  }

  unirseSala(sala: Sala) {
    this.salasService.joinSala(sala._id, this.hostId).subscribe({
      next: (salaActualizada) => {
      this.entrarEnSala(salaActualizada);
      this.cargarSalas();
    },
      error: (err) => {
        this.error.set(err.error?.error || 'Error al unirse a la sala');
        console.error(err);
      }
    });
  }

  salirSala(sala: Sala) {
    this.salasService.leaveSala(sala._id, this.hostId).subscribe({
      next: () => {
        this.cargarSalas();

        // Si estás en vista sala, volver al listado
        if (this.vistaActual() === 'sala') {
          this.volverAlListado();
        }
      },
      error: (err) => {
        this.error.set(err.error?.error || 'Error al salir de la sala');
        console.error(err);
      }
    });
  }


  eliminarSala(sala: Sala) {
    const confirmacion = confirm(
      `¿Seguro que quieres eliminar la sala "${sala.nombre}"?`
    );

    if (!confirmacion) return;

    this.salasService.deleteSala(sala._id).subscribe({
      next: () => this.cargarSalas(),
      error: (err) => {
        this.error.set(err.error?.error || 'Error al eliminar la sala');
        console.error(err);
      }
    });
  }


  cambiarEstadoSala(sala: Sala, estado: Sala['estado']) {
    this.salasService.updateEstadoSala(sala._id, estado).subscribe({
      next: () => this.cargarSalas(),
      error: (err) => {
        this.error.set(err.error?.error || 'Error al actualizar estado');
        console.error(err);
      }
    });
  }

  esUsuarioEnSala(sala: Sala): boolean {
    return sala.usuarios
      .map(u => u.toString())
      .includes(this.hostId);
  }

  esHost(sala: Sala): boolean {
    return sala.host.toString() === this.hostId;
    
  }

  estaEnAlgunaSala(): boolean {
    return this.salas().some(sala =>
      sala.usuarios
        .map(u => u.toString())
        .includes(this.hostId)
    );
  }


  entrarEnSala(sala: Sala) {
    this.salaActiva.set(sala);
    this.vistaActual.set('sala');
  }

  volverAlListado() {
    this.salaActiva.set(null);
    this.vistaActual.set('listado');
  }

  get salasFiltradas(): Sala[] {
    return this.salas().filter(sala => {

      const coincideNombre =
        sala.nombre.toLowerCase().includes(
          this.filtroNombre().toLowerCase()
        );

      const coincideEstado =
        this.filtroEstado() === 'ALL' ||
        sala.estado === this.filtroEstado();

      return coincideNombre && coincideEstado;
    });
  }

  esUsuarioActual(userId: string): boolean {
    return userId.toString() === this.hostId;
  }

  enviarMensaje() {
    if (!this.nuevoMensaje.trim()) return;

    const mensaje: MensajeLocal = {
      id: crypto.randomUUID(),
      emisor: this.hostId,
      contenido: this.nuevoMensaje.trim(),
      fecha: new Date()
    };

    this.mensajes.update(m => [...m, mensaje]);
    this.nuevoMensaje = '';

    this.scrollAlFinal();
  }

  scrollAlFinal() {
    setTimeout(() => {
      if (this.chatScroll) {
        this.chatScroll.nativeElement.scrollTop =
          this.chatScroll.nativeElement.scrollHeight;
      }
    }, 0);
  }








}
