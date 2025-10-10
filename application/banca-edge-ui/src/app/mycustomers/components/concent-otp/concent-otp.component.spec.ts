import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcentOtpComponent } from './concent-otp.component';

describe('ConcentOtpComponent', () => {
  let component: ConcentOtpComponent;
  let fixture: ComponentFixture<ConcentOtpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConcentOtpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcentOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
