import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivityCategory } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActivityCategoryService {
  private apiUrl = `${environment.apiUrl}/ActivityCategories`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<ActivityCategory[]> {
    return this.http.get<ActivityCategory[]>(this.apiUrl);
  }

  getById(id: number): Observable<ActivityCategory> {
    return this.http.get<ActivityCategory>(`${this.apiUrl}/${id}`);
  }

  create(activityCategory: ActivityCategory): Observable<ActivityCategory> {
    return this.http.post<ActivityCategory>(this.apiUrl, activityCategory);
  }

  update(id: number, activityCategory: ActivityCategory): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, activityCategory);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
