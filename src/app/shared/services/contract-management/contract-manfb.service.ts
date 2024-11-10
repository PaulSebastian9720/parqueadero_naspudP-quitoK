import { Injectable } from "@angular/core";
import { doc, Firestore, setDoc } from "@angular/fire/firestore";
import { ManagementFB } from "../../../core/models/management";

@Injectable ({
    providedIn : 'root'
})
export class ContractManFBService {
    constructor(private fireStore: Firestore){}

    async createContract(id: string, managenteFB : ManagementFB) {
        return setDoc(doc(this.fireStore, `contract-m/${id}`), managenteFB.toJson())
    }
}