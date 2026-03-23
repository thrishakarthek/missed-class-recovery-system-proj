import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-faculty-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './faculty-home.html',
  styleUrl: './faculty-home.css'
})
export class FacultyHome {
  user: any;

  constructor(private authService: AuthService, private router: Router) {
    this.user = this.authService.getUser();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/faculty-login']);
  }
}