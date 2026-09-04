import { Injectable } from '@angular/core';
import { ApiGenericService } from './api-generic.service';
import { User } from '../model/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService extends ApiGenericService<User> {
  constructor() {
    super();
    this.setApiUrl(`${environment.apiBaseUrl}/Users`);
  }
}
