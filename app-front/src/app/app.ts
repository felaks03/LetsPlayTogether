import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SalasComponent } from './salas/salas.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SalasComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('app-front');
}
