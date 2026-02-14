import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Videojuego {
  _id: string;
  titulo: string;
  descripcion?: string;
  imagen?: string;
  genero?: string;
  desarrollador?: string;
  fechaLanzamiento?: string;
  plataformas: string[];
  puntuacion?: number;
  multijugador: boolean;
  creadoEn: string;
}

@Injectable({
  providedIn: 'root',
})
export class VideojuegosService {
  private apiUrl = 'http://localhost:3000/api/videojuegos';

  constructor(private http: HttpClient) {}

  obtenerVideojuegos(): Observable<Videojuego[]> {
    return this.http.get<Videojuego[]>(this.apiUrl);
  }

  obtenerVideojuegoPorId(id: string): Observable<Videojuego> {
    return this.http.get<Videojuego>(`${this.apiUrl}/${id}`);
  }

  crearVideojuego(data: Partial<Videojuego>): Observable<Videojuego> {
    return this.http.post<Videojuego>(this.apiUrl, data);
  }

  actualizarVideojuego(id: string, data: Partial<Videojuego>): Observable<Videojuego> {
    return this.http.put<Videojuego>(`${this.apiUrl}/${id}`, data);
  }

  eliminarVideojuego(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
