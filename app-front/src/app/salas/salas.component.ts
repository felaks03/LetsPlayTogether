import {
  Component,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { SalasService, Sala, SalaUsuarioRef, Videojuego } from './salas.service';
import { AuthService } from '../auth/auth.service';
import { API_ORIGIN } from '../shared/api-config';

interface MensajeLocal {
  id: string;
  emisorId: string;
  emisorNick: string;
  contenido: string;
  fecha: Date;
}

@Component({
  selector: 'app-salas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './salas.component.html',
  styleUrls: ['./salas.component.css'],
})
export class SalasComponent implements OnInit, OnDestroy {
  salas = signal<Sala[]>([]);
  videojuegos = signal<Videojuego[]>([]);
  cargando = signal(true);
  error = signal<string | null>(null);
  /** listado | crear | sala */
  vistaPrincipal = signal<'listado' | 'crear' | 'sala'>('listado');
  salaActiva = signal<Sala | null>(null);
  filtroBusqueda = signal('');
  /** Filtro estricto por id de videojuego (query ?videojuego=) */
  filtroVideojuegoId = signal<string | null>(null);
  mensajes = signal<MensajeLocal[]>([]);
  nuevoMensaje = '';

  nuevaSalaNombre = '';
  nuevaSalaVideojuegoId = '';
  nuevaSalaMaxUsuarios = 4;

  @ViewChild('chatScroll') chatScroll!: ElementRef;

  private pollHandle?: ReturnType<typeof setInterval>;
  private querySub?: Subscription;

  /** Al volver a la pestaña, un tick inmediato evita datos muy viejos mientras el polling estaba en pausa. */
  private readonly onVisibilidad = () => {
    if (typeof document === 'undefined' || document.hidden) return;
    this.refrescarSalaSiActiva();
  };

  constructor(
    private salasService: SalasService,
    public auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  get hostId(): string {
    return this.auth.currentUser()?._id ?? '';
  }

  get miNick(): string {
    return this.auth.currentUser()?.nick ?? 'Jugador';
  }

  ngOnInit() {
    if (!this.hostId) {
      this.error.set('Inicia sesión para usar las salas');
      this.cargando.set(false);
      return;
    }
    this.cargarSalas();
    this.cargarVideojuegos();
    this.pollHandle = setInterval(() => this.refrescarSalaSiActiva(), 3000);
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this.onVisibilidad);
    }

    this.querySub = this.route.queryParamMap.subscribe((pm) => {
      const raw = pm.get('videojuego');
      const valid =
        raw && /^[a-f\d]{24}$/i.test(raw) ? raw : null;
      this.filtroVideojuegoId.set(valid);

      const crear = pm.get('crear');
      if (crear === '1' || crear === 'true') {
        this.vistaPrincipal.set('crear');
        this.error.set(null);
        if (valid) this.nuevaSalaVideojuegoId = valid;
      }
    });
  }

  ngOnDestroy() {
    this.querySub?.unsubscribe();
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.onVisibilidad);
    }
    if (this.pollHandle) clearInterval(this.pollHandle);
  }

  /** ObjectId o documento poblado */
  idRef(r: string | { _id: string }): string {
    return typeof r === 'string' ? r : r._id;
  }

  nickRef(r: string | SalaUsuarioRef): string {
    if (typeof r === 'string') {
      if (r === this.hostId) return this.miNick;
      return /^[a-f\d]{24}$/i.test(r) ? '—' : r;
    }
    return r.nick?.trim() ? r.nick : r._id;
  }

  /** Nick en el contexto de una sala (API devuelve {_id, nick} por usuario). */
  nickEnSala(sala: Sala, userId: string): string {
    if (!userId) return '—';
    const row = sala.usuarios.find((u) => this.idRef(u) === userId);
    if (row && typeof row === 'object' && row !== null && 'nick' in row) {
      const n = String((row as SalaUsuarioRef).nick ?? '').trim();
      if (n) return n;
    }
    if (this.idRef(sala.host) === userId) {
      const h = sala.host;
      if (typeof h === 'object' && h !== null && 'nick' in h) {
        const hn = String((h as SalaUsuarioRef).nick ?? '').trim();
        if (hn) return hn;
      }
    }
    if (userId === this.hostId) return this.miNick;
    return '—';
  }

  /** Id del videojuego asociado a la sala (para cruzar con el catálogo). */
  idVideojuego(sala: Sala): string {
    const v = sala.videojuego;
    if (typeof v === 'string') return v;
    return v?._id ?? '';
  }

  private catalogoJuegoPorId(id: string): Videojuego | undefined {
    if (!id) return undefined;
    return this.videojuegos().find((j) => j._id === id);
  }

  tituloFiltroJuegoActivo(): string {
    const id = this.filtroVideojuegoId();
    if (!id) return '';
    return this.catalogoJuegoPorId(id)?.titulo ?? this.tituloPorIdDesdeSalas(id);
  }

  /** Si el catálogo aún no tiene el juego, intenta título desde alguna sala */
  private tituloPorIdDesdeSalas(id: string): string {
    const sala = this.salas().find((s) => this.idVideojuego(s) === id);
    return sala ? this.tituloJuego(sala) : '—';
  }

  limpiarFiltroJuego() {
    this.filtroVideojuegoId.set(null);
    this.filtroBusqueda.set('');
    this.router.navigate(['/salas'], { queryParams: {} });
  }

  tituloJuego(sala: Sala): string {
    const id = this.idVideojuego(sala);
    const cat = this.catalogoJuegoPorId(id);
    if (cat?.titulo) return cat.titulo;

    const v = sala.videojuego;
    if (typeof v === 'object' && v?.titulo && String(v.titulo).trim() !== '') {
      return String(v.titulo);
    }
    if (typeof v === 'string' && v && !/^[a-f\d]{24}$/i.test(v)) return v;
    return id ? '—' : '—';
  }

  /** URL absoluta de la carátula o null si no hay imagen. */
  urlImagenVideojuego(sala: Sala): string | null {
    const id = this.idVideojuego(sala);
    const cat = this.catalogoJuegoPorId(id);
    const v = sala.videojuego;
    const raw =
      (cat?.imagen && String(cat.imagen).trim()) ||
      (typeof v === 'object' && v?.imagen ? String(v.imagen).trim() : '');
    if (!raw) return null;
    if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
    const path = raw.startsWith('/') ? raw : `/${raw}`;
    return `${API_ORIGIN}${path}`;
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
      },
    });
  }

  refrescarSalaSiActiva() {
    if (typeof document !== 'undefined' && document.hidden) return;
    if (this.vistaPrincipal() !== 'sala') return;
    const s = this.salaActiva();
    if (!s?._id) return;

    this.salasService.getSalaById(s._id).subscribe({
      next: (up) => {
        if (this.salaActiva()?._id === up._id) {
          this.salaActiva.set(up);
        }
      },
      error: () => {
        this.mensajes.set([]);
        this.volverAlListado();
        this.cargarSalas();
      },
    });
  }

  cargarVideojuegos() {
    this.salasService.getVideojuegos().subscribe({
      next: (data) => this.videojuegos.set(data),
      error: (err) => console.error('Error cargando videojuegos', err),
    });
  }

  irAExplorar() {
    this.vistaPrincipal.set('listado');
    const vj = this.filtroVideojuegoId();
    this.router.navigate(['/salas'], {
      queryParams: vj ? { videojuego: vj } : {},
    });
  }

  irACrear() {
    this.vistaPrincipal.set('crear');
    this.error.set(null);
    const vj = this.filtroVideojuegoId();
    this.router.navigate(['/salas'], {
      queryParams: {
        crear: '1',
        ...(vj ? { videojuego: vj } : {}),
      },
    });
  }

  irAMiSala() {
    const s = this.salaDondeEstoy();
    if (s) this.entrarEnSala(s);
  }

  crearSala() {
    if (!this.hostId) return;
    if (!this.nuevaSalaNombre || !this.nuevaSalaVideojuegoId) {
      this.error.set('Debes ingresar nombre y videojuego de la sala');
      return;
    }

    this.salasService
      .createSala({
        nombre: this.nuevaSalaNombre,
        videojuego: this.nuevaSalaVideojuegoId,
        host: this.hostId,
        maxUsuarios: this.nuevaSalaMaxUsuarios,
      })
      .subscribe({
        next: (sala) => {
          this.nuevaSalaNombre = '';
          this.nuevaSalaVideojuegoId = '';
          this.error.set(null);
          this.cargarSalas();
          this.entrarEnSala(sala);
        },
        error: (err) => {
          this.error.set('Error al crear la sala');
          console.error(err);
        },
      });
  }

  unirseSala(sala: Sala) {
    if (!this.hostId) return;
    this.salasService.joinSala(sala._id, this.hostId).subscribe({
      next: (salaActualizada) => {
        this.entrarEnSala(salaActualizada);
        this.cargarSalas();
      },
      error: (err) => {
        this.error.set(
          err.error?.message || err.error?.error || 'Error al unirse a la sala'
        );
        console.error(err);
      },
    });
  }

  salirSala(sala: Sala) {
    if (!this.hostId) return;
    this.salasService.leaveSala(sala._id, this.hostId).subscribe({
      next: () => {
        this.cargarSalas();
        if (this.vistaPrincipal() === 'sala') {
          this.volverAlListado();
        }
      },
      error: (err) => {
        this.error.set(
          err.error?.message || err.error?.error || 'Error al salir de la sala'
        );
        console.error(err);
      },
    });
  }

  eliminarSala(sala: Sala) {
    const confirmacion = confirm(
      `¿Seguro que quieres eliminar la sala "${sala.nombre}"?`
    );
    if (!confirmacion) return;

    this.salasService.deleteSala(sala._id).subscribe({
      next: () => {
        if (this.salaActiva()?._id === sala._id) {
          this.mensajes.set([]);
          this.volverAlListado();
        }
        this.cargarSalas();
      },
      error: (err) => {
        this.error.set(
          err.error?.message || err.error?.error || 'Error al eliminar la sala'
        );
        console.error(err);
      },
    });
  }

  cambiarEstadoSala(sala: Sala, estado: Sala['estado']) {
    this.salasService.updateEstadoSala(sala._id, estado).subscribe({
      next: (actualizada) => {
        this.error.set(null);
        if (this.salaActiva()?._id === actualizada._id) {
          this.salaActiva.set(actualizada);
        }
        this.cargarSalas();
      },
      error: (err) => {
        this.error.set(
          err.error?.message ||
            err.error?.error ||
            err.message ||
            'Error al actualizar estado'
        );
        console.error(err);
      },
    });
  }

  puedeExpulsar(sala: Sala, jugador: string | SalaUsuarioRef): boolean {
    if (!this.esHost(sala)) return false;
    const pid = this.idRef(jugador);
    return pid !== this.idRef(sala.host) && pid !== this.hostId;
  }

  expulsarJugador(sala: Sala, jugador: string | SalaUsuarioRef) {
    const pid = this.idRef(jugador);
    const nick = this.nickEnSala(sala, pid);
    if (!confirm(`¿Expulsar a ${nick} de la sala?`)) return;

    this.salasService.kickUsuario(sala._id, pid).subscribe({
      next: () => {
        this.error.set(null);
        window.location.reload();
      },
      error: (err) => {
        this.error.set(
          err.error?.message ||
            err.error?.error ||
            'Error al expulsar al jugador'
        );
        console.error(err);
      },
    });
  }

  esUsuarioEnSala(sala: Sala): boolean {
    return sala.usuarios.some((u) => this.idRef(u) === this.hostId);
  }

  esHost(sala: Sala): boolean {
    return this.idRef(sala.host) === this.hostId;
  }

  estaEnAlgunaSala(): boolean {
    return this.salas().some((sala) =>
      sala.usuarios.some((u) => this.idRef(u) === this.hostId)
    );
  }

  salaDondeEstoy(): Sala | null {
    return (
      this.salas().find((s) =>
        s.usuarios.some((u) => this.idRef(u) === this.hostId)
      ) ?? null
    );
  }

  entrarEnSala(sala: Sala) {
    this.salaActiva.set(sala);
    this.vistaPrincipal.set('sala');
  }

  volverAlListado() {
    this.salaActiva.set(null);
    this.vistaPrincipal.set('listado');
    const vj = this.filtroVideojuegoId();
    this.router.navigate(['/salas'], {
      queryParams: vj ? { videojuego: vj } : {},
    });
  }

  get salasFiltradas(): Sala[] {
    let list = this.salas();
    const vid = this.filtroVideojuegoId();
    if (vid) {
      list = list.filter((s) => this.idVideojuego(s) === vid);
    }
    const q = this.filtroBusqueda().trim().toLowerCase();
    if (!q) return list;
    return list.filter((sala) => {
      const nombreOk = sala.nombre.toLowerCase().includes(q);
      const juegoOk = this.tituloJuego(sala).toLowerCase().includes(q);
      return nombreOk || juegoOk;
    });
  }

  esUsuarioActual(userId: string): boolean {
    return userId === this.hostId;
  }

  enviarMensaje() {
    if (!this.nuevoMensaje.trim() || !this.hostId) return;

    const mensaje: MensajeLocal = {
      id: crypto.randomUUID(),
      emisorId: this.hostId,
      emisorNick: this.miNick,
      contenido: this.nuevoMensaje.trim(),
      fecha: new Date(),
    };

    this.mensajes.update((m) => [...m, mensaje]);
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
