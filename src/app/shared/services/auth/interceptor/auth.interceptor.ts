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
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    if (token) {
      const cleanedToken = token.replace(/['"]+/g, '');
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${cleanedToken}`,
        },
      });
      return next.handle(cloned);
    } else {
      this.authService.logout();
      return next.handle(req).pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error);
        })
      );
    }
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      console.error('Unauthorized access - redirecting to login');
      this.authService.logout();
    } else if (error.status === 403) {
      console.error(
        'Forbidden access - you do not have the necessary permissions'
      );
      this.router.navigate(['/']);
      this.authService.logout();
    } else if (error.status === 500) {
      console.error('Server error - please try again later');
    } else {
      console.error('Unexpected error occurred:', error.message);
    }
    return throwError(() => error);
  }
}
