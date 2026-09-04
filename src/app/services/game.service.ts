import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Game {
  gameID: number;
  name: string;
  gameCode: string;
  gameCodeNumber: number;
  disabilityTypeCode: number;
  ageCategory: string;
  ageRangeStart: number;
  ageRangeEnd: number;
  abilityTypeID: number;
  abilityType?: {
    abilityTypeID: number;
    name: string;
    description: string;
  };
  description?: string;
  rules?: string;
  isDeleted: boolean;
  createdDate: Date;
  updatedDate?: Date;
}

export interface GroupedGames {
  disabilityTypeCode: number;
  disabilityTypeName: string;
  games: {
    ageCategory: string;
    ageRange: string;
    games: {
      gameID: number;
      name: string;
      gameCode: string;
      description: string;
      rules: string;
    }[];
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiUrl = `${environment.apiUrl}/Games`;

  constructor(private http: HttpClient) { }

  getGames(): Observable<Game[]> {
    return this.http.get<Game[]>(this.apiUrl);
  }

  getGame(id: number): Observable<Game> {
    return this.http.get<Game>(`${this.apiUrl}/${id}`);
  }

  getGameByCode(gameCode: string): Observable<Game> {
    return this.http.get<Game>(`${this.apiUrl}/ByCode/${gameCode}`);
  }

  getGamesByDisabilityType(disabilityTypeCode: number): Observable<Game[]> {
    return this.http.get<Game[]>(`${this.apiUrl}/ByDisabilityType/${disabilityTypeCode}`);
  }

  getGamesByAgeCategory(ageCategory: string): Observable<Game[]> {
    return this.http.get<Game[]>(`${this.apiUrl}/ByAgeCategory/${ageCategory}`);
  }

  getGamesGroupedByDisability(): Observable<GroupedGames[]> {
    return this.http.get<GroupedGames[]>(`${this.apiUrl}/GroupedByDisability`);
  }

  getGamesByAgeAndAbility(age: number, abilityTypeId: number): Observable<Game[]> {
    return this.http.get<Game[]>(`${this.apiUrl}/ByAgeAndAbility?age=${age}&abilityTypeId=${abilityTypeId}`);
  }

  getGameParticipation(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Participation`);
  }

  createGame(game: Partial<Game>): Observable<Game> {
    return this.http.post<Game>(this.apiUrl, game);
  }

  updateGame(id: number, game: Game): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, game);
  }

  deleteGame(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
