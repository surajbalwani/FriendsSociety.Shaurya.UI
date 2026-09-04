import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeamAssignmentService } from '../../services/team-assignment.service';
import { VolunteerService } from '../../services/volunteer.service';
import { GroundService } from '../../services/ground.service';
import { TeamAssignment, Volunteer, Ground } from '../../models/models';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-duty',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './duty.component.html',
  styleUrls: ['./duty.component.scss']
})
export class DutyComponent implements OnInit {
  activeTab: 'teams' | 'grounds' = 'teams';
  
  teams: TeamAssignment[] = [];
  volunteers: Volunteer[] = [];
  grounds: Ground[] = [];
  showTeamForm = false;
  
  newTeam: TeamAssignment = this.getEmptyTeam();
  selectedMembers: number[] = [];
  
  constructor(
    private teamService: TeamAssignmentService,
    private volunteerService: VolunteerService,
    private groundService: GroundService
  ) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    forkJoin({
      teams: this.teamService.getAll(),
      volunteers: this.volunteerService.getAll(),
      grounds: this.groundService.getAll()
    }).subscribe({
      next: (data) => {
        this.teams = data.teams;
        this.grounds = data.grounds;
        this.volunteers = data.volunteers.filter(v => !v.isDeleted);
      },
      error: (err) => console.error('Error loading data:', err)
    });
  }

  switchTab(tab: 'teams' | 'grounds'): void {
    this.activeTab = tab;
  }

  getEmptyTeam(): TeamAssignment {
    return {
      teamAssignmentID: 0,
      teamName: '',
      leaderID: 0,
      memberIDs: '',
      groundID: undefined,
      isDeleted: false
    };
  }

  openTeamForm(): void {
    this.newTeam = this.getEmptyTeam();
    this.selectedMembers = [];
    this.showTeamForm = true;
  }

  closeTeamForm(): void {
    this.showTeamForm = false;
    this.newTeam = this.getEmptyTeam();
    this.selectedMembers = [];
  }

  toggleMember(volunteerId: number): void {
    const index = this.selectedMembers.indexOf(volunteerId);
    if (index > -1) {
      this.selectedMembers.splice(index, 1);
    } else {
      this.selectedMembers.push(volunteerId);
    }
  }

  isMemberSelected(volunteerId: number): boolean {
    return this.selectedMembers.includes(volunteerId);
  }

  saveTeam(): void {
    if (!this.newTeam.teamName || !this.newTeam.leaderID || this.selectedMembers.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill in all required fields and select at least one member!'
      });
      return;
    }

    const filteredMembers = this.selectedMembers.filter(id => id !== this.newTeam.leaderID);
    this.newTeam.memberIDs = filteredMembers.join(',');
    
    this.teamService.create(this.newTeam).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Team created successfully!',
          timer: 2000,
          showConfirmButton: false
        });
        this.loadAllData();
        this.closeTeamForm();
      },
      error: (err) => {
        console.error('Error creating team:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to create team. Please try again.'
        });
      }
    });
  }

  async showTeamDetails(teamId: number): Promise<void> {
    try {
      const teamDetails = await this.teamService.getTeamMembers(teamId).toPromise();
      
      if (!teamDetails) return;

      const membersList = teamDetails.members.map(m => 
        `<li style="text-align: left; padding: 5px 0;">
          <strong>${m.name}</strong> ${m.contact ? `- ${m.contact}` : ''}
        </li>`
      ).join('');

      Swal.fire({
        title: `<strong>${teamDetails.teamName}</strong>`,
        html: `
          <div style="text-align: left; padding: 10px;">
            <div style="background: #e3f2fd; padding: 10px; border-radius: 8px; margin-bottom: 15px;">
              <h4 style="margin: 0 0 5px 0; color: #1976d2;">👑 Leader</h4>
              <p style="margin: 0; font-size: 16px;"><strong>${teamDetails.leaderName}</strong></p>
            </div>
            
            <div style="background: #f3e5f5; padding: 10px; border-radius: 8px; margin-bottom: 15px;">
              <h4 style="margin: 0 0 5px 0; color: #7b1fa2;">👥 Team Members (${teamDetails.memberCount})</h4>
              <ul style="margin: 10px 0; padding-left: 20px;">
                ${membersList}
              </ul>
            </div>
            
            ${teamDetails.groundName ? `
              <div style="background: #e8f5e9; padding: 10px; border-radius: 8px;">
                <h4 style="margin: 0 0 5px 0; color: #388e3c;">📍 Assigned Ground</h4>
                <p style="margin: 0; font-size: 16px;"><strong>${teamDetails.groundName}</strong></p>
              </div>
            ` : `
              <div style="background: #fff3e0; padding: 10px; border-radius: 8px;">
                <h4 style="margin: 0 0 5px 0; color: #f57c00;">⚠️ No Ground Assigned</h4>
              </div>
            `}
          </div>
        `,
        width: 600,
        confirmButtonText: 'Close',
        confirmButtonColor: '#667eea'
      });
    } catch (error) {
      console.error('Error loading team details:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load team details.'
      });
    }
  }

  getMemberCount(team: TeamAssignment): number {
    if (!team.memberIDs) return 0;
    return team.memberIDs.split(',').filter(id => id.trim()).length;
  }

  deleteTeam(teamId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this team?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#95a5a6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.teamService.delete(teamId).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Team has been deleted.',
              timer: 2000,
              showConfirmButton: false
            });
            this.loadAllData();
          },
          error: (err) => {
            console.error('Error deleting team:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to delete team.'
            });
          }
        });
      }
    });
  }

  assignGroundToTeam(teamId: number): void {
    const team = this.teams.find(t => t.teamAssignmentID === teamId);
    if (!team) return;

    const groundOptions = this.grounds.reduce((obj: any, ground) => {
      obj[ground.groundID] = ground.name;
      return obj;
    }, {});

    Swal.fire({
      title: `Assign Ground to ${team.teamName}`,
      input: 'select',
      inputOptions: groundOptions,
      inputPlaceholder: 'Select a ground',
      showCancelButton: true,
      confirmButtonText: 'Assign',
      confirmButtonColor: '#667eea',
      inputValidator: (value) => {
        if (!value) {
          return 'You need to select a ground!';
        }
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.teamService.assignGround(teamId, parseInt(result.value)).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Assigned!',
              text: 'Ground has been assigned to the team.',
              timer: 2000,
              showConfirmButton: false
            });
            this.loadAllData();
          },
          error: (err) => {
            console.error('Error assigning ground:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to assign ground.'
            });
          }
        });
      }
    });
  }

  get availableVolunteers(): Volunteer[] {
    return this.volunteers.filter(v => v.volunteerID !== this.newTeam.leaderID);
  }
}
