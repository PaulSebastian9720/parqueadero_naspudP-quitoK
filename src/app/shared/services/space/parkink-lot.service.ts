import { Injectable } from "@angular/core";
import { collection, doc, Firestore, getDoc, getDocs, setDoc } from "@angular/fire/firestore";
import { SpaceData, SpaceFB } from "../../../core/models/space";

@Injectable(
    {
        providedIn: "root"
    }
)
export class ParkinLotService {
    constructor(private fireStore: Firestore) {}

    async addNewSpot(row: string){   
        const indexCurrent = await this.getRowlength(row)
        const newIndex = (indexCurrent as number) + 1
        const idSpace = `R${row.toUpperCase()}-C${newIndex}`
        const newSpace = new SpaceFB(idSpace,"Y","", "")
        const query = `row-${row.toLowerCase()}/col/${idSpace}-SPC`
        return setDoc(doc(this.fireStore, `parking-lot/${query}`), Object.assign({}, newSpace)).then(() =>{
            setDoc(doc(this.fireStore, `parking-lot/row-${row.toLowerCase()}`), {length : newIndex} )
        })
    }

    async getParkingLot() : Promise<SpaceData[][]>{
        let matrixSpaces : SpaceData[][] =[] 
        
        for (let i = 0; i < 7 + 1; i++) {
            const rowLetter = String.fromCharCode(64 + i).toLowerCase()
            const rowRef = collection(this.fireStore, "parking-lot/row-"+ rowLetter + "/col")
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
        return setDoc(doc(this.fireStore, `parking-lot/${keyRow}/col/${id}-SPC`), dataToSave)
    }

    async fillParkingLot() {
        const rows = 7; 
        const spacesPerColumn = 7; 
    
        for (let row = 1; row <= rows; row++) { 
          const rowLetter = String.fromCharCode(64 + row)
    
            for (let space = 1; space <= spacesPerColumn; space++) {
                const spaceId = `R${rowLetter}-C${space}-SPC`
                const location = `R${rowLetter}-C${space}`
                
                await setDoc(
                    doc(this.fireStore, `parking-lot/row-${rowLetter.toLowerCase()}/col/${spaceId}`),
                    new SpaceFB(location, "Y", "", "").toJSON() 
                )
            }
        }
    }

    private getMatrizlength(){
        return getDoc(doc(this.fireStore, "parking-lot/length")).then((value) => {
            return value.data()!['length'] as number
        })   
    }


    private getRowlength(row: string) {
        return getDoc(doc(this.fireStore, `parking-lot/row-${row.toLowerCase()}`)).then((value) => {
            return value.data()!['length'] as number
        })
    }
    
}
