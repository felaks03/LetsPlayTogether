import { Routes } from '@angular/router';
import { VideojuegosDashboardComponent } from './videojuegos-dashboard/videojuegos-dashboard.component';
import { VideojuegoDetalleComponent } from './videojuego-detalle/videojuego-detalle.component';
import { SalasComponent } from './salas/salas.component';

export const routes: Routes = [
  { path: '', component: SalasComponent },
  { path: 'videojuegos', component: VideojuegosDashboardComponent },
  { path: 'videojuegos/:id', component: VideojuegoDetalleComponent },
];
