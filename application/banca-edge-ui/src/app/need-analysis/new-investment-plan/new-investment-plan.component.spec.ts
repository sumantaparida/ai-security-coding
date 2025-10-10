import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewInvestmentPlanComponent } from './new-investment-plan.component';

describe('NewInvestmentPlanComponent', () => {
  let component: NewInvestmentPlanComponent;
  let fixture: ComponentFixture<NewInvestmentPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewInvestmentPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewInvestmentPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
