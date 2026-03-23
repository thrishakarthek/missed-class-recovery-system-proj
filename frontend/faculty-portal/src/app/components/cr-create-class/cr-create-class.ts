import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-cr-create-class',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './cr-create-class.html',
  styleUrl: './cr-create-class.css'
})
export class CrCreateClass {
  token = '';
  department = '';
  year: number | null = null;
  section = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {
    this.token = this.authService.getToken() || '';
  }

  createClass(): void {
    if (!this.department || !this.year || !this.section) {
      alert('All fields are required');
      return;
    }

    this.http.post(
      '${environment.apiUrl}/api/classes/create',
      {
        department: this.department,
        year: this.year,
        section: this.section
      },
      {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }
    ).subscribe({
      next: () => {
        alert('Class created successfully');
        this.department = '';
        this.year = null;
        this.section = '';
      },
      error: (err) => {
        alert(err?.error?.message || 'Error creating class');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/cr-home']);
  }
}