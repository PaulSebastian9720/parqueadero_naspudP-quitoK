import { HttpClient } from "@angular/common/http";
import {  Injectable } from "@angular/core";
import { API_ENDPOINT } from "../enviroment";
import { firstValueFrom } from "rxjs";
import { Automobile } from "../../../core/models/automobile";

@Injectable({
    providedIn: 'root',
  })
export class AutomobileService {
    private API_ENDPOINT_AUTOMOBILE = `${API_ENDPOINT}/automobiles`;

    constructor(private http : HttpClient) { }

    async getAutomobileByIdPerson(idPerson :number): Promise< Automobile[]> {
        const query = `${this.API_ENDPOINT_AUTOMOBILE}/${idPerson}/list-for-person`
        console.log(query)
        return firstValueFrom(this.http.get<any>(query))
    }

}