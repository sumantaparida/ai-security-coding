import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteMotorInsuranceComponent } from './quote-motor-insurance.component';

describe('QuoteMotorInsuranceComponent', () => {
  let component: QuoteMotorInsuranceComponent;
  let fixture: ComponentFixture<QuoteMotorInsuranceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuoteMotorInsuranceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteMotorInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
