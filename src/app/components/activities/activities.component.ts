import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivityService } from '../../services/activity.service';
import { Activity } from '../../models/models';

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit {
  activities: Activity[] = [];
  selectedActivity: Activity | null = null;
  isEditing = false;
  showForm = false;
  
  newActivity: Activity = this.getEmptyActivity();

  constructor(private activityService: ActivityService) {}

  ngOnInit(): void {
    this.loadActivities();
  }

  loadActivities(): void {
    this.activityService.getAll().subscribe({
      next: (data) => {
        this.activities = data.filter(a => !a.isDeleted);
      },
      error: (err) => console.error('Error loading activities:', err)
    });
  }

  getEmptyActivity(): Activity {
    return {
      activityID: 0,
      name: '',
      rules: '',
      isDeleted: false
    };
  }

  openAddForm(): void {
    this.newActivity = this.getEmptyActivity();
    this.isEditing = false;
    this.showForm = true;
  }

  openEditForm(activity: Activity): void {
    this.newActivity = { ...activity };
    this.isEditing = true;
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.newActivity = this.getEmptyActivity();
  }

  saveActivity(): void {
    if (this.isEditing) {
      this.activityService.update(this.newActivity.activityID, this.newActivity).subscribe({
        next: () => {
          this.loadActivities();
          this.closeForm();
          alert('Activity updated successfully!');
        },
        error: (err) => {
          console.error('Error updating activity:', err);
          alert('Error updating activity');
        }
      });
    } else {
      this.activityService.create(this.newActivity).subscribe({
        next: () => {
          this.loadActivities();
          this.closeForm();
          alert('Activity created successfully!');
        },
        error: (err) => {
          console.error('Error creating activity:', err);
          alert('Error creating activity');
        }
      });
    }
  }

  deleteActivity(id: number): void {
    if (confirm('Are you sure you want to delete this activity?')) {
      this.activityService.delete(id).subscribe({
        next: () => {
          this.loadActivities();
          alert('Activity deleted successfully!');
        },
        error: (err) => {
          console.error('Error deleting activity:', err);
          alert('Error deleting activity');
        }
      });
    }
  }
}
