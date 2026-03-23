import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrDashboard } from './cr-dashboard';

describe('CrDashboard', () => {
  let component: CrDashboard;
  let fixture: ComponentFixture<CrDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrDashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(CrDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
