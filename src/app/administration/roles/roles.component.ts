import { Component, OnInit } from '@angular/core';
import { ApiGenericService } from '../../services/api-generic.service';
import { Role } from '../../model/role.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class RolesComponent implements OnInit {
  roles: Role[] = [];
  roleForm: FormGroup;
  showForm = false;
  isSubmitting = false;
  message = '';
  messageType: 'success' | 'error' = 'success';
  private roleApiUrl = `${environment.apiBaseUrl}/Roles`;

  constructor(
    private apiService: ApiGenericService<Role>,
    private fb: FormBuilder
  ) {
    this.roleForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.apiService.setApiUrl(this.roleApiUrl);
    this.apiService.getAll().subscribe({
      next: (data) => {
        this.roles = data;
      },
      error: (error) => {
        console.error('Error loading roles:', error);
        this.showMessage('Error loading roles', 'error');
      }
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.roleForm.reset();
      this.message = '';
    }
  }

  onSubmit(): void {
    if (this.roleForm.valid) {
      this.isSubmitting = true;
      const newRole: Partial<Role> = {
        name: this.roleForm.value.name
      };

      this.apiService.add(newRole as Role).subscribe({
        next: (createdRole) => {
          this.roles.push(createdRole);
          this.roleForm.reset();
          this.showForm = false;
          this.showMessage('Role created successfully!', 'success');
        },
        error: (error) => {
          console.error('Error creating role:', error);
          this.showMessage('Error creating role. Please try again.', 'error');
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

  trackByRoleID(index: number, role: Role): number {
    return role.roleID;
  }
}
