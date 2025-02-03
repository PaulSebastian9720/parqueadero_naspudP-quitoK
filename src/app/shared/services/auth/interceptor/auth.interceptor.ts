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

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Interceptor activado para:', req.url);
    return this.authService.getToken().pipe(
      switchMap((token) => {
        console.log('Token obtenido:', token);
        if (token?.token) {
          const cloned = req.clone({
            headers: req.headers.set("Authorization", `${token.tokenType || "Bearer "}${token.token}`)
          });
          return next.handle(cloned);
        }
        return next.handle(req);
      })
      ,
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }
}
