import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrganizationService } from '../../services/organization.service';
import { Organization } from '../../models/models';

@Component({
  selector: 'app-organizations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="header">
        <h1>Organization Management</h1>
        <button class="btn btn-primary" (click)="openAddForm()">+ Add Organization</button>
      </div>

      <div class="table-container" *ngIf="!showForm">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Contact</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let org of organizations">
              <td>{{ org.organizationID }}</td>
              <td>{{ org.name }}</td>
              <td>{{ org.contact || 'N/A' }}</td>
              <td class="actions">
                <button class="btn btn-edit" (click)="openEditForm(org)">Edit</button>
                <button class="btn btn-delete" (click)="delete(org.organizationID)">Delete</button>
              </td>
            </tr>
            <tr *ngIf="organizations.length === 0">
              <td colspan="4" class="no-data">No organizations found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="form-container" *ngIf="showForm">
        <div class="form-header">
          <h2>{{ isEditing ? 'Edit' : 'Add' }} Organization</h2>
          <button class="btn btn-close" (click)="closeForm()">✕</button>
        </div>
        <form (ngSubmit)="save()" #form="ngForm">
          <div class="form-group">
            <label>Name *</label>
            <input type="text" [(ngModel)]="current.name" name="name" required />
          </div>
          <div class="form-group">
            <label>Contact</label>
            <input type="text" [(ngModel)]="current.contact" name="contact" />
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
export class OrganizationsComponent implements OnInit {
  organizations: Organization[] = [];
  current: Organization = this.getEmpty();
  isEditing = false;
  showForm = false;

  constructor(private service: OrganizationService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.service.getAll().subscribe({
      next: (data) => this.organizations = data.filter(o => !o.isDeleted),
      error: (err) => console.error(err)
    });
  }

  getEmpty(): Organization {
    return { organizationID: 0, name: '', contact: '', isDeleted: false };
  }

  openAddForm(): void {
    this.current = this.getEmpty();
    this.isEditing = false;
    this.showForm = true;
  }

  openEditForm(item: Organization): void {
    this.current = { ...item };
    this.isEditing = true;
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
  }

  save(): void {
    const obs = this.isEditing 
      ? this.service.update(this.current.organizationID, this.current)
      : this.service.create(this.current);
    
    obs.subscribe({
      next: () => {
        this.load();
        this.closeForm();
        alert('Organization saved successfully!');
      },
      error: () => alert('Error saving organization')
    });
  }

  delete(id: number): void {
    if (confirm('Delete this organization?')) {
      this.service.delete(id).subscribe({
        next: () => {
          this.load();
          alert('Organization deleted!');
        },
        error: () => alert('Error deleting organization')
      });
    }
  }
}
