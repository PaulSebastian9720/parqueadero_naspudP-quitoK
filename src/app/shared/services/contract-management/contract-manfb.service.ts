import { Injectable } from "@angular/core";
import { collection, doc, Firestore, getDoc, getDocs, setDoc, snapToData } from "@angular/fire/firestore";
import { ManagementData, ManagementFB } from "../../../core/models/management";

/** 
 * Servicio para gestionar contratos de gestión en Firestore.
 * 
 * Este servicio permite crear, obtener, actualizar y listar contratos de gestión. Los contratos están almacenados en Firestore
 * bajo el nodo `contract-m`. Cada contrato de gestión está asociado con un documento que contiene información sobre
 * el contrato y la gestión.
 * 
 * Métodos:
 * - `createContract`: Crea un nuevo contrato en Firestore con los datos proporcionados.
 * - `getContract`: Obtiene un contrato de gestión específico a partir de su ID.
 * - `updatoContract`: Actualiza un contrato de gestión existente con los nuevos datos.
 * - `getListManagement`: Obtiene la lista de todos los contratos de gestión disponibles.
 */
@Injectable ({
    providedIn : 'root'
})
export class ContractManFBService {
    constructor(private fireStore: Firestore) {}

    /** 
     * Crea un nuevo contrato de gestión en Firestore.
     * 
     * @param {string} id El ID del contrato.
     * @param {ManagementFB} managenteFB El objeto que contiene los detalles del contrato a crear.
     * @returns {Promise<void>} Una promesa que se resuelve cuando el contrato es creado exitosamente.
     */
    async createContract(id: string, managenteFB: ManagementFB) {
        return setDoc(doc(this.fireStore, `contract-m/${id}`), Object.assign({}, managenteFB))
    }

    /** 
     * Obtiene un contrato de gestión específico por su ID.
     * 
     * @param {string} id El ID del contrato a obtener.
     * @returns {Promise<ManagementFB | null>} Una promesa que resuelve el contrato de gestión o null si no existe.
     */
    async getContract(id: string): Promise<ManagementFB | null> {
        return getDoc(doc(this.fireStore, `contract-m/${id}`))
        .then((snapShot) => {
            return snapShot.data() as ManagementFB
        }) || null
    }

    /** 
     * Actualiza un contrato de gestión con nuevos datos.
     * 
     * @param {string} id El ID del contrato a actualizar.
     * @param {Partial<ManagementFB | null>} updateManagementFb Los datos actualizados del contrato de gestión.
     * @returns {Promise<void>} Una promesa que se resuelve cuando el contrato es actualizado exitosamente.
     */
    async updatoContract(id: string, updateManagementFb: Partial<ManagementFB | null>) {
        return setDoc(doc(this.fireStore, `contract-m/${id}`), updateManagementFb, { merge: true })
    }

    /** 
     * Obtiene la lista de todos los contratos de gestión.
     * 
     * @returns {Promise<ManagementData[]>} Una promesa que resuelve con una lista de contratos de gestión.
     */
    async getListManagement(): Promise<ManagementData[]> {
        const getListManagement = collection(this.fireStore, 'contract-m')
        const managementSnapt = await getDocs(getListManagement)
        return managementSnapt.docs.map(doc => {
            return new ManagementData(doc.id, doc.data() as ManagementFB)
        })
    }
}
