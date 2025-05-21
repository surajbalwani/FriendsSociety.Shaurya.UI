import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiGenericService<T> {
  protected apiUrl = '';

  http = inject(HttpClient);

  setApiUrl(url: string) {
    this.apiUrl = url;
  }

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.apiUrl);
  }

  getById(id: number | string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${id}`);
  }

  add(item: T): Observable<T> {
    return this.http.post<T>(this.apiUrl, item);
  }

  update(id: number | string, item: T): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${id}`, item);
  }

  delete(id: number | string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
