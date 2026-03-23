import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacultyGeneralNotes } from './faculty-general-notes';

describe('FacultyGeneralNotes', () => {
  let component: FacultyGeneralNotes;
  let fixture: ComponentFixture<FacultyGeneralNotes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacultyGeneralNotes],
    }).compileComponents();

    fixture = TestBed.createComponent(FacultyGeneralNotes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
