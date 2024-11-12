import { Injectable } from "@angular/core";
import { doc, Firestore, getDoc, setDoc } from "@angular/fire/firestore";
import { ClientFB } from "../../../core/models/client";

@Injectable({
    providedIn: "root"
})
export class ClientFBService {
    constructor(private firestore: Firestore) { }

    async createClient(clientId: string, clientFB: ClientFB){
        return setDoc(doc(this.firestore, `client/${clientId}`), clientFB)
    }

    async clientExists(clientId: string){
        return getDoc(doc(this.firestore, `client/${clientId}`))
            .then((snapShot) => snapShot.exists())
    }

    async getClient(clientId: string): Promise<ClientFB | null>{
        return getDoc(doc(this.firestore, `client/${clientId}`))
           .then((snapShot) => snapShot.data() as ClientFB) || null
    }

    async updateClient(clientId: string, updatedClient: Partial<ClientFB>){
        return setDoc(doc(this.firestore, `client/${clientId}`), updatedClient, {merge: true})
    }
                        
}
