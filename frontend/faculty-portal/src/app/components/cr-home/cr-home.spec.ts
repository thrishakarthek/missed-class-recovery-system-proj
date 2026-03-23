import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrHome } from './cr-home';

describe('CrHome', () => {
  let component: CrHome;
  let fixture: ComponentFixture<CrHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrHome],
    }).compileComponents();

    fixture = TestBed.createComponent(CrHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
