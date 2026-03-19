import { Routes } from '@angular/router';
import { ListaUsuariosComponent } from './user/lista-usuarios.component';
import { PerfilComponent } from './user/perfil.component';
import { EditarPerfilComponent } from './user/editar-perfil.component';
import { ListaChatsComponent } from './chat/lista-chats.component';
import { ChatComponent } from './chat/chat.component';
import { SalasComponent } from './salas/salas.component';
import { HomeComponent } from './home/home.component';
import { PerfilRedirectComponent } from './perfil-redirect/perfil-redirect.component';
import { VideojuegosDashboardComponent } from './videojuegos-dashboard/videojuegos-dashboard.component';
import { VideojuegoDetalleComponent } from './videojuego-detalle/videojuego-detalle.component';
import { authGuard, guestGuard } from './auth/auth.guard';


export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [guestGuard] },
  { path: 'login', redirectTo: '', pathMatch: 'full' },
  { path: 'register', redirectTo: '', pathMatch: 'full' },
  { path: 'salas', component: SalasComponent, canActivate: [authGuard] },
  { path: 'perfil', component: PerfilRedirectComponent, canActivate: [authGuard] },
  { path: 'usuarios', component: ListaUsuariosComponent, canActivate: [authGuard] },
  { path: 'usuarios/:id', component: PerfilComponent, canActivate: [authGuard] },
  { path: 'usuarios/:id/editar', component: EditarPerfilComponent, canActivate: [authGuard] },
  { path: 'chats', component: ListaChatsComponent, canActivate: [authGuard] },
  { path: 'chats/:id', component: ChatComponent, canActivate: [authGuard] },
  { path: 'videojuegos', component: VideojuegosDashboardComponent, canActivate: [authGuard] },
  { path: 'videojuegos/:id', component: VideojuegoDetalleComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
