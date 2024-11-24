import { Injectable } from "@angular/core";
import { collection, doc, Firestore, getDoc, getDocs, setDoc } from "@angular/fire/firestore";
import { SpaceData, SpaceFB } from "../../../core/models/space";

/** 
 * Servicio para gestionar el estacionamiento en Firestore.
 * 
 * Este servicio permite gestionar el estacionamiento, como agregar nuevos espacios, obtener la matriz de espacios,
 * actualizar los espacios de estacionamiento y llenar el estacionamiento con espacios predeterminados.
 * Los espacios de estacionamiento se organizan en filas y columnas, con un identificador único para cada espacio.
 * Los datos se almacenan en Firestore y se pueden consultar o modificar mediante los métodos proporcionados.
 * 
 * Métodos:
 * - `addNewSpot`: Agrega un nuevo espacio de estacionamiento a una fila específica.
 * - `getParkingLot`: Obtiene la matriz de espacios de estacionamiento organizada por filas y columnas.
 * - `updateParkigSpace`: Actualiza un espacio de estacionamiento específico.
 * - `fillParkingLot`: Llena el estacionamiento con espacios predeterminados.
 * - `getMatrizlength`: Obtiene la longitud total de la matriz de estacionamiento.
 * - `getRowlength`: Obtiene la longitud de una fila específica del estacionamiento.
 */
@Injectable(
    {
        providedIn: "root"
    }
)
export class ParkinLotService {
    constructor(private fireStore: Firestore) {}

    /** 
     * Agrega un nuevo espacio de estacionamiento a una fila específica.
     * 
     * @param {string} row La fila en la que se va a agregar el espacio.
     * @returns {Promise<void>} Una promesa que se resuelve cuando el espacio es agregado exitosamente.
     */
    async addNewSpot(row: string) {   
        const indexCurrent = await this.getRowlength(row)
        const newIndex = (indexCurrent as number) + 1
        const idSpace = `R${row.toUpperCase()}-C${newIndex}`
        const newSpace = new SpaceFB(idSpace,"Y","", "")
        const query = `row-${row.toLowerCase()}/col/${idSpace}-SPC`
        return setDoc(doc(this.fireStore, `parking-lot/${query}`), Object.assign({}, newSpace)).then(() => {
            setDoc(doc(this.fireStore, `parking-lot/row-${row.toLowerCase()}`), {length : newIndex})
        })
    }

    /** 
     * Obtiene la matriz completa de espacios de estacionamiento.
     * 
     * @returns {Promise<SpaceData[][]>} Una promesa que resuelve la matriz de espacios de estacionamiento.
     */
    async getParkingLot(): Promise<SpaceData[][]> {
        let matrixSpaces: SpaceData[][] = [] 
        
        for (let i = 0; i < 7 + 1; i++) {
            const rowLetter = String.fromCharCode(64 + i).toLowerCase()
            const rowRef = collection(this.fireStore, "parking-lot/row-" + rowLetter + "/col")
            const rowSnap = await getDocs(rowRef)   
            const row = rowSnap.docs.map(doc => {
                return new SpaceData(doc.id, SpaceFB.fromJSON(doc.data()))
            })
            matrixSpaces.push(row)
        }

        return matrixSpaces
    }

    /** 
     * Actualiza un espacio de estacionamiento específico.
     * 
     * @param {string} id El ID del espacio de estacionamiento a actualizar.
     * @param {Partial<SpaceFB>} updateSpace Los datos actualizados del espacio de estacionamiento.
     * @returns {Promise<void>} Una promesa que se resuelve cuando el espacio es actualizado.
     */
    async updateParkigSpace(id: string, updateSpace: Partial<SpaceFB>) {
        const keyRow = `row-${id.split('-')[0].split('')[1].toLowerCase()}`
        const dataToSave = (updateSpace instanceof SpaceFB) ? updateSpace.toJSON() : updateSpace;
        return setDoc(doc(this.fireStore, `parking-lot/${keyRow}/col/${id}-SPC`), dataToSave)
    }

    /** 
     * Llena el estacionamiento con espacios predeterminados.
     * 
     * @returns {Promise<void>} Una promesa que se resuelve cuando el estacionamiento está lleno.
     */
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

    /** 
     * Obtiene la longitud total de la matriz de estacionamiento.
     * 
     * @returns {Promise<number>} Una promesa que resuelve la longitud de la matriz de estacionamiento.
     */
    private getMatrizlength() {
        return getDoc(doc(this.fireStore, "parking-lot/length")).then((value) => {
            return value.data()!['length'] as number
        })   
    }

    /** 
     * Obtiene la longitud de una fila específica del estacionamiento.
     * 
     * @param {string} row La fila cuyo tamaño se desea obtener.
     * @returns {Promise<number>} Una promesa que resuelve la longitud de la fila.
     */
    private getRowlength(row: string) {
        return getDoc(doc(this.fireStore, `parking-lot/row-${row.toLowerCase()}`)).then((value) => {
            return value.data()!['length'] as number
        })
    }
}
