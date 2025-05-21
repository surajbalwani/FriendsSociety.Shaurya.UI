import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiGenericService } from '../../services/api-generic.service';
import { Ground } from '../../model/ground.model';

@Component({
  selector: 'app-grounds',
  templateUrl: './grounds.component.html',
  styleUrls: ['./grounds.component.sass'],
  standalone: true,
  imports: [CommonModule]
})
export class GroundsComponent implements OnInit {
  grounds: Ground[] = [];
  private groundsApiUrl = 'https://localhost:7209/api/Grounds';

  constructor(private apiService: ApiGenericService<Ground>) {}

  ngOnInit(): void {
    this.apiService.setApiUrl(this.groundsApiUrl);
    this.apiService.getAll().subscribe(data => {
      this.grounds = data;
    });
  }
}
