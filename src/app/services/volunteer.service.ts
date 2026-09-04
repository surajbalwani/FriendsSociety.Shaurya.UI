import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Volunteer } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VolunteerService {
  private apiUrl = `${environment.apiUrl}/Volunteers`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Volunteer[]> {
    console.log('VolunteerService: Fetching all volunteers from:', this.apiUrl);
    return this.http.get<Volunteer[]>(this.apiUrl).pipe(
      tap((data: any) => {
        console.log('VolunteerService: Received data:', data);
        console.log('VolunteerService: Number of volunteers:', data?.length || 0);
      }),
      catchError((error) => {
        console.error('VolunteerService: Error fetching volunteers:', error);
        throw error;
      })
    );
  }

  getById(id: number): Observable<Volunteer> {
    return this.http.get<Volunteer>(`${this.apiUrl}/${id}`);
  }

  create(volunteer: Volunteer): Observable<Volunteer> {
    return this.http.post<Volunteer>(this.apiUrl, volunteer);
  }

  update(id: number, volunteer: Volunteer): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, volunteer);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
