import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiGenericService } from '../../services/api-generic.service';
import { Organization } from '../../model/organization.model';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.sass'],
  standalone: true,
  imports: [CommonModule]
})
export class OrganizationComponent implements OnInit {
  organizations: Organization[] = [];
  private organizationsApiUrl = 'https://localhost:7209/api/Organizations';

  constructor(private apiService: ApiGenericService<Organization>) {}

  ngOnInit(): void {
    this.apiService.setApiUrl(this.organizationsApiUrl);
    this.apiService.getAll().subscribe(data => {
      this.organizations = data;
    });
  }
}
