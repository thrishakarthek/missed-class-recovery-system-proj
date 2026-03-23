import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { AuthService } from '../../services/auth';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cr-assign-schedule',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './cr-assign-schedule.html',
  styleUrl: './cr-assign-schedule.css'
})
export class CrAssignSchedule implements OnInit {
  token = '';

  classes: any[] = [];
  subjects: any[] = [];

  selectedClassId = '';
  date = '';

  periods = Array.from({ length: 8 }, (_, i) => ({
    periodNumber: i + 1,
    status: 'scheduled',
    subjectId: ''
  }));

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {
    this.token = this.authService.getToken() || '';
  }

  ngOnInit(): void {
    this.fetchClasses();
  }

  fetchClasses(): void {
    this.http.get<any>('http://localhost:5000/api/classes', {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    }).subscribe({
      next: (res) => {
        this.classes = res.classes || [];
      },
      error: (err) => {
        alert(err?.error?.message || 'Error fetching classes');
      }
    });
  }

  onClassChange(): void {
    if (!this.selectedClassId) {
      this.subjects = [];
      return;
    }

    this.http.get<any>(
      `http://localhost:5000/api/subjects/class/${this.selectedClassId}`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }
    ).subscribe({
      next: (res) => {
        this.subjects = res.subjects || [];
      },
      error: (err) => {
        alert(err?.error?.message || 'Error fetching subjects');
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
      'http://localhost:5000/api/schedules/create-or-update',
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

  goBack(): void {
    this.router.navigate(['/cr-home']);
  }
}