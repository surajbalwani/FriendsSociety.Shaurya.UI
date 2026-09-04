import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Activity } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private apiUrl = `${environment.apiUrl}/Activities`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Activity[]> {
    return this.http.get<Activity[]>(this.apiUrl);
  }

  getById(id: number): Observable<Activity> {
    return this.http.get<Activity>(`${this.apiUrl}/${id}`);
  }

  create(activity: Activity): Observable<Activity> {
    return this.http.post<Activity>(this.apiUrl, activity);
  }

  update(id: number, activity: Activity): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, activity);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
