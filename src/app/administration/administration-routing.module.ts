import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrganizationComponent } from './organization/organization.component';

const routes: Routes = [
  // ...existing routes...
  {
    path: 'organization',
    component: OrganizationComponent
  }
  // ...existing routes...
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }
