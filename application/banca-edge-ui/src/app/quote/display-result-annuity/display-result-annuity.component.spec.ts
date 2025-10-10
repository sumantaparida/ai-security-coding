import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayResultAnnuityComponent } from './display-result-annuity.component';

describe('DisplayResultAnnuityComponent', () => {
  let component: DisplayResultAnnuityComponent;
  let fixture: ComponentFixture<DisplayResultAnnuityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayResultAnnuityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayResultAnnuityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
