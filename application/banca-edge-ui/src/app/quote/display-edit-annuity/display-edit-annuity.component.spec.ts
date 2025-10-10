import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayEditAnnuityComponent } from './display-edit-annuity.component';

describe('DisplayEditAnnuityComponent', () => {
  let component: DisplayEditAnnuityComponent;
  let fixture: ComponentFixture<DisplayEditAnnuityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayEditAnnuityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayEditAnnuityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
