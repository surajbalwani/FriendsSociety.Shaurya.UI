import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroundService } from '../../services/ground.service';
import { Ground } from '../../model/ground.model';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-grounds',
  templateUrl: './grounds.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class GroundsComponent implements OnInit {
  grounds: Ground[] = [];
  groundForm: FormGroup;
  showForm = false;
  isSubmitting = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  constructor(
    private groundService: GroundService,
    private fb: FormBuilder,
  ) {
    this.groundForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      location: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  ngOnInit(): void {
    this.loadGrounds();
  }

  loadGrounds(): void {
    this.groundService.getAll().subscribe({
      next: (data) => {
        this.grounds = data;
      },
      error: (error) => {
        console.error('Error loading grounds:', error);
        this.showMessage('Error loading grounds', 'error');
      },
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
        location: this.groundForm.value.location,
      };

      this.groundService.add(newGround as Ground).subscribe({
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
        },
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
