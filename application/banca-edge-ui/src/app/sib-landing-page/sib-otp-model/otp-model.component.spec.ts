import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SibOtpModelComponent } from './otp-model.component';

describe('SibOtpModelComponent', () => {
  let component: SibOtpModelComponent;
  let fixture: ComponentFixture<SibOtpModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SibOtpModelComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SibOtpModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
