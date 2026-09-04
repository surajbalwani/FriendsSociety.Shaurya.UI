import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { RoleService } from '../../services/role.service';
import { AbilityTypeService } from '../../services/ability-type.service';
import { OrganizationService } from '../../services/organization.service';
import { User, UserCreate, Role, AbilityType, Organization } from '../../models/models';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  roles: Role[] = [];
  abilityTypes: AbilityType[] = [];
  organizations: Organization[] = [];
  
  isEditing = false;
  showForm = false;
  
  newUser: UserCreate = this.getEmptyUserCreate();

  // Filter properties
  selectedOrganization: number = 0;
  selectedAbilityType: number = 0;

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private abilityTypeService: AbilityTypeService,
    private organizationService: OrganizationService
  ) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    console.log('UsersComponent: Loading all data...');
    forkJoin({
      users: this.userService.getAll(),
      roles: this.roleService.getAll(),
      abilityTypes: this.abilityTypeService.getAll(),
      organizations: this.organizationService.getAll()
    }).subscribe({
      next: (data) => {
        console.log('UsersComponent: Received data:', {
          users: data.users.length,
          roles: data.roles.length,
          abilityTypes: data.abilityTypes.length,
          organizations: data.organizations.length
        });
        
        this.roles = data.roles;
        this.abilityTypes = data.abilityTypes.filter(a => !a.isDeleted);
        this.organizations = data.organizations.filter(o => !o.isDeleted);
        this.users = data.users.filter(u => !u.isDeleted);
        
        console.log('UsersComponent: After filtering:', {
          users: this.users.length,
          roles: this.roles.length,
          abilityTypes: this.abilityTypes.length,
          organizations: this.organizations.length
        });
        
        this.applyFilters();
      },
      error: (err) => {
        console.error('UsersComponent: Error loading data:', err);
      }
    });
  }

  loadUsers(): void {
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users = data.filter(u => !u.isDeleted);
        this.applyFilters();
      },
      error: (err) => console.error('Error loading users:', err)
    });
  }

  applyFilters(): void {
    console.log('UsersComponent: Applying filters');
    let filtered = [...this.users];
    console.log('UsersComponent: Starting with users:', filtered.length);

    // Organization filter
    const orgId = Number(this.selectedOrganization);
    if (orgId > 0) {
      filtered = filtered.filter(u => u.organizationID === orgId);
    }

    // Ability type filter
    const abilityId = Number(this.selectedAbilityType);
    if (abilityId > 0) {
      filtered = filtered.filter(u => u.abilityTypeID === abilityId);
    }

    this.filteredUsers = filtered;
    console.log('UsersComponent: Final filtered users:', this.filteredUsers.length);
  }

  onOrganizationChange(): void {
    this.applyFilters();
  }

  onAbilityTypeChange(): void {
    this.applyFilters();
  }

  clearAllFilters(): void {
    this.selectedOrganization = 0;
    this.selectedAbilityType = 0;
    this.applyFilters();
  }

  getEmptyUserCreate(): UserCreate {
    return {
      userName: '',
      email: '',
      password: '',
      age: 0,
      bloodGroup: '',
      address: '',
      contactNo: '',
      whatsappNumber: '',
      abilityTypeID: 0,
      organizationID: 0
    };
  }

  openAddForm(): void {
    this.newUser = this.getEmptyUserCreate();
    this.isEditing = false;
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.newUser = this.getEmptyUserCreate();
  }

  saveUser(): void {
    this.userService.create(this.newUser).subscribe({
      next: () => {
        this.loadUsers();
        this.closeForm();
        alert('User created successfully!');
      },
      error: (err) => {
        console.error('Error creating user:', err);
        alert('Error creating user');
      }
    });
  }

  deleteUser(id: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.delete(id).subscribe({
        next: () => {
          this.loadUsers();
          alert('User deleted successfully!');
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          alert('Error deleting user');
        }
      });
    }
  }

  get hasActiveFilters(): boolean {
    return this.selectedOrganization > 0 || 
           this.selectedAbilityType > 0;
  }
}
