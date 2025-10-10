import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CisOtpComponent } from './cis-otp.component';

describe('CisOtpComponent', () => {
  let component: CisOtpComponent;
  let fixture: ComponentFixture<CisOtpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CisOtpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CisOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
