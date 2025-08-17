import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiGenericService } from '../../services/api-generic.service';
import { Ground } from '../../model/ground.model';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-grounds',
  templateUrl: './grounds.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class GroundsComponent implements OnInit {
  grounds: Ground[] = [];
  groundForm: FormGroup;
  showForm = false;
  isSubmitting = false;
  message = '';
  messageType: 'success' | 'error' = 'success';
  private groundsApiUrl = `${environment.apiBaseUrl}/Grounds`;

  constructor(
    private apiService: ApiGenericService<Ground>,
    private fb: FormBuilder
  ) {
    this.groundForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      location: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
    this.loadGrounds();
  }

  loadGrounds(): void {
    this.apiService.setApiUrl(this.groundsApiUrl);
    this.apiService.getAll().subscribe({
      next: (data) => {
        this.grounds = data;
      },
      error: (error) => {
        console.error('Error loading grounds:', error);
        this.showMessage('Error loading grounds', 'error');
      }
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.groundForm.reset();
      this.message = '';
    }
  }

  onSubmit(): void {
    if (this.groundForm.valid) {
      this.isSubmitting = true;
      const newGround: Partial<Ground> = {
        name: this.groundForm.value.name,
        location: this.groundForm.value.location
      };

      this.apiService.add(newGround as Ground).subscribe({
        next: (createdGround) => {
          this.grounds.push(createdGround);
          this.groundForm.reset();
          this.showForm = false;
          this.showMessage('Ground created successfully!', 'success');
        },
        error: (error) => {
          console.error('Error creating ground:', error);
          this.showMessage('Error creating ground. Please try again.', 'error');
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

  trackByGroundID(index: number, ground: Ground): number {
    return ground.groundID;
  }
}
