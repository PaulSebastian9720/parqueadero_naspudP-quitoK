import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../../config/enviorement";
import { Contract, ReqContract } from "../../../../core/interfaces/contract";
import { Observable } from "rxjs";
import { ResponseMessage } from "../../../../core/interfaces/responseMessage";

@Injectable({
    providedIn: "root"
})
export class ContractService {
    private API_ENDPOINT_CONTRACT = `${environment.apiUrl}/contracts`;
    constructor(private http: HttpClient) {}

    getAllContracts(): Observable<Contract[]> {
        const query = `${this.API_ENDPOINT_CONTRACT}/getAll`;
        return this.http.get<Contract[]>(query);
    }   

    insertContract(contractRequest: ReqContract):Observable<ResponseMessage>{
        const query = `${this.API_ENDPOINT_CONTRACT}/create`;
        return this.http.post<ResponseMessage>(query, contractRequest);
    }

    updateEndContract(idContrac: number):Observable<ResponseMessage>{
        const query = `${this.API_ENDPOINT_CONTRACT}/${idContrac}/end-contract`
        return this.http.put<ResponseMessage>(query, null);
    }

    updateCancelContract(idContrac: number){
        const query = `${this.API_ENDPOINT_CONTRACT}/${idContrac}/cancel-contract`
        return this.http.put<ResponseMessage>(query, null);
    }

    getContractListByIdPerson(idPerson:number):Observable<Contract[]>{
        const query = `${this.API_ENDPOINT_CONTRACT}/${idPerson}/list-for-person`
        return this.http.get<Contract[]>(query);
    }

    getOneContractById(idContract: number): Observable<Contract>{
        const query = `${this.API_ENDPOINT_CONTRACT}/${idContract}/contract`
        return this.http.get<Contract>(query);
    }
}