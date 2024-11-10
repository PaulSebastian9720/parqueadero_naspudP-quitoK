import { Injectable } from "@angular/core";
import { collection, doc, Firestore, getDocs, setDoc } from "@angular/fire/firestore";
import { SpaceData, SpaceFB } from "../../../core/models/space";

@Injectable(
    {
        providedIn: "root"
    }
)
export class ParkinLotService {
    constructor(private fireStore: Firestore) {}

    async getParkingLot() : Promise<SpaceData[][]>{
        let matrixSpaces : SpaceData[][] =[] 
        const rows = ["a", "b", "c", "d", "e", "f", "g"]
        for (let i = 0; i < rows.length; i++) {

            const rowRef = collection(this.fireStore, "parking-lot/row-"+ rows[i]+"/col")
            const rowSnap = await getDocs(rowRef)   
            const row =  rowSnap.docs.map( doc =>  {
                return new SpaceData(doc.id, SpaceFB.fromJSON(doc.data()) ) 
            })
            matrixSpaces.push(row)
        }

        return matrixSpaces
    }

    async updateParkigSpace(id : string, updateSpace: Partial<SpaceFB>){
        const keyRow = `row-${id.split('-')[0].split('')[1].toLowerCase()}`
        const dataToSave = (updateSpace instanceof SpaceFB) ? updateSpace.toJSON() : updateSpace;
        console.log(dataToSave)
        return setDoc(doc(this.fireStore, `parking-lot/${keyRow}/col/${id}-SPC`), dataToSave)
    }


    
}
