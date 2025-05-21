import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiGenericService } from '../../services/api-generic.service';
import { Activity } from '../../model/activity.model';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.sass'],
  standalone: true,
  imports: [CommonModule]
})
export class ActivitiesComponent implements OnInit {
  activities: Activity[] = [];
  private activitiesApiUrl = 'https://localhost:7209/api/Activities';

  constructor(private apiService: ApiGenericService<Activity>) {}

  ngOnInit(): void {
    this.apiService.setApiUrl(this.activitiesApiUrl);
    this.apiService.getAll().subscribe(data => {
      this.activities = data;
    });
  }
}
