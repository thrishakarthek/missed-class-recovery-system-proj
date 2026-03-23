import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrAssignSchedule } from './cr-assign-schedule';

describe('CrAssignSchedule', () => {
  let component: CrAssignSchedule;
  let fixture: ComponentFixture<CrAssignSchedule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrAssignSchedule],
    }).compileComponents();

    fixture = TestBed.createComponent(CrAssignSchedule);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
