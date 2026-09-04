import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AbilityTypeService } from '../../services/ability-type.service';
import { AbilityType } from '../../models/models';

@Component({
  selector: 'app-ability-types',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="header">
        <h1>Ability Type Management</h1>
        <button class="btn btn-primary" (click)="openAddForm()">+ Add Ability Type</button>
      </div>

      <div class="table-container" *ngIf="!showForm">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let type of abilityTypes">
              <td>{{ type.abilityTypeID }}</td>
              <td>{{ type.name }}</td>
              <td>{{ type.description || 'N/A' }}</td>
              <td class="actions">
                <button class="btn btn-edit" (click)="openEditForm(type)">Edit</button>
                <button class="btn btn-delete" (click)="delete(type.abilityTypeID)">Delete</button>
              </td>
            </tr>
            <tr *ngIf="abilityTypes.length === 0">
              <td colspan="4" class="no-data">No ability types found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="form-container" *ngIf="showForm">
        <div class="form-header">
          <h2>{{ isEditing ? 'Edit' : 'Add' }} Ability Type</h2>
          <button class="btn btn-close" (click)="closeForm()">✕</button>
        </div>
        <form (ngSubmit)="save()" #form="ngForm">
          <div class="form-group">
            <label>Name *</label>
            <input type="text" [(ngModel)]="current.name" name="name" required placeholder="e.g., Visually Impaired" />
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea [(ngModel)]="current.description" name="description" rows="4" placeholder="Describe the ability type..."></textarea>
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
    textarea { padding: 10px; border: 1px solid #ced4da; border-radius: 6px; font-family: inherit; resize: vertical; }
  `]
})
export class AbilityTypesComponent implements OnInit {
  abilityTypes: AbilityType[] = [];
  current: AbilityType = this.getEmpty();
  isEditing = false;
  showForm = false;

  constructor(private service: AbilityTypeService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.service.getAll().subscribe({
      next: (data) => this.abilityTypes = data.filter(a => !a.isDeleted),
      error: (err) => console.error(err)
    });
  }

  getEmpty(): AbilityType {
    return { abilityTypeID: 0, name: '', description: '', isDeleted: false };
  }

  openAddForm(): void {
    this.current = this.getEmpty();
    this.isEditing = false;
    this.showForm = true;
  }

  openEditForm(item: AbilityType): void {
    this.current = { ...item };
    this.isEditing = true;
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
  }

  save(): void {
    const obs = this.isEditing 
      ? this.service.update(this.current.abilityTypeID, this.current)
      : this.service.create(this.current);
    
    obs.subscribe({
      next: () => {
        this.load();
        this.closeForm();
        alert('Ability type saved successfully!');
      },
      error: () => alert('Error saving ability type')
    });
  }

  delete(id: number): void {
    if (confirm('Delete this ability type?')) {
      this.service.delete(id).subscribe({
        next: () => {
          this.load();
          alert('Ability type deleted!');
        },
        error: () => alert('Error deleting ability type')
      });
    }
  }
}
