import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../admin.service';
import { User } from '../../auth/auth.service';
import { urlFotoPerfil } from '../../shared/foto-url';

type Vista = 'lista' | 'detalle' | 'editar' | 'crear';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-usuarios.component.html',
  styleUrls: ['./admin-usuarios.component.css'],
})
export class AdminUsuariosComponent implements OnInit {
  usuarios = signal<User[]>([]);
  cargando = signal(true);
  error = signal('');
  busqueda = signal('');

  vista = signal<Vista>('lista');
  usuarioSeleccionado = signal<User | null>(null);

  // Edición
  editForm = signal<Partial<User & { password?: string }>>({});
  guardando = signal(false);
  errorEditar = signal('');

  // Creación
  createForm = signal<Partial<User & { password?: string }>>({
    edad: 18,
    role: 'user',
    redes: { twitter: '', discord: '', twitch: '' },
  });
  creando = signal(false);
  errorCrear = signal('');

  // Confirmación borrar
  confirmarBorrar = signal(false);
  borrando = signal(false);

  usuariosFiltrados = computed(() => {
    const q = this.busqueda().toLowerCase().trim();
    const lista = this.usuarios();
    if (!q) return lista;
    return lista.filter(
      (u) =>
        u.nick.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.role ?? '').toLowerCase().includes(q)
    );
  });

  urlFoto = urlFotoPerfil;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.cargando.set(true);
    this.error.set('');
    this.adminService.getUsers().subscribe({
      next: (data) => {
        this.usuarios.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al cargar usuarios');
        this.cargando.set(false);
      },
    });
  }

  // ─── Detalle ───
  verDetalle(u: User): void {
    this.usuarioSeleccionado.set(u);
    this.vista.set('detalle');
    this.confirmarBorrar.set(false);
  }

  // ─── Editar ───
  abrirEditar(u: User): void {
    this.usuarioSeleccionado.set(u);
    this.editForm.set({
      nick: u.nick,
      email: u.email,
      edad: u.edad,
      role: u.role,
      redes: { ...u.redes },
      password: '',
    });
    this.errorEditar.set('');
    this.vista.set('editar');
  }

  // ─── Crear ───
  abrirCrear(): void {
    this.createForm.set({
      nick: '',
      email: '',
      password: '',
      edad: 18,
      role: 'user',
      redes: { twitter: '', discord: '', twitch: '' },
    });
    this.errorCrear.set('');
    this.vista.set('crear');
  }

  crearUsuario(): void {
    const form = this.createForm();

    if (!form.nick || !form.email || !form.password) {
      this.errorCrear.set('Nick, email y contraseña son obligatorios');
      return;
    }

    const payload: any = {
      nick: form.nick,
      email: form.email,
      password: form.password,
      edad: form.edad || 18,
      role: form.role || 'user',
      redes: form.redes || { twitter: '', discord: '', twitch: '' },
    };

    this.creando.set(true);
    this.errorCrear.set('');

    this.adminService.createUser(payload).subscribe({
      next: (nuevoUsuario) => {
        this.usuarios.update((list) => [...list, nuevoUsuario]);
        this.creando.set(false);
        this.vista.set('lista');
      },
      error: (err) => {
        this.errorCrear.set(err.error?.message || 'Error al crear usuario');
        this.creando.set(false);
      },
    });
  }

  guardarEdicion(): void {
    const u = this.usuarioSeleccionado();
    if (!u) return;

    const form = this.editForm();
    const payload: any = {
      nick: form.nick,
      email: form.email,
      edad: form.edad,
      role: form.role,
      redes: form.redes,
    };
    if (form.password && form.password.trim()) {
      payload.password = form.password;
    }

    this.guardando.set(true);
    this.errorEditar.set('');

    this.adminService.updateUser(u._id, payload).subscribe({
      next: (actualizado) => {
        this.usuarios.update((list) =>
          list.map((x) => (x._id === u._id ? { ...x, ...actualizado } : x))
        );
        this.guardando.set(false);
        this.vista.set('lista');
      },
      error: (err) => {
        this.errorEditar.set(err.error?.message || 'Error al guardar');
        this.guardando.set(false);
      },
    });
  }

  // ─── Borrar ───
  pedirConfirmacion(u: User): void {
    this.usuarioSeleccionado.set(u);
    this.confirmarBorrar.set(true);
  }

  cancelarBorrar(): void {
    this.confirmarBorrar.set(false);
  }

  borrarUsuario(): void {
    const u = this.usuarioSeleccionado();
    if (!u) return;

    this.borrando.set(true);
    this.adminService.deleteUser(u._id).subscribe({
      next: () => {
        this.usuarios.update((list) => list.filter((x) => x._id !== u._id));
        this.borrando.set(false);
        this.confirmarBorrar.set(false);
        this.vista.set('lista');
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

  updateEditField(field: string, value: any): void {
    this.editForm.update((f) => ({ ...f, [field]: value }));
  }

  updateEditRed(red: string, value: string): void {
    this.editForm.update((f) => ({ ...f, redes: { ...f.redes, [red]: value } }));
  }

  updateCreateField(field: string, value: any): void {
    this.createForm.update((f) => ({ ...f, [field]: value }));
  }

  updateCreateRed(red: string, value: string): void {
    this.createForm.update((f) => ({ ...f, redes: { ...f.redes, [red]: value } }));
  }
}
