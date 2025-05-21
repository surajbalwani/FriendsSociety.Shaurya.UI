import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiGenericService } from '../../services/api-generic.service';
import { AbilityType } from '../../model/ability-type.model';

@Component({
  selector: 'app-ability-types',
  templateUrl: './ability-types.component.html',
  styleUrls: ['./ability-types.component.sass'],
  standalone: true,
  imports: [CommonModule]
})
export class AbilityTypesComponent implements OnInit {
  abilities: AbilityType[] = [];
  private abilitiesApiUrl = 'https://localhost:7209/api/AbilityTypes';

  constructor(private apiService: ApiGenericService<AbilityType>) {}

  ngOnInit(): void {
    this.apiService.setApiUrl(this.abilitiesApiUrl);
    this.apiService.getAll().subscribe(data => {
      this.abilities = data;
    });
  }
}