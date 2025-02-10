import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    if (token) {
      const cloned = req.clone({
        headers: req.headers.set(
          'Authorization',
          `${token.tokenType || 'Bearer '}${token.token}`
        ),
      });
      return next.handle(cloned);
    } else {
      return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.warn('Token expirado, intentando renovar...');
          throw new Error(error.message)
        } else if (error.status >= 500) {
          console.error('Error del servidor:', error);
          throw new Error(error.message)
        } else if (error.status === 0) {
          console.warn('Error de conexión. Verifica tu red.');
          throw new Error(error.message)
        }
        return throwError(() => error);
      })
    );
    }
  }
}
