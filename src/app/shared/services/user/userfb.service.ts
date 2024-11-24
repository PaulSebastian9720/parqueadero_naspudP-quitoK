import { Injectable } from '@angular/core'
import { Firestore, doc, setDoc, getDoc, snapToData, collection, getDocs, onSnapshot } from '@angular/fire/firestore'
import { UserData, UserFB } from '../../../core/models/user'
import { BehaviorSubject } from 'rxjs';


/** 
 * Servicio para gestionar los usuarios en Firestore.
 * 
 * Este servicio proporciona métodos para crear, obtener, actualizar y eliminar usuarios en Firestore, así como para escuchar
 * los cambios en los documentos de usuarios en tiempo real. Utiliza `BehaviorSubject` para mantener el estado actual del
 * usuario en una variable reactiva, lo que permite que otros componentes se suscriban y reaccionen a los cambios en tiempo real.
 * 
 * Métodos:
 * - `createUserInFirestore`: Crea un nuevo usuario en Firestore.
 * - `userExists`: Verifica si un usuario existe en Firestore.
 * - `updateUser`: Actualiza los datos de un usuario en Firestore.
 * - `getUser`: Obtiene un usuario desde Firestore.
 * - `getListUsers`: Obtiene una lista de todos los usuarios en Firestore.
 * - `listenToUserChanges`: Escucha los cambios en tiempo real de un usuario específico en Firestore.
 */
@Injectable({
  providedIn: 'root'
})
export class UserfbService {
  private userSubject = new BehaviorSubject<UserFB | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private fireStore: Firestore) {}

  /** 
   * Crea un nuevo usuario en Firestore.
   * 
   * @param {string} uid El UID del usuario.
   * @param {UserFB} user El objeto que contiene los datos del usuario.
   * @returns {Promise<void>} Una promesa que se resuelve cuando el usuario es creado en Firestore.
   */
  async createUserInFirestore(uid: string, user: UserFB) {    
    return setDoc(doc(this.fireStore, `users/${uid}`), user);
  }

  /** 
   * Verifica si un usuario existe en Firestore.
   * 
   * @param {string} uid El UID del usuario.
   * @returns {Promise<boolean>} Una promesa que indica si el usuario existe o no.
   */
  async userExists(uid: string): Promise<boolean> {
    return getDoc(doc(this.fireStore, `users/${uid}`)).then((snapshot) => {
      return snapshot.exists();
    });
  }

  /** 
   * Actualiza los datos de un usuario en Firestore.
   * 
   * @param {string} uid El UID del usuario.
   * @param {Partial<UserFB>} updatedData Los datos actualizados del usuario.
   * @returns {Promise<void>} Una promesa que se resuelve cuando los datos del usuario son actualizados en Firestore.
   */
  async updateUser(uid: string, updatedData: Partial<UserFB>) {
    const userDoc = doc(this.fireStore, `users/${uid}`);
    return setDoc(userDoc, updatedData, { merge: true });
  }

  /** 
   * Obtiene un usuario desde Firestore.
   * 
   * @param {string} uid El UID del usuario.
   * @returns {Promise<UserFB | null>} Una promesa que resuelve al usuario o `null` si no existe.
   */
  async getUser(uid: string): Promise<UserFB | null> {
    const userDocRef = doc(this.fireStore, `users/${uid}`);
    const userSnapshot = await getDoc(userDocRef);

    return userSnapshot.exists() ? userSnapshot.data() as UserFB : null;
  }

  /** 
   * Obtiene una lista de todos los usuarios en Firestore.
   * 
   * @returns {Promise<UserData[]>} Una promesa que resuelve a la lista de usuarios.
   */
  async getListUsers(): Promise<UserData[]> {
    const usersRef = collection(this.fireStore, 'users');
    const usersSnap = await getDocs(usersRef);
    return usersSnap.docs.map(doc => {
        return new UserData(doc.id, doc.data() as UserFB);
    });
  }

  /** 
   * Escucha los cambios en tiempo real de un usuario específico en Firestore.
   * 
   * @param {string} uid El UID del usuario a escuchar.
   */
  listenToUserChanges(uid: string) {
    const userDocRef = doc(this.fireStore, `users/${uid}`);
    onSnapshot(userDocRef, (snapshot) => {
      if (snapshot.exists()) {
        this.userSubject.next(snapshot.data() as UserFB); 
      } else {
        this.userSubject.next(null); 
      }
    });
  }
}
