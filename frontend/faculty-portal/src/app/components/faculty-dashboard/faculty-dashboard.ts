import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth';
import { environment } from '../../../environments/environment'
@Component({
  selector: 'app-faculty-dashboard',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule],
  templateUrl: './faculty-dashboard.html',
  styleUrl: './faculty-dashboard.css'
})
export class FacultyDashboard implements OnInit {
  user: any;
  token = '';

  classes: any[] = [];
  subjects: any[] = [];

  selectedClassId = '';
  selectedSubjectId = '';

  date = '';
  periodNumber: number | null = null;
  summary = '';
  topicsInput = '';

  noteSessionId = '';
  noteTitle = '';
  selectedSessionFile: File | null = null;

  generalTitle = '';
  selectedGeneralFile: File | null = null;

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
  }

  fetchClasses(): void {
    this.http.get<any>('${environment.apiUrl}/api/classes', {
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
    if (!this.selectedClassId) {
      this.subjects = [];
      return;
    }

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

  submitSession(): void {
    const topicsCovered = this.topicsInput
      .split(',')
      .map(topic => topic.trim())
      .filter(topic => topic.length > 0);

    const payload = {
      classId: this.selectedClassId,
      subjectId: this.selectedSubjectId,
      date: this.date,
      periodNumber: this.periodNumber,
      summary: this.summary,
      topicsCovered
    };

    this.http.post(
      `${environment.apiUrl}/api/sessions/create`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }
    ).subscribe({
      next: () => {
        alert('Session submitted successfully');
      },
      error: (err) => {
        alert(err?.error?.message || 'Error submitting session');
      }
    });
  }

  onSessionFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedSessionFile = input.files[0];
    }
  }

  uploadFacultyNote(): void {
    if (!this.noteSessionId || !this.noteTitle || !this.selectedSessionFile) {
      alert('Session ID, title, and file are required');
      return;
    }

    const formData = new FormData();
    formData.append('sessionId', this.noteSessionId);
    formData.append('title', this.noteTitle);
    formData.append('file', this.selectedSessionFile);

    this.http.post(
      `${environment.apiUrl}/api/sessions/upload-faculty-note`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }
    ).subscribe({
      next: () => {
        alert('Faculty session note uploaded successfully');
      },
      error: (err) => {
        alert(err?.error?.message || 'Error uploading faculty session note');
      }
    });
  }

  onGeneralFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedGeneralFile = input.files[0];
    }
  }

  uploadGeneralNote(): void {
    if (!this.selectedSubjectId || !this.generalTitle || !this.selectedGeneralFile) {
      alert('Subject, title, and file are required');
      return;
    }

    const formData = new FormData();
    formData.append('subjectId', this.selectedSubjectId);
    formData.append('title', this.generalTitle);
    formData.append('file', this.selectedGeneralFile);

    this.http.post(
      `${environment.apiUrl}/api/subjects/upload-general-note`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }
    ).subscribe({
      next: () => {
        alert('General subject note uploaded successfully');
      },
      error: (err) => {
        alert(err?.error?.message || 'Error uploading general subject note');
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/faculty-login']);
  }
}