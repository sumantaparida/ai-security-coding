import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteLifeInsuranceComponent } from './quote-life-insurance.component';

describe('QuoteLifeInsuranceComponent', () => {
  let component: QuoteLifeInsuranceComponent;
  let fixture: ComponentFixture<QuoteLifeInsuranceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuoteLifeInsuranceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteLifeInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
