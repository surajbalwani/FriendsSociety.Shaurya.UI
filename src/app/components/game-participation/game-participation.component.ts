import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-game-participation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './game-participation.component.html',
  styleUrl: './game-participation.component.scss'
})
export class GameParticipationComponent implements OnInit {
  participationData: any[] = [];
  filteredParticipationData: any[] = [];
  loading = true;
  error: string | null = null;
  totalParticipants = 0;
  searchTerm = '';

  constructor(
    private gameService: GameService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadParticipation();
  }

  loadParticipation(): void {
    this.loading = true;
    this.error = null;

    this.gameService.getGameParticipation().subscribe({
      next: (data) => {
        console.log('Participation data loaded:', data);
        this.participationData = data;
        this.filteredParticipationData = data;
        this.totalParticipants = data.reduce((sum: number, group: any) => sum + group.totalParticipants, 0);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading participation:', err);
        this.error = 'Failed to load participation data. Please try again.';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/games']);
  }

  onSearchChange(): void {
    const term = this.searchTerm.toLowerCase().trim();
    
    if (!term) {
      // If search is empty, show all data
      this.filteredParticipationData = this.participationData;
      return;
    }

    // Filter participation data
    this.filteredParticipationData = this.participationData
      .map(disabilityGroup => {
        // Filter games within each disability group
        const filteredGames = disabilityGroup.games.filter((game: any) => {
          return (
            game.name.toLowerCase().includes(term) ||
            game.gameCode.toLowerCase().includes(term) ||
            game.ageCategory.toLowerCase().includes(term) ||
            game.ageRange.includes(term)
          );
        });

        // Return the disability group only if it has matching games
        // or if the disability type name matches
        if (
          filteredGames.length > 0 ||
          disabilityGroup.disabilityTypeName.toLowerCase().includes(term)
        ) {
          return {
            ...disabilityGroup,
            games: filteredGames
          };
        }
        return null;
      })
      .filter(group => group !== null); // Remove null groups
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.onSearchChange();
  }

  getParticipantLabel(count: number): string {
    return count === 1 ? 'participant' : 'participants';
  }
}
