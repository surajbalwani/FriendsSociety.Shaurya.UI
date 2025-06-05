import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AdministrationComponent } from './administration/administration.component';
import { MembersComponent } from './components/members/members.component';
import { EventsComponent } from './components/events/events.component';
import { ContactComponent } from './components/contact/contact.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'members', component: MembersComponent },
  { path: 'events', component: EventsComponent },
  { path: 'contact', component: ContactComponent },
  {
    path: 'administration',
    component: AdministrationComponent,
    children: [
      {
        path: 'users',
        loadComponent: () => import('./administration/users/users.component').then(m => m.UsersComponent)
      },
      {
        path: 'roles',
        loadComponent: () => import('./administration/roles/roles.component').then(m => m.RolesComponent)
      },
      {
        path: 'activities',
        loadComponent: () => import('./administration/activities/activities.component').then(m => m.ActivitiesComponent)
      },
      {
        path: 'grounds',
        loadComponent: () => import('./administration/grounds/grounds.component').then(m => m.GroundsComponent)
      },
      {
        path: 'ability-types',
        loadComponent: () => import('./administration/ability-types/ability-types.component').then(m => m.AbilityTypesComponent)
      },
      {
        path: 'organization',
        loadComponent: () => import('./administration/organization/organization.component').then(m => m.OrganizationComponent)
      },
      { path: '', redirectTo: 'users', pathMatch: 'full' }
    ]
  }
];
