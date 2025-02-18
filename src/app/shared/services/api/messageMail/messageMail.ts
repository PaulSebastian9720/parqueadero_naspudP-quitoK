import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../config/enviorement';
import { Observable } from 'rxjs';
import { MessageMail } from '../../../../core/interfaces/messageMail';

@Injectable({
  providedIn: 'root',
})
export class MessageMailService {
  private API_ENDPOINT_MAIL = `${environment.apiUrl}/messages`;
  constructor(private http: HttpClient) {}
  getMessageListByIdPerson(idPerson: number): Observable<MessageMail[]> {
    const query = `${this.API_ENDPOINT_MAIL}/${idPerson}/mails`;
    return this.http.get<MessageMail[]>(query);
  }

  updateChangeState(idMessage: number) {
    const query = `${this.API_ENDPOINT_MAIL}/change-state/${idMessage}`;
    return this.http.put(query, null);
  }
}
