import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';


@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.sass'],
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
})
export class AdministrationComponent {}
