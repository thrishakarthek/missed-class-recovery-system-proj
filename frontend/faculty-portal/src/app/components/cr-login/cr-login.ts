import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-cr-login',
  standalone: true,
  imports: [FormsModule, NgIf, RouterLink],
  templateUrl: './cr-login.html',
  styleUrl: './cr-login.css'
})
export class CrLogin {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Email and password are required';
      return;
    }

    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: (response) => {
        if (!response?.token || !response?.user) {
          this.errorMessage = 'Invalid login response from server';
          return;
        }

        if (response.user.isCR !== true) {
          this.errorMessage = 'This login portal is only for class representatives';
          return;
        }

        this.authService.saveAuthData(response.token, response.user);
        this.router.navigate(['/cr-dashboard']);
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'Login failed. Please try again.';
      }
    });
  }
}