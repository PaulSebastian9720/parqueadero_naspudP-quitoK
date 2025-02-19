import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../config/enviorement';
import { Schedule } from '../../../../core/interfaces/schedule';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private API_ENDPOINT_SCHEDULE = `${environment.apiUrl}/schedules`;

  constructor(private http: HttpClient) { }

  insertSchedule(schedule: Schedule): Observable<string> {
    const query = `${this.API_ENDPOINT_SCHEDULE}/create`;
    return this.http.post(query, schedule, { responseType: 'text' });
  }

  getAllSchedules(): Observable<Schedule[]> {
    const query = `${this.API_ENDPOINT_SCHEDULE}/getAll`;
    return this.http.get<Schedule[]>(query);
  }

  updateSchedule(schedule: Schedule): Observable<string> {
    const query = `${this.API_ENDPOINT_SCHEDULE}/update`;
    return this.http.put(query, schedule, { responseType: 'text' });
  }
  
  deleteSchedule(idDay: number): Observable<string> {
    const query = `${this.API_ENDPOINT_SCHEDULE}/remove?schedule_id=${idDay}`;
    return this.http.delete(query, { responseType: 'text' });
  }

  
  
}
