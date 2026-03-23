import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'
@Component({
  selector: 'app-faculty-signup',
  standalone: true,
  imports: [FormsModule, NgIf, RouterLink],
  templateUrl: './faculty-signup.html',
  styleUrl: './faculty-signup.css'
})
export class FacultySignup {
  name = '';
  email = '';
  password = '';
  message = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSignup(): void {
    if (!this.name || !this.email || !this.password) {
      this.message = 'All fields are required';
      return;
    }

    this.http.post(`${environment.apiUrl}/api/auth/signup`, {
      name: this.name,
      email: this.email,
      password: this.password,
      role: 'faculty'
    }).subscribe({
      next: () => {
        alert('Faculty registered successfully');
        this.router.navigate(['/faculty-login']);
      },
      error: (err) => {
        this.message = err?.error?.message || 'Signup failed';
      }
    });
  }
}