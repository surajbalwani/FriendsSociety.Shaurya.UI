import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GroundAllocation } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GroundAllocationService {
  private apiUrl = `${environment.apiUrl}/GroundAllocations`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<GroundAllocation[]> {
    return this.http.get<GroundAllocation[]>(this.apiUrl);
  }

  getById(id: number): Observable<GroundAllocation> {
    return this.http.get<GroundAllocation>(`${this.apiUrl}/${id}`);
  }

  create(groundAllocation: GroundAllocation): Observable<GroundAllocation> {
    return this.http.post<GroundAllocation>(this.apiUrl, groundAllocation);
  }

  update(id: number, groundAllocation: GroundAllocation): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, groundAllocation);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  checkAvailability(groundId: number, startTime: string, endTime: string): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.apiUrl}/check-availability?groundId=${groundId}&startTime=${startTime}&endTime=${endTime}`
    );
  }
}
