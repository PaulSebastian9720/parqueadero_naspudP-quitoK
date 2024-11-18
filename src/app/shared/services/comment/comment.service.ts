import { Injectable } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, Firestore, getDoc, getDocs, setDoc } from "@angular/fire/firestore";
import { CommentData, CommentFB } from '../../../core/models/comment';


@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private fireStore: Firestore) { }

  async createComment(commentFB:CommentFB) {
    return addDoc(
      collection(this.fireStore, "comments"),
      Object.assign({}, commentFB)
    )
  }

  async getComment(id: string): Promise<CommentFB | undefined> {
    return getDoc(doc(this.fireStore, `comments/${id}`)).then(doc => {
      return doc.data() as CommentFB
    })
  }

  async getListComment(): Promise<CommentData[]> {
    const snapshot = await getDocs(collection(this.fireStore, `comments`))
    return snapshot.docs.map(doc => {
      return new CommentData(doc.id, doc.data() as CommentFB)
    })
  }

}
