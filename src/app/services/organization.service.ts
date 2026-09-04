import { Injectable } from '@angular/core';
import { ApiGenericService } from './api-generic.service';
import { Organization } from '../model/organization.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService extends ApiGenericService<Organization> {
  constructor() {
    super();
    this.setApiUrl(`${environment.apiBaseUrl}/Organizations`);
  }
}
