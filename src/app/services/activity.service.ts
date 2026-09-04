import { Injectable } from '@angular/core';
import { ApiGenericService } from './api-generic.service';
import { Activity } from '../model/activity.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ActivityService extends ApiGenericService<Activity> {
  constructor() {
    super();
    this.setApiUrl(`${environment.apiBaseUrl}/Activities`);
  }
}
