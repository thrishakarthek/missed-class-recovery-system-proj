import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacultyCreateSession } from './faculty-create-session';

describe('FacultyCreateSession', () => {
  let component: FacultyCreateSession;
  let fixture: ComponentFixture<FacultyCreateSession>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacultyCreateSession],
    }).compileComponents();

    fixture = TestBed.createComponent(FacultyCreateSession);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
