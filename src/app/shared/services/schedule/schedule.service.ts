import { Injectable } from "@angular/core";
import { collection, doc, Firestore, getDoc, getDocs, setDoc } from "@angular/fire/firestore";
import { WorkDayFB } from "../../../core/models/shedule";

/** 
 * Servicio para gestionar los días de trabajo en Firestore.
 * 
 * Este servicio proporciona métodos para obtener, actualizar y listar los días de trabajo almacenados en Firestore.
 * Los días de trabajo están ubicados bajo la colección `schedule`, y cada día es representado por un objeto `WorkDayFB`.
 * 
 * Métodos:
 * - `getDay`: Obtiene un día de trabajo específico por su ID.
 * - `updateDay`: Actualiza un día de trabajo en Firestore.
 * - `getListDay`: Obtiene la lista de todos los días de trabajo disponibles.
 */
@Injectable({
    providedIn: 'root'
  })
export class ScheduleFbService {
    constructor(private fireStore: Firestore) {}

    /** 
     * Obtiene un día de trabajo específico por su ID.
     * 
     * @param {string} idDay El ID del día de trabajo a obtener.
     * @returns {Promise<WorkDayFB>} Una promesa que resuelve con el objeto `WorkDayFB` correspondiente al día de trabajo.
     */
    async getDay(idDay: string): Promise<WorkDayFB> {
        return getDoc(doc(this.fireStore, `schedule/${idDay}`)).then((data) => {
            return data.data() as WorkDayFB
        })
    }

    /** 
     * Actualiza un día de trabajo en Firestore.
     * 
     * @param {string} idDay El ID del día de trabajo a actualizar.
     * @param {Partial<WorkDayFB>} updateDay Los nuevos datos del día de trabajo.
     * @returns {Promise<void>} Una promesa que se resuelve cuando el día de trabajo es actualizado exitosamente.
     */
    async updateDay(idDay: string, updateDay: Partial<WorkDayFB>) {
        return setDoc(doc(this.fireStore, `schedule/${idDay}`), updateDay)
    }

    /** 
     * Obtiene la lista de todos los días de trabajo disponibles.
     * 
     * @returns {Promise<WorkDayFB[]>} Una promesa que resuelve con una lista de objetos `WorkDayFB` que representan todos los días de trabajo.
     */
    async getListDay(): Promise<WorkDayFB[]> {
        const listDay = collection(this.fireStore, `schedule`)
        const listDaySnapshot = await getDocs(listDay)
        return listDaySnapshot.docs.map((doc) => {
            return doc.data() as WorkDayFB
        })
    }
}
