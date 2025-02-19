import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../../config/enviorement";
import { ReqDealBase } from "../../../../core/interfaces/contract";
import { Observable } from "rxjs";
import { Ticket } from "../../../../core/interfaces/ticket";
import { ResponseMessage } from "../../../../core/interfaces/responseMessage";

@Injectable({
    providedIn: "root"
})
export class TicketService {
    private API_ENDPOINT_TICKETS = `${environment.apiUrl}/tickets`;
    constructor(private http: HttpClient) {}

    insertTicket(reqDealBase:ReqDealBase):Observable<{accessToken: string}>{
        reqDealBase.idRate = -1
        const query = `${this.API_ENDPOINT_TICKETS}/create`
        return this.http.post<{accessToken: string}>(query, reqDealBase);
    }

    getOneTicketByIdTicket(idTicket:number):Observable<Ticket>{
        const query = `${this.API_ENDPOINT_TICKETS}/${idTicket}/ticketById`
        return this.http.get<Ticket>(query);
    }

    getOneTicketByAccessToken(accessToken:string):Observable<Ticket>{
        const query = `${this.API_ENDPOINT_TICKETS}/${accessToken}/ticket`
        return this.http.get<Ticket>(query);
    }

    getAllTickets():Observable<Ticket[]>{
        const query = `${this.API_ENDPOINT_TICKETS}/getAll`
        return this.http.get<Ticket[]>(query);
    }

    getTicketsByIdPerson(idPerson:number){
        const query = `${this.API_ENDPOINT_TICKETS}/${idPerson}/list-for-person`
        return this.http.get<Ticket[]>(query);
    }

    updateCancelTicket(accessToken:string){
        const query = `${this.API_ENDPOINT_TICKETS}/${accessToken}/cancel-ticket`
        return this.http.put<ResponseMessage>(query, null);
    }

    calculateTicketPrice(accessToken:string):Observable<number>{
        const query = `${this.API_ENDPOINT_TICKETS}/${accessToken}/price`
        return this.http.get<number>(query);
    }

}