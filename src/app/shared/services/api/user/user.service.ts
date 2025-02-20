import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../../../core/interfaces/person';
import { Observable } from 'rxjs';
import { environment } from '../../../../../config/enviorement';
import { ResponseMessage } from '../../../../core/interfaces/responseMessage';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private API_ENDPOINT_USER = `${environment.apiUrl}/users`;
  constructor(private http: HttpClient) {}

  getOneUserById(idPerson: number): Observable<User> {
    const query = `${this.API_ENDPOINT_USER}/${idPerson}/user`;
    return this.http.get<User>(query);
  }

  getAllUsers(): Observable<User[]> {
    const query = `${this.API_ENDPOINT_USER}/getAll`;
    return this.http.get<User[]>(query);
  }

  updateUser(user: User): Observable<ResponseMessage> {
    const query = `${this.API_ENDPOINT_USER}/update`;
    return this.http.put<ResponseMessage>(query, user);
  }

  updateUserStatus(idPerson: number): Observable<ResponseMessage> {
    const query = `${this.API_ENDPOINT_USER}/change-state/${idPerson}`;
    return this.http.put<ResponseMessage>(query, null);
  }

  insertUser(user: User):Observable<ResponseMessage> {
    const query = `${this.API_ENDPOINT_USER}/insert`
    return this.http.post<ResponseMessage>(query, user);
  }
}
