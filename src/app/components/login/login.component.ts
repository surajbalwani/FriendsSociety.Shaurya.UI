import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  errorMessage = '';
  returnUrl = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';

    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.navigateBasedOnRole();
    }
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter both username and password';
      return;
    }

    const success = this.authService.login(this.username, this.password);

    if (success) {
      this.navigateBasedOnRole();
    } else {
      this.errorMessage = 'Invalid username or password';
      this.password = ''; // Clear password on failed attempt
    }
  }

  private navigateBasedOnRole(): void {
    if (this.authService.isSchoolTeacher()) {
      // SchoolTeacher goes directly to registration
      this.router.navigate(['/registration']);
    } else if (this.returnUrl && this.returnUrl !== '/login') {
      // Others go to their intended destination
      this.router.navigate([this.returnUrl]);
    } else {
      // Default to dashboard
      this.router.navigate(['/dashboard']);
    }
  }
}
