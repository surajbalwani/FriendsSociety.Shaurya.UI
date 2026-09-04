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

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  abilityTypes: AbilityType[] = [];
  organizations: Organization[] = [];
  allGames: any[] = []; // Store all games for lookup
  
  showForm = false;
  showBulkUpload = false;
  
  newParticipant: Participant = this.getEmptyParticipant();

  // Bulk upload properties
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
    this.loadReferenceData();
  }

  loadReferenceData(): void {
    forkJoin({
      abilityTypes: this.abilityTypeService.getAll(),
      organizations: this.organizationService.getAll(),
      games: this.gameService.getGames()
    }).subscribe({
      next: (data) => {
        this.abilityTypes = data.abilityTypes.filter(a => !a.isDeleted);
        this.organizations = data.organizations.filter(o => !o.isDeleted);
        this.allGames = data.games;
        console.log('Loaded games for lookup:', this.allGames.length);
      },
      error: (err) => console.error('Error loading reference data:', err)
    });
  }

  getEmptyParticipant(): Participant {
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
      isDeleted: false
    };
  }

  openAddForm(): void {
    this.newParticipant = this.getEmptyParticipant();
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

  closeForm(): void {
    this.showForm = false;
    this.showBulkUpload = false;
    this.newParticipant = this.getEmptyParticipant();
    this.bulkParticipants = [];
    this.selectedFile = null;
    this.uploadErrors = [];
  }

  saveParticipant(): void {
    this.participantService.create(this.newParticipant).subscribe({
      next: () => {
        this.closeForm();
        alert('Participant registered successfully!');
      },
      error: (err) => {
        console.error('Error creating participant:', err);
        alert('Error registering participant. Please try again.');
      }
    });
  }

  // Bulk Upload Methods
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
      
      if (!row.Name || row.Name.toString().trim() === '') {
        errors.push('Name is required');
      }
      if (!row.Age || isNaN(row.Age) || row.Age <= 0) {
        errors.push('Valid age is required');
      }
      if (!row.AbilityType) {
        errors.push('Ability Type is required');
      }
      if (!row.Organization) {
        errors.push('Organization is required');
      }

      const abilityType = this.abilityTypes.find(a => a.name.toLowerCase() === row.AbilityType?.toString().toLowerCase());
      const organization = this.organizations.find(o => o.name.toLowerCase() === row.Organization?.toString().toLowerCase());

      if (row.AbilityType && !abilityType) {
        errors.push(`Ability Type "${row.AbilityType}" not found`);
      }
      if (row.Organization && !organization) {
        errors.push(`Organization "${row.Organization}" not found`);
      }

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

    if (!confirm(`Are you sure you want to register ${validParticipants.length} participants?`)) {
      return;
    }

    this.isProcessing = true;
    let successCount = 0;
    let errorCount = 0;

    const createParticipant = (index: number) => {
      if (index >= validParticipants.length) {
        this.isProcessing = false;
        this.closeForm();
        alert(`Bulk registration completed!\nSuccess: ${successCount}\nFailed: ${errorCount}`);
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
      { wch: 20 }, { wch: 10 }, { wch: 10 }, { wch: 12 }, { wch: 35 },
      { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 30 }, { wch: 30 },
      { wch: 10 }, { wch: 10 }
    ];

    XLSX.writeFile(workbook, 'participant_registration_template.xlsx');
  }

  get validParticipantsCount(): number {
    return this.bulkParticipants.filter(p => p.isValid).length;
  }

  get invalidParticipantsCount(): number {
    return this.bulkParticipants.filter(p => !p.isValid).length;
  }
}
