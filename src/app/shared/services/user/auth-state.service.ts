import { Injectable, OnInit } from "@angular/core"
import { Auth, authState, signOut, User } from "@angular/fire/auth"
import { BehaviorSubject, map, Observable } from 'rxjs'
import { UserfbService } from "./userfb.service"

/** 
 * Servicio para gestionar el estado de autenticación y los roles del usuario.
 * 
 * Este servicio mantiene y emite el estado de si un usuario está autenticado, así como si tiene rol de administrador.
 * Utiliza `BehaviorSubject` para almacenar y emitir los estados de autenticación y rol, lo que permite que otros componentes
 * se suscriban y reaccionen a esos cambios en tiempo real.
 * 
 * Métodos:
 * - `initializeAuthState`: Inicializa el estado de autenticación.
 * - `initializeAdminState`: Inicializa el estado del rol de administrador.
 * - `logOut`: Cierra la sesión del usuario.
 * - `credentialUserUID`: Obtiene el UID del usuario autenticado.
 */
@Injectable({
    providedIn: 'root'
})
export class AuthStateService implements OnInit {
    private authStateSubject = new BehaviorSubject<boolean>(false);
    private isAdminSubject = new BehaviorSubject<boolean>(false);

    constructor(
        private auth: Auth,
        private userService: UserfbService
    ) {}

    /** 
     * Inicializa el servicio de autenticación y rol al suscribirse a los cambios de estado.
     */
    ngOnInit(): void {
        this.initializeAuthState();
        this.initializeAdminState();
    }

    /** 
     * Inicializa el estado de autenticación y emite el estado correspondiente.
     */
    private initializeAuthState(): void {
        authState(this.auth).pipe(
            map((user: User | null) => !!user)
        ).subscribe((isAuthenticated: boolean) => {
            this.authStateSubject.next(isAuthenticated);
        });
    }

    /** 
     * Inicializa el estado del rol del usuario, verificando si tiene rol de administrador.
     */
    private initializeAdminState(): void {
        authState(this.auth).subscribe((user: User | null) => {
            if (user) {
                this.userService.getUser(user.uid).then(userData => {
                    const isAdmin = userData?.rol === 'A';
                    this.isAdminSubject.next(isAdmin);
                }).catch(() => {
                    this.isAdminSubject.next(false);
                });
            } else {
                this.isAdminSubject.next(false);
            }
        });
    }

    /** 
     * Obtiene un observable con el estado de autenticación del usuario.
     * 
     * @returns {Observable<boolean>} El estado de autenticación del usuario.
     */
    get authState$(): Observable<boolean> {
        return authState(this.auth);
    }

    /** 
     * Obtiene un observable con el estado del rol de administrador.
     * 
     * @returns {Observable<boolean>} El estado del rol de administrador del usuario.
     */
    get isAdmin$(): Observable<boolean> {
        return this.isAdminSubject.asObservable();
    }

    /** 
     * Cierra la sesión del usuario y restablece los estados de autenticación y rol.
     * 
     * @returns {Promise<void>} Una promesa que indica que la sesión se ha cerrado correctamente.
     */
    logOut() {
        return signOut(this.auth).then(() => {
            this.authStateSubject.next(false);
            this.isAdminSubject.next(false);
        });
    }

    /** 
     * Obtiene el UID del usuario autenticado.
     * 
     * @returns {string | null} El UID del usuario o `null` si no hay usuario autenticado.
     */
    get credentialUserUID(): string | null {
        const user = this.auth.currentUser;
        return user ? user.uid : null;
    }
}
