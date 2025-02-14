import { Injectable } from '@angular/core';
import { environment } from '../../../../../config/enviorement'; 
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../../../../core/interfaces/comment'; 
import { ResponseMessage } from '../../../../core/interfaces/responseMessage';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private API_ENDPOINT_COMMENT = `${environment.apiUrl}/comments`;

  constructor(private http: HttpClient) { }

  insertComment(comment: Comment): Observable<string> {
    const query = `${this.API_ENDPOINT_COMMENT}/create`;
    return this.http.post(query, comment, { responseType: 'text' });
  }
  

  getAllComments(): Observable<Comment[]> {
    const query = `${this.API_ENDPOINT_COMMENT}/getAll`;
    return this.http.get<Comment[]>(query);

  }
}


