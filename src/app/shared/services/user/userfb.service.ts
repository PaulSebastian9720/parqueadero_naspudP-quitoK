import { Injectable } from '@angular/core'
import { Firestore, doc, setDoc, getDoc, snapToData, collection, getDocs } from '@angular/fire/firestore'
import { UserData, UserFB } from '../../../core/models/user'


@Injectable({
  providedIn: 'root'
})

export class UserfbService {
  constructor(private fireStore: Firestore) {}

  async createUserInFirestore( uid: string ,user: UserFB) {    
    return setDoc(doc(this.fireStore, `users/${uid}`), user)
  }

  async userExists(uid : string) : Promise<boolean>{
    return  getDoc(doc(this.fireStore, `users/${uid}`)).then((snapshot) => {
      return snapshot.exists()
    })
  }

  async updateUser(uid: string, updatedData: Partial<UserFB>) {
    const userDoc = doc(this.fireStore, `users/${uid}`)
    return setDoc(userDoc, updatedData, { merge: true })
  }

  async getUser(uid: string): Promise<UserFB | null> {
    const userDocRef = doc(this.fireStore, `users/${uid}`)
    const userSnapshot = await getDoc(userDocRef)

    return userSnapshot.exists() ? userSnapshot.data() as UserFB : null

  }

  async getListUsers(): Promise<UserData[]> {
    const usersRef = collection(this.fireStore, 'users')
    const usersSnap = await getDocs(usersRef)
    return usersSnap.docs.map(doc => {
        return new UserData(doc.id, doc.data() as UserFB)
    });
  }

}
