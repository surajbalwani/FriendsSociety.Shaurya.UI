import { Injectable } from '@angular/core';
import { ApiGenericService } from './api-generic.service';
import { Ground } from '../model/ground.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GroundService extends ApiGenericService<Ground> {
  constructor() {
    super();
    this.setApiUrl(`${environment.apiBaseUrl}/Grounds`);
  }
}
