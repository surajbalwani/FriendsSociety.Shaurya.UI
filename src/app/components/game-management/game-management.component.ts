import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GameService, GroupedGames } from '../../services/game.service';

@Component({
  selector: 'app-game-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './game-management.component.html',
  styleUrl: './game-management.component.scss'
})
export class GameManagementComponent implements OnInit {
  groupedGames: GroupedGames[] = [];
  loading = true;
  error: string | null = null;
  selectedDisabilityType: number | null = null;
  searchGameCode = '';
  searchResult: any = null;
  searchError: string | null = null;

  disabilityTypes = [
    { code: 1, name: 'Physically challenged by leg' },
    { code: 2, name: 'Physically challenged by Hand' },
    { code: 3, name: 'Intellectually challenged' },
    { code: 4, name: 'DEAF AND DUMB' },
    { code: 5, name: 'VISUALLY IMPAIRED & PARTIALLY VISUALLY IMPAIRED' },
    { code: 6, name: 'LEARNING DISABILITY' }
  ];

  ageCategories = [
    { code: 'A', range: '8-12' },
    { code: 'B', range: '13-17' },
    { code: 'C', range: '18-22' },
    { code: 'D', range: '23-27' }
  ];

  gamesList = [
    { id: 1, name: 'Archery' },
    { id: 2, name: 'Bocce' },
    { id: 3, name: 'Carrom' },
    { id: 4, name: 'Goal The Ball' },
    { id: 5, name: 'Shotput' },
    { id: 6, name: '50m Race' },
    { id: 7, name: '100m Race' },
    { id: 8, name: '200m Race' }
  ];

  constructor(
    private gameService: GameService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadGames();
  }

  loadGames(): void {
    this.loading = true;
    this.error = null;
    
    console.log('Loading games from API...');
    
    this.gameService.getGamesGroupedByDisability().subscribe({
      next: (data) => {
        console.log('Games loaded successfully:', data);
        this.groupedGames = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading games:', err);
        console.error('Error status:', err.status);
        console.error('Error message:', err.message);
        console.error('Full error:', JSON.stringify(err, null, 2));
        
        if (err.status === 0) {
          this.error = 'Cannot connect to API. Please ensure the backend is running at ' + this.getApiUrl();
        } else if (err.status === 401) {
          this.error = 'Authentication required. Please login again.';
        } else if (err.status === 404) {
          this.error = 'API endpoint not found. Games API may not be deployed.';
        } else {
          this.error = `Failed to load games. Error: ${err.message || 'Unknown error'}`;
        }
        
        this.loading = false;
      }
    });
  }

  getApiUrl(): string {
    // Helper method to show API URL in error message
    return 'http://localhost:5128/api/Games/GroupedByDisability';
  }

  filterByDisabilityType(code: number | null): void {
    this.selectedDisabilityType = code;
  }

  getFilteredGames(): GroupedGames[] {
    if (this.selectedDisabilityType === null) {
      return this.groupedGames;
    }
    return this.groupedGames.filter(g => g.disabilityTypeCode === this.selectedDisabilityType);
  }

  searchByGameCode(): void {
    if (!this.searchGameCode || this.searchGameCode.length !== 4) {
      this.searchError = 'Please enter a valid 4-character game code (e.g., 1A02)';
      this.searchResult = null;
      return;
    }

    this.searchError = null;
    this.gameService.getGameByCode(this.searchGameCode).subscribe({
      next: (game) => {
        this.searchResult = game;
      },
      error: (err) => {
        this.searchError = 'Game not found with the provided code';
        this.searchResult = null;
        console.error('Error searching game:', err);
      }
    });
  }

  clearSearch(): void {
    this.searchGameCode = '';
    this.searchResult = null;
    this.searchError = null;
  }

  decodeGameCode(gameCode: string): string {
    if (!gameCode || gameCode.length !== 4) return 'Invalid Code';
    
    const disabilityCode = parseInt(gameCode[0]);
    const ageCategory = gameCode[1];
    const gameNumber = parseInt(gameCode.substring(2));

    const disability = this.disabilityTypes.find(d => d.code === disabilityCode);
    const age = this.ageCategories.find(a => a.code === ageCategory);
    const game = this.gamesList.find(g => g.id === gameNumber);

    return `${disability?.name || 'Unknown'} | Age ${age?.range || 'Unknown'} | ${game?.name || 'Unknown'}`;
  }

  getDisabilityTypeName(code: number): string {
    return this.disabilityTypes.find(d => d.code === code)?.name || 'Unknown';
  }

  getGameName(gameNumber: number): string {
    return this.gamesList.find(g => g.id === gameNumber)?.name || 'Unknown';
  }

  navigateToParticipation(): void {
    this.router.navigate(['/games/participation']);
  }
}
