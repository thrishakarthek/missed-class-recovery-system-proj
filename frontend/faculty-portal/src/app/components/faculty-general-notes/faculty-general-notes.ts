import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-faculty-general-notes',
  standalone: true,
  imports: [NgFor, FormsModule],
  templateUrl: './faculty-general-notes.html',
  styleUrl: './faculty-general-notes.css'
})
export class FacultyGeneralNotes implements OnInit {
  token = '';
  classes: any[] = [];
  subjects: any[] = [];

  selectedClassId = '';
  selectedSubjectId = '';
  generalTitle = '';
  selectedGeneralFile: File | null = null;

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
      'http://localhost:5000/api/subjects/upload-general-note',
      formData,
      {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }
    ).subscribe({
      next: () => {
        alert('General note uploaded successfully');
      },
      error: (err) => {
        alert(err?.error?.message || 'Error uploading general note');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/faculty-home']);
  }
}