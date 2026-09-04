import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../model/user.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  userForm: FormGroup;
  showForm = false;
  isSubmitting = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
  ) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      age: ['', [Validators.required, Validators.min(1), Validators.max(120)]],
      contact: ['', [Validators.required, Validators.minLength(10)]],
      roleID: ['', [Validators.required]],
      abilityTypeID: ['', [Validators.required]],
      organizationID: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.showMessage('Error loading users', 'error');
      },
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.userForm.reset();
      this.message = '';
    }
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.isSubmitting = true;
      const newUser: Partial<User> = {
        name: this.userForm.value.name,
        age: parseInt(this.userForm.value.age),
        contact: this.userForm.value.contact,
        roleID: parseInt(this.userForm.value.roleID),
        abilityTypeID: parseInt(this.userForm.value.abilityTypeID),
        organizationID: parseInt(this.userForm.value.organizationID),
        isDeleted: false,
      };

      this.userService.add(newUser as User).subscribe({
        next: (createdUser) => {
          this.users.push(createdUser);
          this.userForm.reset();
          this.showForm = false;
          this.showMessage('User created successfully!', 'success');
        },
        error: (error) => {
          console.error('Error creating user:', error);
          this.showMessage('Error creating user. Please try again.', 'error');
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

  trackByUserID(index: number, user: User): number {
    return user.userID;
  }
}
