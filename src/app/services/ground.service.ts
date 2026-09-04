import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ground } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GroundService {
  private apiUrl = `${environment.apiUrl}/Grounds`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Ground[]> {
    return this.http.get<Ground[]>(this.apiUrl);
  }

  getById(id: number): Observable<Ground> {
    return this.http.get<Ground>(`${this.apiUrl}/${id}`);
  }

  create(ground: Ground): Observable<Ground> {
    return this.http.post<Ground>(this.apiUrl, ground);
  }

  update(id: number, ground: Ground): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, ground);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
