import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivityCategoryService } from '../../services/activity-category.service';
import { ActivityService } from '../../services/activity.service';
import { AbilityTypeService } from '../../services/ability-type.service';
import { ActivityCategory, Activity, AbilityType } from '../../models/models';

@Component({
  selector: 'app-activity-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="header">
        <h1>Activity Categories</h1>
        <p class="subtitle">Link activities with ability types to define eligibility</p>
        <button class="btn btn-primary" (click)="openAddForm()">+ Add Category</button>
      </div>

      <div class="table-container" *ngIf="!showForm">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Activity</th>
              <th>Ability Type</th>
              <th>Exclusion Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let cat of categories">
              <td>{{ cat.activityCategoryID }}</td>
              <td>{{ getActivityName(cat.activityID) }}</td>
              <td>{{ getAbilityTypeName(cat.abilityTypeID) }}</td>
              <td>{{ cat.exclusionType || 'Inclusive' }}</td>
              <td class="actions">
                <button class="btn btn-edit" (click)="openEditForm(cat)">Edit</button>
                <button class="btn btn-delete" (click)="delete(cat.activityCategoryID)">Delete</button>
              </td>
            </tr>
            <tr *ngIf="categories.length === 0">
              <td colspan="5" class="no-data">No activity categories found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="form-container" *ngIf="showForm">
        <div class="form-header">
          <h2>{{ isEditing ? 'Edit' : 'Add' }} Activity Category</h2>
          <button class="btn btn-close" (click)="closeForm()">✕</button>
        </div>
        <form (ngSubmit)="save()" #form="ngForm">
          <div class="form-group">
            <label>Activity *</label>
            <select [(ngModel)]="current.activityID" name="activity" required>
              <option value="0" disabled>Select activity</option>
              <option *ngFor="let activity of activities" [value]="activity.activityID">
                {{ activity.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Ability Type *</label>
            <select [(ngModel)]="current.abilityTypeID" name="abilityType" required>
              <option value="0" disabled>Select ability type</option>
              <option *ngFor="let type of abilityTypes" [value]="type.abilityTypeID">
                {{ type.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Exclusion Type</label>
            <select [(ngModel)]="current.exclusionType" name="exclusionType">
              <option value="">Inclusive</option>
              <option value="Exclusive">Exclusive</option>
              <option value="Modified">Modified Rules</option>
            </select>
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" (click)="closeForm()">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="!form.valid">Save</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`@import '../users/users.component.scss';
    .container { padding: 20px; max-width: 1400px; margin: 0 auto; }
    .subtitle { color: #666; margin-bottom: 20px; }
  `]
})
export class ActivityCategoriesComponent implements OnInit {
  categories: ActivityCategory[] = [];
  activities: Activity[] = [];
  abilityTypes: AbilityType[] = [];
  current: ActivityCategory = this.getEmpty();
  isEditing = false;
  showForm = false;

  constructor(
    private service: ActivityCategoryService,
    private activityService: ActivityService,
    private abilityTypeService: AbilityTypeService
  ) {}

  ngOnInit(): void {
    this.load();
    this.loadActivities();
    this.loadAbilityTypes();
  }

  load(): void {
    this.service.getAll().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error(err)
    });
  }

  loadActivities(): void {
    this.activityService.getAll().subscribe({
      next: (data) => this.activities = data.filter(a => !a.isDeleted),
      error: (err) => console.error(err)
    });
  }

  loadAbilityTypes(): void {
    this.abilityTypeService.getAll().subscribe({
      next: (data) => this.abilityTypes = data.filter(a => !a.isDeleted),
      error: (err) => console.error(err)
    });
  }

  getEmpty(): ActivityCategory {
    return { 
      activityCategoryID: 0, 
      activityID: 0, 
      abilityTypeID: 0, 
      exclusionType: '' 
    };
  }

  getActivityName(id: number): string {
    return this.activities.find(a => a.activityID === id)?.name || 'Unknown';
  }

  getAbilityTypeName(id: number): string {
    return this.abilityTypes.find(a => a.abilityTypeID === id)?.name || 'Unknown';
  }

  openAddForm(): void {
    this.current = this.getEmpty();
    this.isEditing = false;
    this.showForm = true;
  }

  openEditForm(item: ActivityCategory): void {
    this.current = { ...item };
    this.isEditing = true;
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
  }

  save(): void {
    const obs = this.isEditing 
      ? this.service.update(this.current.activityCategoryID, this.current)
      : this.service.create(this.current);
    
    obs.subscribe({
      next: () => {
        this.load();
        this.closeForm();
        alert('Activity category saved successfully!');
      },
      error: () => alert('Error saving activity category')
    });
  }

  delete(id: number): void {
    if (confirm('Delete this category?')) {
      this.service.delete(id).subscribe({
        next: () => {
          this.load();
          alert('Category deleted!');
        },
        error: () => alert('Error deleting category')
      });
    }
  }
}
