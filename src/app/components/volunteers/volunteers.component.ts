import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VolunteerService } from '../../services/volunteer.service';
import { Volunteer } from '../../models/models';

@Component({
  selector: 'app-volunteers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './volunteers.component.html',
  styleUrls: ['./volunteers.component.scss']
})
export class VolunteersComponent implements OnInit {
  volunteers: Volunteer[] = [];
  showForm = false;
  isEditing = false;
  newVolunteer: Volunteer = this.getEmptyVolunteer();

  constructor(private volunteerService: VolunteerService) {}

  ngOnInit(): void {
    this.loadVolunteers();
  }

  loadVolunteers(): void {
    this.volunteerService.getAll().subscribe({
      next: (data) => {
        this.volunteers = data.filter(v => !v.isDeleted);
      },
      error: (err) => console.error('Error loading volunteers:', err)
    });
  }

  getEmptyVolunteer(): Volunteer {
    return {
      volunteerID: 0,
      name: '',
      age: 0,
      bloodGroup: '',
      contact: '',
      whatsAppNo: '',
      email: '',
      address: '',
      isDeleted: false
    };
  }

  openAddForm(): void {
    this.newVolunteer = this.getEmptyVolunteer();
    this.isEditing = false;
    this.showForm = true;
  }

  openEditForm(volunteer: Volunteer): void {
    this.newVolunteer = { ...volunteer };
    this.isEditing = true;
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.newVolunteer = this.getEmptyVolunteer();
  }

  saveVolunteer(): void {
    if (this.isEditing) {
      this.volunteerService.update(this.newVolunteer.volunteerID, this.newVolunteer).subscribe({
        next: () => {
          this.loadVolunteers();
          this.closeForm();
          alert('Volunteer updated successfully!');
        },
        error: (err) => {
          console.error('Error updating volunteer:', err);
          alert('Error updating volunteer. Please try again.');
        }
      });
    } else {
      this.volunteerService.create(this.newVolunteer).subscribe({
        next: () => {
          this.loadVolunteers();
          this.closeForm();
          alert('Volunteer created successfully!');
        },
        error: (err) => {
          console.error('Error creating volunteer:', err);
          alert('Error creating volunteer. Please try again.');
        }
      });
    }
  }

  deleteVolunteer(id: number): void {
    if (confirm('Are you sure you want to delete this volunteer?')) {
      this.volunteerService.delete(id).subscribe({
        next: () => {
          this.loadVolunteers();
          alert('Volunteer deleted successfully!');
        },
        error: (err) => {
          console.error('Error deleting volunteer:', err);
          alert('Error deleting volunteer. Please try again.');
        }
      });
    }
  }
}
