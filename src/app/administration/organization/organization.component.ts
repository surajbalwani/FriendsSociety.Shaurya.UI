import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiGenericService } from '../../services/api-generic.service';
import { Organization } from '../../model/organization.model';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class OrganizationComponent implements OnInit {
  organizations: Organization[] = [];
  organizationForm: FormGroup;
  showForm = false;
  isSubmitting = false;
  message = '';
  messageType: 'success' | 'error' = 'success';
  private organizationsApiUrl = `${environment.apiBaseUrl}/Organizations`;

  constructor(
    private apiService: ApiGenericService<Organization>,
    private fb: FormBuilder
  ) {
    this.organizationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      contact: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
    this.loadOrganizations();
  }

  loadOrganizations(): void {
    this.apiService.setApiUrl(this.organizationsApiUrl);
    this.apiService.getAll().subscribe({
      next: (data) => {
        this.organizations = data;
      },
      error: (error) => {
        console.error('Error loading organizations:', error);
        this.showMessage('Error loading organizations', 'error');
      }
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.organizationForm.reset();
      this.message = '';
    }
  }

  onSubmit(): void {
    if (this.organizationForm.valid) {
      this.isSubmitting = true;
      const newOrganization: Partial<Organization> = {
        name: this.organizationForm.value.name,
        contact: this.organizationForm.value.contact
      };

      this.apiService.add(newOrganization as Organization).subscribe({
        next: (createdOrganization) => {
          this.organizations.push(createdOrganization);
          this.organizationForm.reset();
          this.showForm = false;
          this.showMessage('Organization created successfully!', 'success');
        },
        error: (error) => {
          console.error('Error creating organization:', error);
          this.showMessage('Error creating organization. Please try again.', 'error');
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

  trackByOrganizationID(index: number, organization: Organization): number {
    return organization.organizationID;
  }
}
