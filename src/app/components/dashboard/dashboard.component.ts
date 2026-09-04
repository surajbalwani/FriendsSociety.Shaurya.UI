import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { ActivityService } from '../../services/activity.service';
import { GroundService } from '../../services/ground.service';
import { GroundAllocationService } from '../../services/ground-allocation.service';
import { OrganizationService } from '../../services/organization.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats = {
    totalUsers: 0,
    totalActivities: 0,
    totalGrounds: 0,
    upcomingAllocations: 0,
    totalOrganizations: 0
  };

  recentAllocations: any[] = [];
  usersByAbilityType: any[] = [];
  loading = true;

  constructor(
    private userService: UserService,
    private activityService: ActivityService,
    private groundService: GroundService,
    private allocationService: GroundAllocationService,
    private organizationService: OrganizationService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    forkJoin({
      users: this.userService.getAll(),
      activities: this.activityService.getAll(),
      grounds: this.groundService.getAll(),
      allocations: this.allocationService.getAll(),
      organizations: this.organizationService.getAll()
    }).subscribe({
      next: (data) => {
        this.stats.totalUsers = data.users.filter(u => !u.isDeleted).length;
        this.stats.totalActivities = data.activities.filter(a => !a.isDeleted).length;
        this.stats.totalGrounds = data.grounds.length;
        this.stats.totalOrganizations = data.organizations.filter(o => !o.isDeleted).length;
        
        const now = new Date();
        this.stats.upcomingAllocations = data.allocations.filter(
          a => new Date(a.startTime) > now
        ).length;

        this.recentAllocations = data.allocations
          .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
          .slice(0, 5);

        this.calculateUsersByAbilityType(data.users);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard data:', err);
        this.loading = false;
      }
    });
  }

  calculateUsersByAbilityType(users: any[]): void {
    const abilityMap = new Map<number, { name: string, count: number }>();
    
    users.filter(u => !u.isDeleted).forEach(user => {
      if (user.abilityType) {
        const key = user.abilityTypeID;
        if (abilityMap.has(key)) {
          abilityMap.get(key)!.count++;
        } else {
          abilityMap.set(key, { name: user.abilityType.name || 'Unknown', count: 1 });
        }
      }
    });

    this.usersByAbilityType = Array.from(abilityMap.values());
  }

  formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  }

  isUpcoming(startTime: string): boolean {
    return new Date(startTime) > new Date();
  }
}
