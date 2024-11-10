import {  Injectable } from "@angular/core";
import { collection, doc, Firestore, setDoc } from "@angular/fire/firestore";
import { SpaceFB } from "../../../core/models/space";

@Injectable({
    providedIn: 'root'
})

export class SpaceFBSevices{
    constructor(
        private fireStore : Firestore
    ){}


    private async fillParkingLot() {
        const rows = 7; 
        const spacesPerColumn = 7; 
    
        for (let row = 1; row <= rows; row++) { 
          const rowLetter = String.fromCharCode(64 + row)
    
          const col = "col"
    
          for (let space = 1; space <= spacesPerColumn; space++) {
            const spaceId = `R${rowLetter}-C${space}-SPC`
            const location = `R${rowLetter}-C${space}`
    
            await setDoc(
              doc(this.fireStore, `parking-lot/row-${rowLetter.toLowerCase()}/${col}/${spaceId}`),
              new SpaceFB(location, true, "", "").toJSON() 
            );
          }
        }
    
      }
    
}