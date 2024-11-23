import { Injectable, OnInit } from "@angular/core"
import { Auth, authState, signOut, User } from "@angular/fire/auth"
import { BehaviorSubject, map, Observable } from 'rxjs'
import { UserfbService } from "./userfb.service"

@Injectable({
    providedIn: 'root'
})
export class AuthStateService implements OnInit {
    private authStateSubject = new BehaviorSubject<boolean>(false)
    private isAdminSubject = new BehaviorSubject<boolean>(false)

    constructor(
        private auth: Auth,
        private userService: UserfbService
    ) {}

    ngOnInit(): void {
        this.initializeAuthState();
        this.initializeAdminState()
    }

    private initializeAuthState(): void {
        authState(this.auth).pipe(
            map((user: User | null) => !!user)
        ).subscribe((isAuthenticated: boolean) => {
            this.authStateSubject.next(isAuthenticated)
        })
    }

    private initializeAdminState(): void {
        authState(this.auth).subscribe((user: User | null) => {
            if (user) {
                this.userService.getUser(user.uid).then(userData => {
                    const isAdmin = userData?.rol === 'A' 
                    this.isAdminSubject.next(isAdmin)
                }).catch(() => {
                    this.isAdminSubject.next(false) 
                })
            } else {
                this.isAdminSubject.next(false)
            }
        })
    }

    get authState$() : Observable<boolean> {
        return authState(this.auth)
    }

    get isAdmin$(): Observable<boolean> {

        return this.isAdminSubject.asObservable() 
    }

    logOut() {
        return signOut(this.auth).then(() => {
            this.authStateSubject.next(false)
            this.isAdminSubject.next(false) 
        })
    }

    get credentialUserUID(): string | null {
        const user = this.auth.currentUser
        return user ? user.uid : null
    }
}