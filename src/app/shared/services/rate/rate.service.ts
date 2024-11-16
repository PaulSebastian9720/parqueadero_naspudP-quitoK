import { Injectable } from "@angular/core";
import { addDoc, collection, doc, Firestore, getDoc, getDocs, setDoc } from "@angular/fire/firestore";
import { RateData, RateFB } from "../../../core/models/rate";

@Injectable({
    providedIn: "root"
})
export class RateService {
    constructor (private fireStore: Firestore){}
    
    async createRate( ratefb:RateFB){
        return addDoc(
            collection(this.fireStore, "rates"),
            Object.assign({} ,ratefb)
        )
    }

    async getRate(id: string): Promise<RateFB | undefined> {
        return  getDoc(doc(this.fireStore, `rates/${id}`)).then( doc => {
            return doc.data() as RateFB
        })
    }

    async getListRate(): Promise<RateData[]> {
        const snapshot = await getDocs(collection(this.fireStore, `rates`))
        return snapshot.docs.map(doc => {
            return new RateData(doc.id, doc.data() as RateFB)
        })
    }

    async updateRate(id: string, ratefb: Partial<RateFB>){
        const rateDoc = doc(this.fireStore, `rates/${id}`)
        return setDoc(rateDoc, Object.assign({},ratefb), {merge: true})
    }
}
