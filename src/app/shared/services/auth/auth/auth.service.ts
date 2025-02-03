import { HttpClient } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";
import { Jwt } from "../../../../core/interfaces/auth/jwr";
import { JwtService } from "../jwt/jwt.service";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "../../../../../config/enviroment";
import { Credential } from "../../../../core/interfaces/auth/credential"; 
import { AuthResponse } from "../../../../core/interfaces/auth/authResponse";
import { AuthRequest } from "../../../../core/interfaces/auth/registerRequest";

@Injectable({
    providedIn: "root"
})
export class AuthService implements OnInit {
    private API_ENDPOINT_AUTH = `${environment.apiUrl}/auth`;
    private _isAuthenticated = new BehaviorSubject<boolean>(false);

    constructor(private http :HttpClient, private jwt : JwtService) {}
    ngOnInit(): void {
        this.jwt.getToken().subscribe(token => {
            console.log(token)
            if(token){
                this._isAuthenticated.next(true);
            }
        });
    }
    
    signUp(register: AuthRequest): Observable<AuthResponse|null>{
        return this.http.post(
            `${this.API_ENDPOINT_AUTH}/sign-up`,
            register
        ) as Observable<AuthResponse | null>;
    }

    signIn(credentials: Credential): Observable<AuthResponse|null> {
        return this.http.post(
            `${this.API_ENDPOINT_AUTH}/sign-in`, 
            credentials
        ) as Observable<AuthResponse | null>;
    }

    setToken(token :Jwt){
        this.jwt.setToken(token);
        this._isAuthenticated.next(true);
    }

    getToken(): Observable<Jwt | null> {
        return this.jwt.getToken();
    }

    logout(){
        this.jwt.removeToken();
        this._isAuthenticated.next(false);
    }

    get isAuthenticated(): Observable<boolean> {
        return this._isAuthenticated.asObservable();;   
    }
}