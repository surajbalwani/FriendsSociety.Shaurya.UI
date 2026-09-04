import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UsersComponent } from './components/users/users.component';
import { ActivitiesComponent } from './components/activities/activities.component';
import { GroundAllocationsComponent } from './components/ground-allocations/ground-allocations.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { DutyComponent } from './components/duty/duty.component';
import { ParticipantsComponent } from './components/participants/participants.component';
import { VolunteersComponent } from './components/volunteers/volunteers.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'ground-allocations', 
    component: GroundAllocationsComponent,
    canActivate: [authGuard] // Both admin and volunteer can access
  },
  // SchoolTeacher-only route
  {
    path: 'registration',
    component: RegistrationComponent,
    canActivate: [authGuard] // SchoolTeacher can access
  },
  // Admin-only routes
  {
    path: 'duty',
    component: DutyComponent,
    canActivate: [roleGuard] // Admin only
  },
  { 
    path: 'users', 
    component: UsersComponent,
    canActivate: [roleGuard] // Role-based guard
  },
  { 
    path: 'participants', 
    component: ParticipantsComponent,
    canActivate: [roleGuard] // Admin only
  },
  { 
    path: 'volunteers', 
    component: VolunteersComponent,
    canActivate: [roleGuard] // Admin only
  },
  { 
    path: 'activities', 
    component: ActivitiesComponent,
    canActivate: [roleGuard]
  },
  { 
    path: 'roles', 
    loadComponent: () => import('./components/roles/roles.component').then(m => m.RolesComponent),
    canActivate: [roleGuard]
  },
  { 
    path: 'organizations', 
    loadComponent: () => import('./components/organizations/organizations.component').then(m => m.OrganizationsComponent),
    canActivate: [roleGuard]
  },
  { 
    path: 'ability-types', 
    loadComponent: () => import('./components/ability-types/ability-types.component').then(m => m.AbilityTypesComponent),
    canActivate: [roleGuard]
  },
  { 
    path: 'grounds', 
    loadComponent: () => import('./components/grounds/grounds.component').then(m => m.GroundsComponent),
    canActivate: [roleGuard]
  },
  { 
    path: 'activity-categories', 
    loadComponent: () => import('./components/activity-categories/activity-categories.component').then(m => m.ActivityCategoriesComponent),
    canActivate: [roleGuard]
  },
  { 
    path: 'games', 
    loadComponent: () => import('./components/game-management/game-management.component').then(m => m.GameManagementComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'games/participation', 
    loadComponent: () => import('./components/game-participation/game-participation.component').then(m => m.GameParticipationComponent),
    canActivate: [authGuard]
  }
];
