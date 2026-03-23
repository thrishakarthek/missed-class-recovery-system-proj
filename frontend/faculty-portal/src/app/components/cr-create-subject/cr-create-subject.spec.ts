import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrCreateSubject } from './cr-create-subject';

describe('CrCreateSubject', () => {
  let component: CrCreateSubject;
  let fixture: ComponentFixture<CrCreateSubject>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrCreateSubject],
    }).compileComponents();

    fixture = TestBed.createComponent(CrCreateSubject);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
