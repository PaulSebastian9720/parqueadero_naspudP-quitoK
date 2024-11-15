import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { UserFB } from '../../../core/models/user'

@Injectable({
  providedIn: 'root'
})
export class UserCacheService {

  private storageKey = 'cachedUser'
  private userSubject = new BehaviorSubject<UserFB | null>(null) 

  constructor() {
    const userJson = localStorage.getItem(this.storageKey)
    if (userJson) {
      const userObject = JSON.parse(userJson);
      this.userSubject.next(userObject as UserFB)
    }
  }

  setUser(user: UserFB): void {
    localStorage.setItem(this.storageKey, JSON.stringify(user))
    this.userSubject.next(user)
  }

  getUser(): Observable<UserFB | null> {
    return this.userSubject.asObservable()
  }

  removeUser(): void {
    localStorage.removeItem(this.storageKey)
    this.userSubject.next(null)
  }
}
