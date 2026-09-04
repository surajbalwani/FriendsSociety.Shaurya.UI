import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TeamAssignment, TeamMemberDetails } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TeamAssignmentService {
  private apiUrl = `${environment.apiUrl}/TeamAssignments`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<TeamAssignment[]> {
    return this.http.get<TeamAssignment[]>(this.apiUrl);
  }

  getById(id: number): Observable<TeamAssignment> {
    return this.http.get<TeamAssignment>(`${this.apiUrl}/${id}`);
  }

  getTeamMembers(id: number): Observable<TeamMemberDetails> {
    return this.http.get<TeamMemberDetails>(`${this.apiUrl}/${id}/Members`);
  }

  create(team: TeamAssignment): Observable<TeamAssignment> {
    return this.http.post<TeamAssignment>(this.apiUrl, team);
  }

  update(id: number, team: TeamAssignment): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, team);
  }

  assignGround(id: number, groundID: number | null): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/AssignGround`, { groundID });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
