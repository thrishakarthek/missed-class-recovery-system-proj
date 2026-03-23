import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-cr-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cr-home.html',
  styleUrl: './cr-home.css'
})
export class CrHome {
  user: any;

  constructor(private authService: AuthService, private router: Router) {
    this.user = this.authService.getUser();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/cr-login']);
  }
}