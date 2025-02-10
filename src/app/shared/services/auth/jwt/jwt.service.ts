import { Injectable, OnInit } from "@angular/core";
import { Jwt } from "../../../../core/interfaces/auth/jwr";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class JwtService {
    private JWT_KEY = "_jwt";

    setToken(jwtUserCurrent: Jwt){
        console.log(jwtUserCurrent)
        localStorage.setItem(
            this.JWT_KEY,
            JSON.stringify(
                jwtUserCurrent
            )
        )
    }

    getToken():Jwt | null {
        return localStorage.getItem(this.JWT_KEY) as Jwt | null
    }

    removeToken(){
        localStorage.removeItem(this.JWT_KEY);
    }

    
}