import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../../config/enviorement";
import { Observable } from "rxjs";
import { Rate } from "../../../../core/interfaces/rate";
import { ResponseMessage } from "../../../../core/interfaces/responseMessage";

@Injectable({
    providedIn : 'root',
})
export class RateService{

    private API_ENDPOINT_RATE = `${environment.apiUrl}/rates`;
    constructor(private http : HttpClient){}

    getAllRates(): Observable<Rate[]>{
        const query = `${this.API_ENDPOINT_RATE}/getAll`
        return this.http.get<Rate[]>(query)
    }

    updateRate(rate: Rate){
        const query = `${this.API_ENDPOINT_RATE}/update`
        return this.http.put<ResponseMessage>(query, rate)
    }
}