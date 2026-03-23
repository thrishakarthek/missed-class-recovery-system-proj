import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'
@Component({
  selector: 'app-faculty-create-session',
  standalone: true,
  imports: [NgFor, FormsModule],
  templateUrl: './faculty-create-session.html',
  styleUrl: './faculty-create-session.css'
})
export class FacultyCreateSession implements OnInit {
  token = '';
  user: any;

  classes: any[] = [];
  subjects: any[] = [];

  selectedClassId = '';
  selectedSubjectId = '';

  date = '';
  periodNumber: number | null = null;
  summary = '';
  topicsInput = '';

  noteTitle = '';
  selectedFile: File | null = null;

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
      error: (err) => {
        alert(err?.error?.message || 'Error fetching subjects');
      }
    });
  }

  submitSession(): void {
  const topicsCovered = this.topicsInput
    .split(',')
    .map(t => t.trim())
    .filter(t => t);

  const formData = new FormData();

  formData.append('classId', this.selectedClassId);
  formData.append('subjectId', this.selectedSubjectId);
  formData.append('date', this.date);
  formData.append('periodNumber', String(this.periodNumber));
  formData.append('summary', this.summary);
  formData.append('topicsCovered', JSON.stringify(topicsCovered));

  // OPTIONAL FILE
  if (this.selectedFile && this.noteTitle) {
    formData.append('file', this.selectedFile);
    formData.append('noteTitle', this.noteTitle);
  }

  this.http.post(
    '${environment.apiUrl}/api/sessions/create',
    formData,
    {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    }
  ).subscribe({
    next: () => {
      alert('Session created successfully');

      // reset optional fields
      this.noteTitle = '';
      this.selectedFile = null;
    },
    error: (err) => {
      alert(err?.error?.message || 'Error creating session');
    }
  });
}


  onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.selectedFile = input.files[0];
  }
}
  

  goBack(): void {
    this.router.navigate(['/faculty-home']);
  }
}