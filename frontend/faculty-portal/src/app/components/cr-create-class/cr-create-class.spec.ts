import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrCreateClass } from './cr-create-class';

describe('CrCreateClass', () => {
  let component: CrCreateClass;
  let fixture: ComponentFixture<CrCreateClass>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrCreateClass],
    }).compileComponents();

    fixture = TestBed.createComponent(CrCreateClass);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
