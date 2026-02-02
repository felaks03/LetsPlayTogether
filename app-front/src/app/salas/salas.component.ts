import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalasService, Sala } from './salas.service';

@Component({
  selector: 'app-salas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './salas.component.html',
  styleUrls: ['./salas.component.css']
})
export class SalasComponent implements OnInit {
  salas = signal<Sala[]>([]);
  cargando = signal(true);
  error = signal<string | null>(null);

  // Para crear sala
  nuevaSalaNombre = '';
  nuevaSalaVideojuegoId = '';
  nuevaSalaMaxUsuarios = 4;

  // Reemplaza con el ID del usuario actual
  hostId = '697a5cb7661c1e020e6a3020';

  constructor(private salasService: SalasService) {}

  ngOnInit() {
    this.cargarSalas();
  }

  cargarSalas() {
    this.cargando.set(true);
    this.error.set(null);
    this.salasService.getSalas().subscribe({
      next: (data) => {
        this.salas.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar salas');
        console.error(err);
        this.cargando.set(false);
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
      next: () => this.cargarSalas(),
      error: (err) => {
        this.error.set(err.error?.error || 'Error al unirse a la sala');
        console.error(err);
      }
    });
  }

salirSala(sala: Sala) {
  this.salasService.leaveSala(sala._id, this.hostId).subscribe({
    next: () => this.cargarSalas(),
    error: (err) => {
      this.error.set(err.error?.error || 'Error al salir de la sala');
      console.error(err);
    }
  });
}

eliminarSala(sala: Sala) {
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
  return sala.usuarios.some(u => u.toString() === this.hostId);
}

esHost(sala: Sala): boolean {
  return sala.host.toString() === this.hostId;
}


}
