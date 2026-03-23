import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'
@Component({
  selector: 'app-cr-signup',
  standalone: true,
  imports: [FormsModule, NgIf, RouterLink],
  templateUrl: './cr-signup.html',
  styleUrl: './cr-signup.css'
})
export class CrSignup {
  name = '';
  email = '';
  password = '';
  className = '';
  message = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSignup(): void {
    if (!this.name || !this.email || !this.password || !this.className) {
      this.message = 'All fields are required';
      return;
    }

    this.http.post('${environment.apiUrl}/api/auth/signup', {
      name: this.name,
      email: this.email,
      password: this.password,
      role: 'student',
      isCR: true,
      className: this.className
    }).subscribe({
      next: () => {
        alert('CR registered successfully');
        this.router.navigate(['/cr-login']);
      },
      error: (err) => {
        this.message = err?.error?.message || 'Signup failed';
      }
    });
  }
}