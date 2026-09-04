import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AbilityType } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AbilityTypeService {
  private apiUrl = `${environment.apiUrl}/AbilityTypes`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<AbilityType[]> {
    return this.http.get<AbilityType[]>(this.apiUrl);
  }

  getById(id: number): Observable<AbilityType> {
    return this.http.get<AbilityType>(`${this.apiUrl}/${id}`);
  }

  create(abilityType: AbilityType): Observable<AbilityType> {
    return this.http.post<AbilityType>(this.apiUrl, abilityType);
  }

  update(id: number, abilityType: AbilityType): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, abilityType);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
