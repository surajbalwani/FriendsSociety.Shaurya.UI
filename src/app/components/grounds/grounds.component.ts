import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GroundService } from '../../services/ground.service';
import { Ground } from '../../models/models';

@Component({
  selector: 'app-grounds',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="header">
        <h1>Ground Management</h1>
        <button class="btn btn-primary" (click)="openAddForm()">+ Add Ground</button>
      </div>

      <div class="table-container" *ngIf="!showForm">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let ground of grounds">
              <td>{{ ground.groundID }}</td>
              <td>{{ ground.name }}</td>
              <td>{{ ground.location || 'N/A' }}</td>
              <td class="actions">
                <button class="btn btn-edit" (click)="openEditForm(ground)">Edit</button>
                <button class="btn btn-delete" (click)="delete(ground.groundID)">Delete</button>
              </td>
            </tr>
            <tr *ngIf="grounds.length === 0">
              <td colspan="4" class="no-data">No grounds found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="form-container" *ngIf="showForm">
        <div class="form-header">
          <h2>{{ isEditing ? 'Edit' : 'Add' }} Ground</h2>
          <button class="btn btn-close" (click)="closeForm()">✕</button>
        </div>
        <form (ngSubmit)="save()" #form="ngForm">
          <div class="form-group">
            <label>Ground Name *</label>
            <input type="text" [(ngModel)]="current.name" name="name" required placeholder="e.g., Main Stadium" />
          </div>
          <div class="form-group">
            <label>Location</label>
            <input type="text" [(ngModel)]="current.location" name="location" placeholder="Enter location address" />
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
  `]
})
export class GroundsComponent implements OnInit {
  grounds: Ground[] = [];
  current: Ground = this.getEmpty();
  isEditing = false;
  showForm = false;

  constructor(private service: GroundService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.service.getAll().subscribe({
      next: (data) => this.grounds = data,
      error: (err) => console.error(err)
    });
  }

  getEmpty(): Ground {
    return { groundID: 0, name: '', location: '' };
  }

  openAddForm(): void {
    this.current = this.getEmpty();
    this.isEditing = false;
    this.showForm = true;
  }

  openEditForm(item: Ground): void {
    this.current = { ...item };
    this.isEditing = true;
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
  }

  save(): void {
    const obs = this.isEditing 
      ? this.service.update(this.current.groundID, this.current)
      : this.service.create(this.current);
    
    obs.subscribe({
      next: () => {
        this.load();
        this.closeForm();
        alert('Ground saved successfully!');
      },
      error: () => alert('Error saving ground')
    });
  }

  delete(id: number): void {
    if (confirm('Delete this ground?')) {
      this.service.delete(id).subscribe({
        next: () => {
          this.load();
          alert('Ground deleted!');
        },
        error: () => alert('Error deleting ground')
      });
    }
  }
}
