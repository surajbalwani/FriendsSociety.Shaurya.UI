import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AbilityTypeService } from '../../services/ability-type.service';
import { AbilityType } from '../../model/ability-type.model';

@Component({
  selector: 'app-ability-types',
  templateUrl: './ability-types.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class AbilityTypesComponent implements OnInit {
  abilities: AbilityType[] = [];
  abilityForm: FormGroup;
  showForm = false;
  isSubmitting = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  constructor(
    private abilityService: AbilityTypeService,
    private fb: FormBuilder,
  ) {
    this.abilityForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  ngOnInit(): void {
    this.loadAbilities();
  }

  loadAbilities(): void {
    this.abilityService.getAll().subscribe({
      next: (data) => {
        this.abilities = data;
      },
      error: (error) => {
        console.error('Error loading abilities:', error);
        this.showMessage('Error loading ability types', 'error');
      },
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.abilityForm.reset();
      this.message = '';
    }
  }

  onSubmit(): void {
    if (this.abilityForm.valid) {
      this.isSubmitting = true;
      const newAbility: Partial<AbilityType> = {
        name: this.abilityForm.value.name,
        description: this.abilityForm.value.description,
        isDeleted: false,
      };

      this.abilityService.add(newAbility as AbilityType).subscribe({
        next: (createdAbility) => {
          this.abilities.push(createdAbility);
          this.abilityForm.reset();
          this.showForm = false;
          this.showMessage('Ability type created successfully!', 'success');
        },
        error: (error) => {
          console.error('Error creating ability type:', error);
          this.showMessage('Error creating ability type. Please try again.', 'error');
        },
        complete: () => {
          this.isSubmitting = false;
        },
      });
    }
  }

  private showMessage(message: string, type: 'success' | 'error'): void {
    this.message = message;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }

  trackByAbilityTypeID(index: number, ability: AbilityType): number {
    return ability.abilityTypeID;
  }
}
