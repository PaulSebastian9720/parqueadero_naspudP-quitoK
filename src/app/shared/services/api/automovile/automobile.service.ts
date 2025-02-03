import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../config/enviroment';
import { Automobile } from '../../../../core/models/automobile';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AutomobileService {
  private API_ENDPOINT_AUTOMOBILE = `${environment.apiUrl}/automobiles`;

  constructor(private http: HttpClient) {}

  getAutomobileListByIdPerson(idPerson: number): Observable<Automobile[]> {
    const query = `${this.API_ENDPOINT_AUTOMOBILE}/${idPerson}/list-for-person`;
    return this.http.get<any>(query);
  }
}
