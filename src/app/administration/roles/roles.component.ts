import { Component, OnInit } from '@angular/core';
import { ApiGenericService } from '../../services/api-generic.service';
import { Role } from '../../model/role.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.sass'],
  standalone: true,
  imports: [CommonModule],
})
export class RolesComponent implements OnInit {
  roles: Role[] = [];
  private roleApiUrl = 'https://localhost:7209/api/Roles';

  constructor(private apiService: ApiGenericService<Role>) {}

  ngOnInit(): void {
    this.apiService.setApiUrl(this.roleApiUrl);
    this.apiService.getAll().subscribe(data => {
      this.roles = data;
    });
  }
}
