import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    RouterLinkActive,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent {
  registerForm: FormGroup;
  hidePassword = true;
  passwordErrors: { [key: string]: string } = {};
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { email, password } = this.registerForm.value;
      this.authService.register({ email, password })
        .subscribe({
          next: () => {
            this.snackBar.open('Registration successful! Please log in.', 'Close', {
              duration: 5000,
              panelClass: ['success-snackbar']
            });
            this.router.navigate(['/auth/login']);
          },
          error: (error) => {
            if (Array.isArray(error?.error)) {
              this.handlePasswordErrors(error.error);
            } else {
              this.snackBar.open('Registration failed. Please try again.', 'Close', {
                duration: 5000,
                panelClass: ['error-snackbar']
              });
            }
          }
        });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  private handlePasswordErrors(errors: Array<{code: string, description: string}>) {
    this.passwordErrors = {};
    errors.forEach(error => {
      switch(error.code) {
        case 'PasswordRequiresNonAlphanumeric':
          this.passwordErrors['special'] = error.description;
          break;
        case 'PasswordRequiresUpper':
          this.passwordErrors['uppercase'] = error.description;
          break;
        default:
          this.passwordErrors['general'] = error.description;
      }
    });
    
    // Mark password field as touched to show errors
    this.registerForm.get('password')?.setErrors({ 'passwordRequirements': true });
    this.registerForm.get('password')?.markAsTouched();
  }

  getPasswordError(): string {
    if (this.registerForm.get('password')?.hasError('required')) {
      return 'Password is required';
    }
    if (this.registerForm.get('password')?.hasError('minlength')) {
      return 'Password must be at least 6 characters long';
    }
    if (this.registerForm.get('password')?.hasError('passwordRequirements')) {
      return Object.values(this.passwordErrors).join(' ');
    }
    return '';
  }

  getEmailError(): string {
    if (this.registerForm.get('email')?.hasError('required')) {
      return 'Email is required';
    }
    if (this.registerForm.get('email')?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    return '';
  }
}
