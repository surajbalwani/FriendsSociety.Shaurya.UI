import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  username: string;
  role: string;
  isAuthenticated: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  // Multiple users with roles
  private users = [
    { username: 'utsavpal', password: 'utsav123', role: 'admin' },
    { username: 'amansharma', password: 'aman123', role: 'volunteer' },
    { username: 'teacher', password: 'teacher123', role: 'schoolteacher' }
  ];

  constructor() {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): boolean {
    const user = this.users.find(u => 
      u.username === username && u.password === password
    );

    if (user) {
      const authenticatedUser: User = {
        username: user.username,
        role: user.role,
        isAuthenticated: true
      };
      localStorage.setItem('currentUser', JSON.stringify(authenticatedUser));
      this.currentUserSubject.next(authenticatedUser);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserValue?.isAuthenticated || false;
  }

  hasRole(role: string): boolean {
    return this.currentUserValue?.role === role;
  }

  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  isVolunteer(): boolean {
    return this.hasRole('volunteer');
  }

  isSchoolTeacher(): boolean {
    return this.hasRole('schoolteacher');
  }

  canAccessRoute(route: string): boolean {
    const user = this.currentUserValue;
    if (!user) return false;

    // Admin can access everything
    if (user.role === 'admin') return true;

    // Volunteer can only access ground allocations and dashboard
    if (user.role === 'volunteer') {
      const allowedRoutes = ['/dashboard', '/ground-allocations', '/login'];
      return allowedRoutes.includes(route);
    }

    // SchoolTeacher can only access registration
    if (user.role === 'schoolteacher') {
      const allowedRoutes = ['/registration', '/login'];
      return allowedRoutes.includes(route);
    }

    return false;
  }
}
