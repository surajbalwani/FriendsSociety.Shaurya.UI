import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GroundAllocationService } from '../../services/ground-allocation.service';
import { GroundService } from '../../services/ground.service';
import { ActivityService } from '../../services/activity.service';
import { GroundAllocation, Ground, Activity } from '../../models/models';

@Component({
  selector: 'app-ground-allocations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ground-allocations.component.html',
  styleUrls: ['./ground-allocations.component.scss']
})
export class GroundAllocationsComponent implements OnInit {
  allocations: GroundAllocation[] = [];
  grounds: Ground[] = [];
  activities: Activity[] = [];
  
  isEditing = false;
  showForm = false;
  
  newAllocation: GroundAllocation = this.getEmptyAllocation();

  constructor(
    private allocationService: GroundAllocationService,
    private groundService: GroundService,
    private activityService: ActivityService
  ) {}

  ngOnInit(): void {
    this.loadAllocations();
    this.loadGrounds();
    this.loadActivities();
  }

  loadAllocations(): void {
    this.allocationService.getAll().subscribe({
      next: (data) => {
        this.allocations = data.sort((a, b) => 
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );
      },
      error: (err) => console.error('Error loading allocations:', err)
    });
  }

  loadGrounds(): void {
    this.groundService.getAll().subscribe({
      next: (data) => this.grounds = data,
      error: (err) => console.error('Error loading grounds:', err)
    });
  }

  loadActivities(): void {
    this.activityService.getAll().subscribe({
      next: (data) => this.activities = data.filter(a => !a.isDeleted),
      error: (err) => console.error('Error loading activities:', err)
    });
  }

  getEmptyAllocation(): GroundAllocation {
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    
    return {
      groundAllocationID: 0,
      groundID: 0,
      activityID: 0,
      startTime: this.formatDateTimeLocal(now),
      endTime: this.formatDateTimeLocal(oneHourLater)
    };
  }

  formatDateTimeLocal(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  openAddForm(): void {
    this.newAllocation = this.getEmptyAllocation();
    this.isEditing = false;
    this.showForm = true;
  }

  openEditForm(allocation: GroundAllocation): void {
    this.newAllocation = { 
      ...allocation,
      startTime: this.formatDateTimeLocal(new Date(allocation.startTime)),
      endTime: this.formatDateTimeLocal(new Date(allocation.endTime))
    };
    this.isEditing = true;
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.newAllocation = this.getEmptyAllocation();
  }

  validateAllocation(): boolean {
    const start = new Date(this.newAllocation.startTime);
    const end = new Date(this.newAllocation.endTime);
    
    if (end <= start) {
      alert('End time must be after start time!');
      return false;
    }

    if (start < new Date() && !this.isEditing) {
      alert('Cannot schedule in the past!');
      return false;
    }

    // Check for overlapping allocations
    const hasConflict = this.allocations.some(alloc => {
      if (this.isEditing && alloc.groundAllocationID === this.newAllocation.groundAllocationID) {
        return false;
      }
      
      if (alloc.groundID !== this.newAllocation.groundID) {
        return false;
      }

      const allocStart = new Date(alloc.startTime);
      const allocEnd = new Date(alloc.endTime);

      return (start < allocEnd && end > allocStart);
    });

    if (hasConflict) {
      alert('This ground is already allocated during the selected time!');
      return false;
    }

    return true;
  }

  saveAllocation(): void {
    if (!this.validateAllocation()) {
      return;
    }

    if (this.isEditing) {
      this.allocationService.update(this.newAllocation.groundAllocationID, this.newAllocation).subscribe({
        next: () => {
          this.loadAllocations();
          this.closeForm();
          alert('Ground allocation updated successfully!');
        },
        error: (err) => {
          console.error('Error updating allocation:', err);
          alert('Error updating ground allocation');
        }
      });
    } else {
      this.allocationService.create(this.newAllocation).subscribe({
        next: () => {
          this.loadAllocations();
          this.closeForm();
          alert('Ground allocated successfully!');
        },
        error: (err) => {
          console.error('Error creating allocation:', err);
          alert('Error creating ground allocation');
        }
      });
    }
  }

  deleteAllocation(id: number): void {
    if (confirm('Are you sure you want to delete this allocation?')) {
      this.allocationService.delete(id).subscribe({
        next: () => {
          this.loadAllocations();
          alert('Allocation deleted successfully!');
        },
        error: (err) => {
          console.error('Error deleting allocation:', err);
          alert('Error deleting allocation');
        }
      });
    }
  }

  getGroundName(groundId: number): string {
    return this.grounds.find(g => g.groundID === groundId)?.name || 'Unknown';
  }

  getActivityName(activityId: number): string {
    return this.activities.find(a => a.activityID === activityId)?.name || 'Unknown';
  }

  formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  }

  getDuration(startTime: string, endTime: string): string {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diff = end.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  }

  isUpcoming(startTime: string): boolean {
    return new Date(startTime) > new Date();
  }
}
