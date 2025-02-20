import { Injectable, OnInit } from "@angular/core";
import { Jwt } from "../../../../core/interfaces/auth/jwr";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class JwtService {
    private JWT_KEY = "_jwt";

    setToken(jwtUserCurrent: string){
        localStorage.setItem(
            this.JWT_KEY,
            JSON.stringify(
                jwtUserCurrent
            )
        )
    }

    getToken(): string  {
        return localStorage.getItem(this.JWT_KEY) ?? ''
    }

    removeToken(){
        localStorage.removeItem(this.JWT_KEY);
    }

    
}