import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Sala {
  _id: string;
  nombre: string;
  estado: 'OPEN' | 'IN_GAME' | 'FULL' | 'CLOSED';
  videojuego: string;
  host: string;
  usuarios: string[];
  maxUsuarios: number;
  creadoEn: string;
  expiraEn?: string;
}

export interface Videojuego {
  _id: string;
  titulo: string;
  genero?: string;
  plataformas: string[];
}


@Injectable({
  providedIn: 'root',
})
export class SalasService {
  private apiUrl = 'http://localhost:3000/api/salas';

  constructor(private http: HttpClient) {}

  getSalas(): Observable<Sala[]> {
    return this.http.get<Sala[]>(this.apiUrl);
  }

  getSalaById(id: string): Observable<Sala> {
    return this.http.get<Sala>(`${this.apiUrl}/${id}`);
  }

  createSala(sala: Partial<Sala>): Observable<Sala> {
    return this.http.post<Sala>(this.apiUrl, sala);
  }

  joinSala(salaId: string, userId: string): Observable<Sala> {
    return this.http.post<Sala>(`${this.apiUrl}/join`, { salaId, userId });
  }

  leaveSala(salaId: string, userId: string): Observable<Sala> {
    return this.http.post<Sala>(`${this.apiUrl}/leave`, { salaId, userId });
  }

  updateEstadoSala(salaId: string, estado: Sala['estado']): Observable<Sala> {
    return this.http.patch<Sala>(`${this.apiUrl}/estado`, { salaId, estado });
  }

  deleteSala(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getVideojuegos() {
    return this.http.get<Videojuego[]>(
      'http://localhost:3000/api/videojuegos'
    );
  }

}
