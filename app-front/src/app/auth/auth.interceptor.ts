import {
  HttpRequest,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

function esRutaAuthPublica(url: string): boolean {
  const u = url.toLowerCase();
  return u.includes('/auth/login') || u.includes('/auth/register');
}

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const token = auth.getToken();
  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (
        err.status === 401 &&
        !esRutaAuthPublica(req.url) &&
        auth.isLoggedIn()
      ) {
        auth.logout();
        void router.navigateByUrl('/');
      }
      return throwError(() => err);
    })
  );
};
