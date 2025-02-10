import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../config/enviorement';
import { Observable } from 'rxjs';
import { ResponseMessage } from '../../../../core/interfaces/responseMessage';
import { Automobile } from '../../../../core/interfaces/automobile';

@Injectable({
  providedIn: 'root',
})
export class AutomobileService {
  private API_ENDPOINT_AUTOMOBILE = `${environment.apiUrl}/automobiles`;

  constructor(private http: HttpClient) {}

  insertAutomobile(automobile: Automobile): Observable<ResponseMessage> {
    const query = `${this.API_ENDPOINT_AUTOMOBILE}/create`;
    return this.http.post<ResponseMessage>(query, automobile);
  }

  getOneAutomobileById(idAutomobile: number): Observable<Automobile> {
    const query = `${this.API_ENDPOINT_AUTOMOBILE}/${idAutomobile}/automobile`;
    return this.http.get<Automobile>(query);
  }
  getAutomobileListByIdPerson(idPerson: number): Observable<Automobile[]> {
    const query = `${this.API_ENDPOINT_AUTOMOBILE}/${idPerson}/list-for-person`;
    return this.http.get<Automobile[]>(query);
  }

  updateAutomobile(automobile: Automobile): Observable<ResponseMessage> {
    const query = `${this.API_ENDPOINT_AUTOMOBILE}/update`;
    return this.http.put<ResponseMessage>(query, automobile);
  }

  deleteAutomobile(idAutomobile: number): Observable<any> {
    const query = `${this.API_ENDPOINT_AUTOMOBILE}/delete/${idAutomobile}`;
    return this.http.delete<ResponseMessage>(query);
  }
}
