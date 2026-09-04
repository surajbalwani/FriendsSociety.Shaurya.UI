import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./components/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'members',
    loadComponent: () => import('./components/members/members.component').then((m) => m.MembersComponent),
  },
  {
    path: 'events',
    loadComponent: () => import('./components/events/events.component').then((m) => m.EventsComponent),
  },
  {
    path: 'contact',
    loadComponent: () => import('./components/contact/contact.component').then((m) => m.ContactComponent),
  },
  {
    path: 'administration',
    loadComponent: () => import('./administration/administration.component').then((m) => m.AdministrationComponent),
    children: [
      {
        path: 'users',
        loadComponent: () => import('./administration/users/users.component').then((m) => m.UsersComponent),
      },
      {
        path: 'roles',
        loadComponent: () => import('./administration/roles/roles.component').then((m) => m.RolesComponent),
      },
      {
        path: 'activities',
        loadComponent: () =>
          import('./administration/activities/activities.component').then((m) => m.ActivitiesComponent),
      },
      {
        path: 'grounds',
        loadComponent: () => import('./administration/grounds/grounds.component').then((m) => m.GroundsComponent),
      },
      {
        path: 'ability-types',
        loadComponent: () =>
          import('./administration/ability-types/ability-types.component').then((m) => m.AbilityTypesComponent),
      },
      {
        path: 'organization',
        loadComponent: () =>
          import('./administration/organization/organization.component').then((m) => m.OrganizationComponent),
      },
      { path: '', redirectTo: 'users', pathMatch: 'full' },
    ],
  },
];
