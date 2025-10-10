import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalNegativeFollowUpPopupFormComponent } from './medical-negative-follow-up-popup-form.component';

describe('MedicalNegativeFollowUpPopupFormComponent', () => {
  let component: MedicalNegativeFollowUpPopupFormComponent;
  let fixture: ComponentFixture<MedicalNegativeFollowUpPopupFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicalNegativeFollowUpPopupFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalNegativeFollowUpPopupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
