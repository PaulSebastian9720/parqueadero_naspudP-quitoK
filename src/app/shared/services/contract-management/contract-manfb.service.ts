import { Injectable } from "@angular/core";
import { collection, doc, Firestore, getDoc, getDocs, setDoc, snapToData } from "@angular/fire/firestore";
import { ManagementData, ManagementFB } from "../../../core/models/management";

@Injectable ({
    providedIn : 'root'
})
export class ContractManFBService {
    constructor(private fireStore: Firestore){}

    async createContract(id: string, managenteFB : ManagementFB) {
        return setDoc(doc(this.fireStore, `contract-m/${id}`), Object.assign({}, managenteFB))
    }

    async getContract(id: string): Promise<ManagementFB | null> {
        return getDoc(doc(this.fireStore, `contract-m/${id}`))
        .then((snapShot) => {
            return snapShot.data() as ManagementFB}) || null
    }


    async updatoContract(id: string, updateManagementFb:Partial<ManagementFB | null>) {
        return setDoc(doc(this.fireStore, `contract-m/${id}`), updateManagementFb, {merge: true})
    }

    async getListManagement(): Promise<ManagementData []>{
        const getListManagement =  collection(this.fireStore,'contract-m')
        const managementSnapt = await getDocs(getListManagement)
        return managementSnapt.docs.map( doc => {
            return new ManagementData(doc.id, doc.data() as ManagementFB)
        })
    }

}