import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Participant } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParticipantService {
  private apiUrl = `${environment.apiUrl}/Participants`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Participant[]> {
    console.log('ParticipantService: Fetching all participants from:', this.apiUrl);
    return this.http.get<Participant[]>(this.apiUrl).pipe(
      tap((data: any) => {
        console.log('ParticipantService: Received data:', data);
        console.log('ParticipantService: Number of participants:', data?.length || 0);
      }),
      catchError((error) => {
        console.error('ParticipantService: Error fetching participants:', error);
        throw error;
      })
    );
  }

  getById(id: number): Observable<Participant> {
    return this.http.get<Participant>(`${this.apiUrl}/${id}`);
  }

  create(participant: Participant): Observable<Participant> {
    return this.http.post<Participant>(this.apiUrl, participant);
  }

  update(id: number, participant: Participant): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, participant);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
