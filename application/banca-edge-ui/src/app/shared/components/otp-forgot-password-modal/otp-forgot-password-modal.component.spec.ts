import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpForgotPasswordModalComponent } from './otp-forgot-password-modal.component';

describe('OtpForgotPasswordModalComponent', () => {
  let component: OtpForgotPasswordModalComponent;
  let fixture: ComponentFixture<OtpForgotPasswordModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtpForgotPasswordModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtpForgotPasswordModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
