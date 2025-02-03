import { Injectable, OnInit } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { UserFB } from '../../../core/models/user'
import { User } from '../../../core/interfaces/person';


/** 
 * Servicio para gestionar el almacenamiento en caché del usuario en el navegador.
 * 
 * Esta clase maneja el almacenamiento local del usuario en el navegador y mantiene un flujo reactivo del estado del usuario.
 * Utiliza `BehaviorSubject` para almacenar y emitir el estado actual del usuario, lo que permite que otros componentes
 * se suscriban y reaccionen a los cambios en el estado del usuario en tiempo real.
 * 
 * Métodos:
 * - `setUser`: Guarda un usuario en el almacenamiento local y emite el nuevo estado del usuario.
 * - `getUser`: Obtiene un observable del estado del usuario actual.
 * - `removeUser`: Elimina al usuario del almacenamiento local y emite un estado de `null`.
 */
@Injectable({
  providedIn: 'root'
})
export class UserCurrentService implements OnInit {

  private storageKey = 'cachedUser';
  private userSubject = new BehaviorSubject<User | null>(null); 

  /** 
   * Constructor que intenta cargar un usuario desde el almacenamiento local y lo emite si existe.
   */
  constructor() {
    
  }
  ngOnInit(): void {
    const userJson = localStorage.getItem(this.storageKey);
    if (userJson) {
      const userObject = JSON.parse(userJson);
      this.userSubject.next(userObject as User);
    }
  }

  /** 
   * Guarda un usuario en el almacenamiento local y emite el nuevo estado del usuario.
   * 
   * @param {UserFB} user El usuario a guardar en el almacenamiento.
   */
  setUser(user: User): void {
    localStorage.setItem(this.storageKey, JSON.stringify(user));
    this.userSubject.next(user);
  }

  /** 
   * Obtiene un observable del estado actual del usuario.
   * 
   * @returns {Observable<UserFB | null>} El estado actual del usuario.
   */
  getUser(): Observable<User | null> {
    return this.userSubject.asObservable();
  }

  /** 
   * Elimina al usuario del almacenamiento local y emite un estado de `null`.
   */
  removeUser(): void {
    localStorage.removeItem(this.storageKey);
    this.userSubject.next(null);
  }
}
