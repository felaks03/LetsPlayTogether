import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { convertToParamMap } from '@angular/router';

import { SalasComponent } from './salas.component';
import { SalasService } from './salas.service';
import { AuthService } from '../auth/auth.service';

describe('Salas', () => {
  let component: SalasComponent;
  let fixture: ComponentFixture<SalasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalasComponent],
      providers: [
        {
          provide: SalasService,
          useValue: {
            getSalas: () => of([]),
            getVideojuegos: () => of([]),
          },
        },
        {
          provide: AuthService,
          useValue: {
            currentUser: () => ({ _id: 'testid', nick: 'Tester' }),
          },
        },
        {
          provide: Router,
          useValue: { navigate: jasmine.createSpy('navigate') },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: of(convertToParamMap({})),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SalasComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
