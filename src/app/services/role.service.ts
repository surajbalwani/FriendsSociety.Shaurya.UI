import { Injectable } from '@angular/core';
import { ApiGenericService } from './api-generic.service';
import { Role } from '../model/role.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RoleService extends ApiGenericService<Role> {
  constructor() {
    super();
    this.setApiUrl(`${environment.apiBaseUrl}/Roles`);
  }
}
