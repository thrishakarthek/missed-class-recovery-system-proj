import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrLogin } from './cr-login';

describe('CrLogin', () => {
  let component: CrLogin;
  let fixture: ComponentFixture<CrLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrLogin],
    }).compileComponents();

    fixture = TestBed.createComponent(CrLogin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
