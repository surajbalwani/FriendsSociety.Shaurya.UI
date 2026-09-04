import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ParticipantService } from '../../services/participant.service';
import { AbilityTypeService } from '../../services/ability-type.service';
import { OrganizationService } from '../../services/organization.service';
import { GameService } from '../../services/game.service';
import { Participant, AbilityType, Organization } from '../../models/models';
import * as XLSX from 'xlsx';
import { forkJoin } from 'rxjs';

interface AgeGroup {
  label: string;
  min: number;
  max: number;
}

@Component({
  selector: 'app-participants',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.scss']
})
export class ParticipantsComponent implements OnInit {
  participants: Participant[] = [];
  filteredParticipants: Participant[] = [];
  abilityTypes: AbilityType[] = [];
  organizations: Organization[] = [];
  availableGames: any[] = []; // Games filtered by age and ability type
  allGames: any[] = []; // Store all games for lookup in bulk upload
  
  isEditing = false;
  showForm = false;
  showBulkUpload = false;
  
  newParticipant: any = this.getEmptyParticipant();
  selectedGame1: number | null = null;
  selectedGame2: number | null = null;

  selectedAgeGroup: string = 'all';
  selectedOrganization: number = 0;
  selectedAbilityType: number = 0;
  selectedGender: string = 'all';

  ageGroups: AgeGroup[] = [
    { label: 'All Ages', min: 0, max: 999 },
    { label: 'Children (5-12)', min: 5, max: 12 },
    { label: 'Teens (13-19)', min: 13, max: 19 },
    { label: 'Adults (20-40)', min: 20, max: 40 },
    { label: 'Seniors (41+)', min: 41, max: 999 }
  ];

  genderOptions = ['All', 'Male', 'Female', 'Other'];

  bulkParticipants: any[] = [];
  selectedFile: File | null = null;
  uploadErrors: string[] = [];
  isProcessing = false;

  constructor(
    private participantService: ParticipantService,
    private abilityTypeService: AbilityTypeService,
    private organizationService: OrganizationService,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    forkJoin({
      participants: this.participantService.getAll(),
      abilityTypes: this.abilityTypeService.getAll(),
      organizations: this.organizationService.getAll(),
      games: this.gameService.getGames()
    }).subscribe({
      next: (data) => {
        this.abilityTypes = data.abilityTypes.filter(a => !a.isDeleted);
        this.organizations = data.organizations.filter(o => !o.isDeleted);
        this.participants = data.participants.filter(p => !p.isDeleted);
        this.allGames = data.games;
        console.log('Loaded games for bulk upload lookup:', this.allGames.length);
        this.applyFilters();
      },
      error: (err) => console.error('Error loading data:', err)
    });
  }

  loadParticipants(): void {
    this.participantService.getAll().subscribe({
      next: (data) => {
        this.participants = data.filter(p => !p.isDeleted);
        this.applyFilters();
      },
      error: (err) => console.error('Error loading participants:', err)
    });
  }

  applyFilters(): void {
    let filtered = [...this.participants];

    if (this.selectedAgeGroup !== 'all') {
      const ageGroup = this.ageGroups.find(ag => ag.label === this.selectedAgeGroup);
      if (ageGroup) {
        filtered = filtered.filter(p => p.age >= ageGroup.min && p.age <= ageGroup.max);
      }
    }

    const orgId = Number(this.selectedOrganization);
    if (orgId > 0) {
      filtered = filtered.filter(p => p.organizationID === orgId);
    }

    const abilityId = Number(this.selectedAbilityType);
    if (abilityId > 0) {
      filtered = filtered.filter(p => p.abilityTypeID === abilityId);
    }

    if (this.selectedGender !== 'all' && this.selectedGender !== 'All') {
      filtered = filtered.filter(p => p.gender?.toLowerCase() === this.selectedGender.toLowerCase());
    }

    this.filteredParticipants = filtered;
  }

  onAgeGroupChange(): void { this.applyFilters(); }
  onOrganizationChange(): void { this.applyFilters(); }
  onAbilityTypeChange(): void { this.applyFilters(); }
  onGenderChange(): void { this.applyFilters(); }

