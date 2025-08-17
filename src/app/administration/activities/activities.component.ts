import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiGenericService } from '../../services/api-generic.service';
import { Activity } from '../../model/activity.model';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ActivitiesComponent implements OnInit {
  activities: Activity[] = [];
  activityForm: FormGroup;
  showForm = false;
  isSubmitting = false;
  message = '';
  messageType: 'success' | 'error' = 'success';
  private activitiesApiUrl = `${environment.apiBaseUrl}/Activities`;

  constructor(
    private apiService: ApiGenericService<Activity>,
    private fb: FormBuilder
  ) {
    this.activityForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      rules: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
    this.loadActivities();
  }

  loadActivities(): void {
    this.apiService.setApiUrl(this.activitiesApiUrl);
    this.apiService.getAll().subscribe({
      next: (data) => {
        this.activities = data;
      },
      error: (error) => {
        console.error('Error loading activities:', error);
        this.showMessage('Error loading activities', 'error');
      }
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.activityForm.reset();
      this.message = '';
    }
  }

  onSubmit(): void {
    if (this.activityForm.valid) {
      this.isSubmitting = true;
      const newActivity: Partial<Activity> = {
        name: this.activityForm.value.name,
        rules: this.activityForm.value.rules,
        isDeleted: false
      };

      this.apiService.add(newActivity as Activity).subscribe({
        next: (createdActivity) => {
          this.activities.push(createdActivity);
          this.activityForm.reset();
          this.showForm = false;
          this.showMessage('Activity created successfully!', 'success');
        },
        error: (error) => {
          console.error('Error creating activity:', error);
          this.showMessage('Error creating activity. Please try again.', 'error');
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    }
  }

  private showMessage(message: string, type: 'success' | 'error'): void {
    this.message = message;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }

  trackByActivityID(index: number, activity: Activity): number {
    return activity.activityID;
  }
}
