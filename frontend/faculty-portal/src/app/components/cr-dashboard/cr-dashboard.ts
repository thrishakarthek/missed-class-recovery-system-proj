import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth';
import { environment } from '../../../environments/environment'
@Component({
  selector: 'app-cr-dashboard',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule],
  templateUrl: './cr-dashboard.html',
  styleUrl: './cr-dashboard.css'
})
export class CrDashboard implements OnInit {
  user: any;
  token = '';

  // class creation
  department = '';
  year: number | null = null;
  section = '';

  classes: any[] = [];
  selectedClassId = '';

  // subject creation
  subjectName = '';
  subjectCode = '';
  facultyId = '';

  facultyUsers: any[] = [];
  selectedFacultyId = '';

  // schedule
  date = '';
  periods = Array.from({ length: 8 }, (_, i) => ({
  periodNumber: i + 1,
  status: 'scheduled',
  subjectId: ''
}));

  subjects: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {
    this.user = this.authService.getUser();
    this.token = this.authService.getToken() || '';
  }

  ngOnInit(): void {
    this.fetchClasses();
    this.fetchFacultyUsers();
  }

  fetchClasses(): void {
    this.http.get<any>(`${environment.apiUrl}/api/classes`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    }).subscribe({
      next: (res) => {
        this.classes = res.classes || [];
      },
      error: () => {
        alert('Error fetching classes');
      }
    });
  }

  onClassChange(): void {
    if (!this.selectedClassId) return;

    this.http.get<any>(
      `${environment.apiUrl}/api/subjects/class/${this.selectedClassId}`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }
    ).subscribe({
      next: (res) => {
        this.subjects = res.subjects || [];
      },
      error: () => {
        alert('Error fetching subjects');
      }
    });
  }

  createClass(): void {
    if (!this.department || !this.year || !this.section) {
      alert('All class fields are required');
      return;
    }

    this.http.post(
      `${environment.apiUrl}/api/classes/create`,
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
        this.fetchClasses();
      },
      error: (err) => {
        alert(err?.error?.message || 'Error creating class');
      }
    });
  }

  createSubject(): void {
    if (!this.subjectName || !this.subjectCode || !this.selectedClassId || !this.selectedFacultyId) {
      alert('All subject fields are required');
      return;
    }

    this.http.post(
      `${environment.apiUrl}/api/subjects/create`,
      {
        name: this.subjectName,
        subjectCode: this.subjectCode,
        classId: this.selectedClassId,
        facultyId: this.selectedFacultyId
      },
      {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }
    ).subscribe({
      next: () => {
        alert('Subject created successfully');
        this.subjectName = '';
        this.subjectCode = '';
        this.facultyId = '';
        this.selectedFacultyId='';
        this.onClassChange();
      },
      error: (err) => {
        alert(err?.error?.message || 'Error creating subject');
      }
    });
  }

  submitSchedule(): void {
    if (!this.selectedClassId || !this.date) {
      alert('Class and date are required');
      return;
    }

    const cleanedPeriods = this.periods.map((period) => {
      if (period.status === 'free') {
        return {
          periodNumber: period.periodNumber,
          status: 'free'
        };
      }

      const selectedSubject = this.subjects.find(
        (s) => s._id === period.subjectId
      );

      return {
        periodNumber: period.periodNumber,
        status: period.status,
        subjectId: period.subjectId,
        facultyId: selectedSubject?.facultyId?._id || selectedSubject?.facultyId || ''
      };
    });

    this.http.post(
      `${environment.apiUrl}/api/schedules/create-or-update`,
      {
        classId: this.selectedClassId,
        date: this.date,
        periods: cleanedPeriods
      },
      {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }
    ).subscribe({
      next: () => {
        alert('Schedule submitted successfully');
      },
      error: (err) => {
        alert(err?.error?.message || 'Error submitting schedule');
      }
    });
  }

  fetchFacultyUsers(): void {
    this.http.get<any>(`${environment.apiUrl}/api/auth/faculty-users`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    }).subscribe({
      next: (res) => {
        this.facultyUsers = res.facultyUsers || [];
      },
      error: () => {
        alert('Error fetching faculty users');
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/cr-login']);
  }
}