  clearAllFilters(): void {
    this.selectedAgeGroup = 'all';
    this.selectedOrganization = 0;
    this.selectedAbilityType = 0;
    this.selectedGender = 'all';
    this.applyFilters();
  }

  getEmptyParticipant(): any {
    return {
      participantID: 0,
      name: '',
      age: 0,
      gender: '',
      bloodGroup: '',
      abilityTypeID: 0,
      organizationID: 0,
      contact: '',
      emergencyContact: '',
      address: '',
      medicalNotes: '',
      isDeleted: false,
      game1ID: null,
      game2ID: null
    };
  }

  onAgeOrAbilityChange(): void {
    this.loadAvailableGames();
  }

  loadAvailableGames(): void {
    const age = this.newParticipant.age;
    const abilityTypeId = this.newParticipant.abilityTypeID;

    // Reset game selections when criteria change
    this.selectedGame1 = null;
    this.selectedGame2 = null;
    this.newParticipant.game1ID = null;
    this.newParticipant.game2ID = null;
    this.availableGames = [];

    // Only load games if both age and ability type are selected
    if (age && age >= 8 && age <= 27 && abilityTypeId) {
      this.gameService.getGamesByAgeAndAbility(age, abilityTypeId).subscribe({
        next: (games) => {
          this.availableGames = games;
          console.log('Available games loaded:', games);
        },
        error: (err) => {
          console.error('Error loading games:', err);
          if (err.status === 400) {
            alert('Age must be between 8 and 27 years to participate in games.');
          } else {
            alert('Error loading available games.');
          }
        }
      });
    }
  }

  onGame1Change(): void {
    this.newParticipant.game1ID = this.selectedGame1;
    // If Game2 is same as Game1, clear it
    if (this.selectedGame2 === this.selectedGame1) {
      this.selectedGame2 = null;
      this.newParticipant.game2ID = null;
    }
  }

  onGame2Change(): void {
    this.newParticipant.game2ID = this.selectedGame2;
  }

  getAvailableGamesForGame2(): any[] {
    // Filter out Game1 from Game2 options
    if (this.selectedGame1) {
      return this.availableGames.filter(g => g.gameID !== this.selectedGame1);
    }
    return this.availableGames;
  }

  openAddForm(): void {
    this.newParticipant = this.getEmptyParticipant();
    this.isEditing = false;
    this.showForm = true;
    this.showBulkUpload = false;
  }

  openBulkUploadForm(): void {
    this.showForm = false;
    this.showBulkUpload = true;
    this.bulkParticipants = [];
    this.selectedFile = null;
    this.uploadErrors = [];
  }

  openEditForm(participant: any): void {
    this.newParticipant = { ...participant };
    this.selectedGame1 = participant.game1ID || null;
    this.selectedGame2 = participant.game2ID || null;
    this.isEditing = true;
    this.showForm = true;
    this.showBulkUpload = false;
    
    // Load available games for editing
    if (this.newParticipant.age && this.newParticipant.abilityTypeID) {
      this.loadAvailableGames();
    }
  }

  closeForm(): void {
    this.showForm = false;
    this.showBulkUpload = false;
    this.newParticipant = this.getEmptyParticipant();
    this.bulkParticipants = [];
    this.selectedFile = null;
    this.uploadErrors = [];
  }

  saveParticipant(): void {
    // Validate required fields
    if (!this.newParticipant.name || !this.newParticipant.age || !this.newParticipant.abilityTypeID || !this.newParticipant.organizationID) {
      alert('Please fill in all required fields (Name, Age, Ability Type, Organization)');
      return;
    }

    // Validate Game1 is selected (required)
    if (!this.newParticipant.game1ID) {
      alert('Please select at least Game 1. Game selection is required for participation.');
      return;
    }

    // Ensure Game1 and Game2 are different
    if (this.newParticipant.game1ID && this.newParticipant.game2ID && 
        this.newParticipant.game1ID === this.newParticipant.game2ID) {
      alert('Game 1 and Game 2 must be different.');
      return;
    }

    if (this.isEditing) {
      this.participantService.update(this.newParticipant.participantID, this.newParticipant).subscribe({
        next: () => {
          this.loadParticipants();
          this.closeForm();
          alert('Participant updated successfully!');
        },
        error: (err) => {
          console.error('Error updating participant:', err);
          alert('Error updating participant');
        }
      });
    } else {
      this.participantService.create(this.newParticipant).subscribe({
        next: () => {
          this.loadParticipants();
          this.closeForm();
          alert('Participant created successfully!');
        },
        error: (err) => {
          console.error('Error creating participant:', err);
          alert('Error creating participant');
        }
      });
    }
  }

