import { Routes } from '@angular/router';
import { LoginRegisterComponent } from './auth/login-register.component';
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


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginRegisterComponent, data: { mode: 'login' } },
  { path: 'register', component: LoginRegisterComponent, data: { mode: 'register' } },
  { path: 'salas', component: SalasComponent },
  { path: 'perfil', component: PerfilRedirectComponent },
  { path: 'usuarios', component: ListaUsuariosComponent },
  { path: 'usuarios/:id', component: PerfilComponent },
  { path: 'usuarios/:id/editar', component: EditarPerfilComponent },
  { path: 'chats', component: ListaChatsComponent },
  { path: 'chats/:id', component: ChatComponent },
  { path: 'videojuegos', component: VideojuegosDashboardComponent },
  { path: 'videojuegos/:id', component: VideojuegoDetalleComponent }
]
