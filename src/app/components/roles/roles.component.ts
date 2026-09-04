import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoleService } from '../../services/role.service';
import { Role } from '../../models/models';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="header">
        <h1>Role Management</h1>
        <button class="btn btn-primary" (click)="openAddForm()">+ Add Role</button>
      </div>

      <div class="table-container" *ngIf="!showForm">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Permissions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let role of roles">
              <td>{{ role.id }}</td>
              <td>{{ role.name }}</td>
              <td>{{ role.permissions || 'N/A' }}</td>
              <td class="actions">
                <button class="btn btn-edit" (click)="openEditForm(role)">Edit</button>
                <button class="btn btn-delete" (click)="delete(role.id)">Delete</button>
              </td>
            </tr>
            <tr *ngIf="roles.length === 0">
              <td colspan="4" class="no-data">No roles found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="form-container" *ngIf="showForm">
        <div class="form-header">
          <h2>{{ isEditing ? 'Edit' : 'Add' }} Role</h2>
          <button class="btn btn-close" (click)="closeForm()">✕</button>
        </div>
        <form (ngSubmit)="save()" #form="ngForm">
          <div class="form-group">
            <label>Name *</label>
            <input type="text" [(ngModel)]="current.name" name="name" required />
          </div>
          <div class="form-group">
            <label>Permissions</label>
            <textarea [(ngModel)]="current.permissions" name="permissions" rows="4"></textarea>
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
export class RolesComponent implements OnInit {
  roles: Role[] = [];
  current: Role = this.getEmpty();
  isEditing = false;
  showForm = false;

  constructor(private service: RoleService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.service.getAll().subscribe({
      next: (data) => this.roles = data,
      error: (err) => console.error(err)
    });
  }

  getEmpty(): Role {
    return { id: '', name: '', permissions: '' };
  }

  openAddForm(): void {
    this.current = this.getEmpty();
    this.isEditing = false;
    this.showForm = true;
  }

  openEditForm(item: Role): void {
    this.current = { ...item };
    this.isEditing = true;
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
  }

  save(): void {
    const obs = this.isEditing 
      ? this.service.update(this.current.id, this.current)
      : this.service.create(this.current);
    
    obs.subscribe({
      next: () => {
        this.load();
        this.closeForm();
        alert('Role saved successfully!');
      },
      error: (err) => alert('Error saving role')
    });
  }

  delete(id: string): void {
    if (confirm('Delete this role?')) {
      this.service.delete(id).subscribe({
        next: () => {
          this.load();
          alert('Role deleted!');
        },
        error: () => alert('Error deleting role')
      });
    }
  }
}
