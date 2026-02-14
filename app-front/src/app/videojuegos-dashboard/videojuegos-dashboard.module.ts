import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VideojuegosDashboardComponent } from './videojuegos-dashboard.component';
import { VideojuegoCardComponent } from './videojuego-card/videojuego-card.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, FormsModule, VideojuegosDashboardComponent, VideojuegoCardComponent],
  exports: [VideojuegosDashboardComponent],
})
export class VideojuegosDashboardModule {}
