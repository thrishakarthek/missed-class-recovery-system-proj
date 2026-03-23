import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgModel } from '@angular/forms';
import { NgFor } from '@angular/common';
import { AuthService } from '../../services/auth';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cr-create-subject',
  standalone: true,
  imports: [FormsModule, NgFor],
  templateUrl: './cr-create-subject.html',
  styleUrl: './cr-create-subject.css'
})
export class CrCreateSubject implements OnInit {
  token = '';

  classes: any[] = [];
  facultyUsers: any[] = [];

  selectedClassId = '';
  subjectName = '';
  subjectCode = '';
  selectedFacultyId = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {
    this.token = this.authService.getToken() || '';
  }

  ngOnInit(): void {
    this.fetchClasses();
    this.fetchFacultyUsers();
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

  fetchFacultyUsers(): void {
    this.http.get<any>('http://localhost:5000/api/auth/faculty-users', {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    }).subscribe({
      next: (res) => {
        this.facultyUsers = res.facultyUsers || [];
      },
      error: (err) => {
        alert(err?.error?.message || 'Error fetching faculty users');
      }
    });
  }

  createSubject(): void {
    if (!this.subjectName || !this.subjectCode || !this.selectedClassId || !this.selectedFacultyId) {
      alert('All fields are required');
      return;
    }

    this.http.post(
      'http://localhost:5000/api/subjects/create',
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
        this.selectedFacultyId = '';
      },
      error: (err) => {
        alert(err?.error?.message || 'Error creating subject');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/cr-home']);
  }
}