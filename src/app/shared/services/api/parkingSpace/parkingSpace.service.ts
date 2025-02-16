import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../../config/enviorement";
import { Observable } from "rxjs";
import { ParkingSpace } from "../../../../core/interfaces/parkingSpace";
import { ResponseMessage } from "../../../../core/interfaces/responseMessage";

@Injectable({
    providedIn: "root"
})
export class ParkingSpaceService {
    private API_ENDPOINT_PSPACE = `${environment.apiUrl}/parkingSpaces`;
    
    constructor(private http : HttpClient){}

    getAllSpaces(): Observable<ParkingSpace[]> {
        const query = `${this.API_ENDPOINT_PSPACE}/getAll`
        return this.http.get<ParkingSpace[]>(query)
    }

    getFilterList(status: 'FR' |'IN'){
        const query = `${this.API_ENDPOINT_PSPACE}/${status}/filterList`
        return this.http.get<ParkingSpace[]>(query)
    }

    updateSpaceStatus(id: number): Observable<ResponseMessage> {
        const query = `${this.API_ENDPOINT_PSPACE}/change-state/${id}`
        return this.http.put<ResponseMessage>(query, null)
    }

    insertSpace(data : {location :string , length : number} ):Observable<ResponseMessage>{
        const query = `${this.API_ENDPOINT_PSPACE}/create`
        return this.http.post<ResponseMessage>(query, data)
    }

}