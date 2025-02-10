import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Jwt } from '../../../../core/interfaces/auth/jwr';
import { JwtService } from '../jwt/jwt.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../../config/enviorement';
import { Credential } from '../../../../core/interfaces/auth/credential';
import { AuthResponse } from '../../../../core/interfaces/auth/authResponse';
import { AuthRequest } from '../../../../core/interfaces/auth/registerRequest';

@Injectable({
  providedIn: 'root',
})
export class AuthService  {
  private API_ENDPOINT_AUTH = `${environment.apiUrl}/auth`;
  private _isAuthenticated = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private jwt: JwtService) {
    this._isAuthenticated.next(!!this.jwt.getToken());
  }

  signUp(register: AuthRequest): Observable<AuthResponse | null> {
    return this.http.post(
      `${this.API_ENDPOINT_AUTH}/sign-up`,
      register
    ) as Observable<AuthResponse | null>;
  }

  signIn(credentials : { credentials: Credential}): Observable<AuthResponse | null> {
    return this.http.post(
      `${this.API_ENDPOINT_AUTH}/sign-in`,
      credentials
    ) as Observable<AuthResponse | null>;
  }

  setToken(token: Jwt) {
    this.jwt.setToken(token);
    this._isAuthenticated.next(true);
  }

  getToken(): Jwt | null {
    return this.jwt.getToken();
  }

  logout() {
    this.jwt.removeToken();
    this._isAuthenticated.next(false);
  }

  get isAuthenticated(): Observable<boolean> {
    return this._isAuthenticated.asObservable();
  }
}
