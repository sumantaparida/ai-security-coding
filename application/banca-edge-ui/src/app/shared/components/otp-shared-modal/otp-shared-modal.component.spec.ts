import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpSharedModalComponent } from './otp-shared-modal.component';

describe('OtpSharedModalComponent', () => {
  let component: OtpSharedModalComponent;
  let fixture: ComponentFixture<OtpSharedModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtpSharedModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtpSharedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
