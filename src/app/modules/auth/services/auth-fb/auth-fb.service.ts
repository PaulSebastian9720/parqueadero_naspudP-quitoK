import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from '@angular/fire/auth';
import { IUser } from '../../utils/interfaceRegisterFom';

@Injectable({
  providedIn: 'root'
})

export class AuthFbService {

  constructor(private auth : Auth) { }

  createAccount(user : IUser){
    return createUserWithEmailAndPassword(
      this.auth,
      user.correo,
      user.password
    )
  } 

  signIn(user: IUser) {
    return signInWithEmailAndPassword(
      this.auth,
      user.correo,
      user.password,
    )
  }

  signInWithGoogle(){
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({prompt : 'select_account'})
    return signInWithPopup(this.auth, provider)
  }
}
