import { Injectable, OnInit } from "@angular/core";
import { Jwt } from "../../../../core/interfaces/auth/jwr";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class JwtService implements OnInit {
    private JWT_KEY = "_jwt";
    private jwtSubject = new BehaviorSubject<Jwt|null>(null)

    ngOnInit(): void {
        const jwtJson = localStorage.getItem(this.JWT_KEY);
        console.log(jwtJson)
        if(jwtJson){
            this.jwtSubject.next( 
                JSON.parse(jwtJson) as Jwt
            );
        }
    }

    setToken(jwtUserCurrent: Jwt){
        console.log(jwtUserCurrent)
        localStorage.setItem(
            this.JWT_KEY,
            JSON.stringify(
                jwtUserCurrent
            )
        )
        console.log(localStorage.getItem(this.JWT_KEY));
        this.jwtSubject.next(jwtUserCurrent);
    }

    getToken(): Observable<Jwt | null> {
        return this.jwtSubject.asObservable();
    }

    removeToken(){
        localStorage.removeItem(this.JWT_KEY);
        this.jwtSubject.next(null);
    }

    
}