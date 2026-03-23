import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrSignup } from './cr-signup';

describe('CrSignup', () => {
  let component: CrSignup;
  let fixture: ComponentFixture<CrSignup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrSignup],
    }).compileComponents();

    fixture = TestBed.createComponent(CrSignup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
