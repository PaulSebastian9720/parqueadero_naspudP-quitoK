import { Injectable } from "@angular/core";
import { collection, doc, Firestore, getDoc, getDocs, setDoc } from "@angular/fire/firestore";

import { WorkDayFB } from "../../../core/models/shedule";
@Injectable({
    providedIn: 'root'
  })

export class ScheduleFbService {
    constructor(private fireStore : Firestore){}

    async getDay(idDay : string): Promise<WorkDayFB>{
        return getDoc(doc(this.fireStore,`schedule/${idDay}`)).then((data) => {
            return data.data() as WorkDayFB
        })
    }

    async updateDay(idDay: string, updateDay: Partial<WorkDayFB>){
        return setDoc(doc(this.fireStore,`schedule/${idDay}`), updateDay)
    }

    async getListDay() : Promise<WorkDayFB[]>{
        const listDay = collection(this.fireStore,`schedule`)
        const listDaySnapshot = await getDocs(listDay)
        return listDaySnapshot.docs.map((doc) => {
            return  doc.data() as WorkDayFB
        }
    )
   }
}