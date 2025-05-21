import { Component, OnInit } from '@angular/core';
import { ApiGenericService } from '../../services/api-generic.service';
import { User } from '../../model/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.sass'],
  standalone: true,
  imports: [CommonModule],
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  private userApiUrl = 'https://localhost:7209/api/Users';

  constructor(private apiService: ApiGenericService<User>) {}

  ngOnInit(): void {
    this.apiService.setApiUrl(this.userApiUrl);
    this.apiService.getAll().subscribe(data => {
      this.users = data;
    });
  }
}
