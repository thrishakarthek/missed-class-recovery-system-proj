import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacultySignup } from './faculty-signup';

describe('FacultySignup', () => {
  let component: FacultySignup;
  let fixture: ComponentFixture<FacultySignup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacultySignup],
    }).compileComponents();

    fixture = TestBed.createComponent(FacultySignup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