  deleteParticipant(id: number): void {
    if (confirm('Are you sure you want to delete this participant?')) {
      this.participantService.delete(id).subscribe({
        next: () => {
          this.loadParticipants();
          alert('Participant deleted successfully!');
        },
        error: (err) => {
          console.error('Error deleting participant:', err);
          alert('Error deleting participant');
        }
      });
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.readExcelFile(file);
    }
  }

  readExcelFile(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);
        
        console.log('Excel file loaded, rows:', jsonData.length);
        console.log('First row data:', jsonData[0]);
        console.log('Column headers:', Object.keys(jsonData[0] || {}));
        
        this.processExcelData(jsonData);
      } catch (error) {
        alert('Error reading Excel file. Please check the file format.');
        console.error(error);
      }
    };
    reader.readAsArrayBuffer(file);
  }

  processExcelData(data: any[]): void {
    this.uploadErrors = [];
    this.bulkParticipants = [];

    console.log('Processing Excel data, total games loaded:', this.allGames.length);
    console.log('Sample game:', this.allGames[0]);

    data.forEach((row, index) => {
      const errors: string[] = [];
      
      console.log(`Processing row ${index + 2}:`, row);
      
      if (!row.Name || row.Name.toString().trim() === '') errors.push('Name is required');
      if (!row.Age || isNaN(row.Age) || row.Age <= 0) errors.push('Valid age is required');
      if (!row.AbilityType) errors.push('Ability Type is required');
      if (!row.Organization) errors.push('Organization is required');

      const abilityType = this.abilityTypes.find(a => a.name.toLowerCase() === row.AbilityType?.toString().toLowerCase());
      const organization = this.organizations.find(o => o.name.toLowerCase() === row.Organization?.toString().toLowerCase());

      if (row.AbilityType && !abilityType) errors.push(`Ability Type "${row.AbilityType}" not found`);
      if (row.Organization && !organization) errors.push(`Organization "${row.Organization}" not found`);

      // Game validation and lookup
      let game1ID = null;
      let game1Name = '';
      let game2ID = null;
      let game2Name = '';

      console.log('Looking for Game1:', row.Game1 || row['Game 1']);
      console.log('Looking for Game2:', row.Game2 || row['Game 2']);

      const game1Value = row.Game1 || row['Game 1'] || row.game1;
      const game2Value = row.Game2 || row['Game 2'] || row.game2;

      if (game1Value) {
        const game1Code = game1Value.toString().trim().toUpperCase();
        console.log('Game1 code (normalized):', game1Code);
        const game1 = this.allGames.find(g => g.gameCode.toUpperCase() === game1Code);
        console.log('Found game1:', game1);
        if (game1) {
          game1ID = game1.gameID;
          game1Name = game1.name;
        } else {
          errors.push(`Game1 code "${game1Code}" not found`);
        }
      } else {
        errors.push('Game1 is required');
      }

      if (game2Value) {
        const game2Code = game2Value.toString().trim().toUpperCase();
        console.log('Game2 code (normalized):', game2Code);
        const game2 = this.allGames.find(g => g.gameCode.toUpperCase() === game2Code);
        console.log('Found game2:', game2);
        if (game2) {
          game2ID = game2.gameID;
          game2Name = game2.name;
        } else {
          errors.push(`Game2 code "${game2Code}" not found`);
        }
      }

      const participant = {
        rowNumber: index + 2,
        name: row.Name?.toString() || '',
        age: parseInt(row.Age) || 0,
        gender: row.Gender?.toString() || '',
        bloodGroup: row.BloodGroup?.toString() || '',
        abilityTypeID: abilityType?.abilityTypeID || 0,
        abilityTypeName: row.AbilityType?.toString() || '',
        organizationID: organization?.organizationID || 0,
        organizationName: row.Organization?.toString() || '',
        contact: row.Contact?.toString() || '',
        emergencyContact: row.EmergencyContact?.toString() || '',
        address: row.Address?.toString() || '',
        medicalNotes: row.MedicalNotes?.toString() || '',
        game1Code: game1Value?.toString() || '',
        game1ID: game1ID,
        game1Name: game1Name,
        game2Code: game2Value?.toString() || '',
        game2ID: game2ID,
        game2Name: game2Name,
        errors: errors,
        isValid: errors.length === 0
      };

      console.log('Created participant object:', participant);

      this.bulkParticipants.push(participant);
      if (errors.length > 0) {
        this.uploadErrors.push(`Row ${participant.rowNumber}: ${errors.join(', ')}`);
      }
    });

    console.log('Final bulkParticipants:', this.bulkParticipants);
  }

  removeBulkParticipant(index: number): void {
    this.bulkParticipants.splice(index, 1);
  }

  confirmBulkUpload(): void {
    const validParticipants = this.bulkParticipants.filter(p => p.isValid);
    
    if (validParticipants.length === 0) {
      alert('No valid participants to upload. Please fix the errors.');
      return;
    }

    if (!confirm(`Are you sure you want to create ${validParticipants.length} participants?`)) {
      return;
    }

    this.isProcessing = true;
    let successCount = 0;
    let errorCount = 0;

    const createParticipant = (index: number) => {
      if (index >= validParticipants.length) {
        this.isProcessing = false;
        this.loadParticipants();
        this.closeForm();
        alert(`Bulk upload completed!\nSuccess: ${successCount}\nFailed: ${errorCount}`);
        return;
      }

      const participantData = validParticipants[index];
      const newParticipant: any = {
        participantID: 0,
        name: participantData.name,
        age: participantData.age,
        gender: participantData.gender,
        bloodGroup: participantData.bloodGroup,
        abilityTypeID: participantData.abilityTypeID,
        organizationID: participantData.organizationID,
        contact: participantData.contact,
        emergencyContact: participantData.emergencyContact,
        address: participantData.address,
        medicalNotes: participantData.medicalNotes,
        game1ID: participantData.game1ID,
        game2ID: participantData.game2ID,
        isDeleted: false
      };

      this.participantService.create(newParticipant).subscribe({
        next: () => {
          successCount++;
          createParticipant(index + 1);
        },
        error: (err) => {
          console.error(`Error creating participant ${participantData.name}:`, err);
          errorCount++;
          createParticipant(index + 1);
        }
      });
    };

    createParticipant(0);
  }

  downloadTemplate(): void {
    const template = [
      {
        Name: 'John Doe',
        Age: 25,
        Gender: 'Male',
        BloodGroup: 'O+',
        AbilityType: 'Physically challenged by leg',
        Organization: 'ABC School',
        Contact: '1234567890',
        EmergencyContact: '0987654321',
        Address: '123 Main St',
        MedicalNotes: 'None',
        Game1: '1C02',
        Game2: '1C05'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Participants');
    
    worksheet['!cols'] = [
      { wch: 20 }, // Name
      { wch: 10 }, // Age
      { wch: 10 }, // Gender
      { wch: 12 }, // BloodGroup
      { wch: 30 }, // AbilityType
      { wch: 20 }, // Organization
      { wch: 15 }, // Contact
      { wch: 15 }, // EmergencyContact
      { wch: 30 }, // Address
      { wch: 30 }, // MedicalNotes
      { wch: 12 }, // Game1
      { wch: 12 }  // Game2
    ];

    XLSX.writeFile(workbook, 'participant_upload_template.xlsx');
  }

  get validParticipantsCount(): number {
    return this.bulkParticipants.filter(p => p.isValid).length;
  }

  get invalidParticipantsCount(): number {
    return this.bulkParticipants.filter(p => !p.isValid).length;
  }

  get hasActiveFilters(): boolean {
    return this.selectedAgeGroup !== 'all' || 
           this.selectedOrganization > 0 || 
           this.selectedAbilityType > 0 ||
           this.selectedGender !== 'all';
  }
}
