import { Injectable } from '@angular/core';
import { ApiGenericService } from './api-generic.service';
import { AbilityType } from '../model/ability-type.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AbilityTypeService extends ApiGenericService<AbilityType> {
  constructor() {
    super();
    this.setApiUrl(`${environment.apiBaseUrl}/AbilityTypes`);
  }
}
