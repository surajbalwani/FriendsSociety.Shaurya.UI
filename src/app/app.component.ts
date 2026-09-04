import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Shaurya - Activity Management System';
  isSidebarOpen = true;

  constructor(public authService: AuthService, private router: Router) {}

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }

  get currentUser() {
    return this.authService.currentUserValue;
  }

  get isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  get isAdmin() {
    return this.authService.isAdmin();
  }

  get isVolunteer() {
    return this.authService.isVolunteer();
  }

  get isSchoolTeacher() {
    return this.authService.isSchoolTeacher();
  }
}
