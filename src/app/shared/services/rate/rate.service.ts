import { Injectable } from "@angular/core";
import { addDoc, collection, deleteDoc, doc, Firestore, getDoc, getDocs, setDoc } from "@angular/fire/firestore";
import { RateData, RateFB } from "../../../core/models/rate";

/** 
 * Servicio para gestionar tarifas en Firestore.
 * 
 * Este servicio proporciona métodos para crear, obtener, actualizar, eliminar y listar tarifas almacenadas en Firestore.
 * Las tarifas están ubicadas bajo la colección `rates`, y cada tarifa es representada por un objeto `RateFB`.
 * 
 * Métodos:
 * - `createRate`: Crea una nueva tarifa en Firestore.
 * - `getRate`: Obtiene una tarifa específica por su ID.
 * - `getListRate`: Obtiene la lista de todas las tarifas disponibles.
 * - `updateRate`: Actualiza una tarifa existente en Firestore.
 * - `deleteRate`: Elimina una tarifa de Firestore por su ID.
 */
@Injectable({
    providedIn: "root"
})
export class RateService {
    constructor (private fireStore: Firestore) {}

    /** 
     * Crea una nueva tarifa en Firestore.
     * 
     * @param {RateFB} ratefb El objeto que contiene los detalles de la tarifa a crear.
     * @returns {Promise<void>} Una promesa que se resuelve cuando la tarifa es creada exitosamente.
     */
    async createRate(ratefb: RateFB) {
        return addDoc(
            collection(this.fireStore, "rates"),
            Object.assign({}, ratefb)
        )
    }

    /** 
     * Obtiene una tarifa específica por su ID.
     * 
     * @param {string} id El ID de la tarifa a obtener.
     * @returns {Promise<RateFB | undefined>} Una promesa que resuelve con la tarifa o `undefined` si no se encuentra.
     */
    async getRate(id: string): Promise<RateFB | undefined> {
        return getDoc(doc(this.fireStore, `rates/${id}`)).then(doc => {
            return doc.data() as RateFB
        })
    }

    /** 
     * Obtiene la lista de todas las tarifas disponibles.
     * 
     * @returns {Promise<RateData[]>} Una promesa que resuelve con una lista de objetos `RateData`.
     */
    async getListRate(): Promise<RateData[]> {
        const snapshot = await getDocs(collection(this.fireStore, `rates`))
        return snapshot.docs.map(doc => {
            return new RateData(doc.id, doc.data() as RateFB)
        })
    }

    /** 
     * Actualiza una tarifa existente en Firestore.
     * 
     * @param {string} id El ID de la tarifa a actualizar.
     * @param {Partial<RateFB>} ratefb Los nuevos datos de la tarifa.
     * @returns {Promise<void>} Una promesa que se resuelve cuando la tarifa es actualizada exitosamente.
     */
    async updateRate(id: string, ratefb: Partial<RateFB>) {
        const rateDoc = doc(this.fireStore, `rates/${id}`)
        return setDoc(rateDoc, Object.assign({}, ratefb), { merge: true })
    }

    /** 
     * Elimina una tarifa de Firestore por su ID.
     * 
     * @param {string} rateId El ID de la tarifa a eliminar.
     * @returns {Promise<void>} Una promesa que se resuelve cuando la tarifa es eliminada exitosamente.
     */
    async deleteRate(rateId: string): Promise<void> {
        try {
            const rateDocRef = doc(this.fireStore, 'rates', rateId);
            await deleteDoc(rateDocRef);
        } catch (error) {
            console.error('Error al eliminar el documento:', error);
            throw error;
        }
    }
}
