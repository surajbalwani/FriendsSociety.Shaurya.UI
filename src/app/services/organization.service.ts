import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Organization } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  private apiUrl = `${environment.apiUrl}/Organizations`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Organization[]> {
    return this.http.get<Organization[]>(this.apiUrl);
  }

  getById(id: number): Observable<Organization> {
    return this.http.get<Organization>(`${this.apiUrl}/${id}`);
  }

  create(organization: Organization): Observable<Organization> {
    return this.http.post<Organization>(this.apiUrl, organization);
  }

  update(id: number, organization: Organization): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, organization);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
