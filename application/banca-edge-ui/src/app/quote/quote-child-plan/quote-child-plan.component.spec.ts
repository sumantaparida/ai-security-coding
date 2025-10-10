import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteChildPlanComponent } from './quote-child-plan.component';

describe('QuoteChildPlanComponent', () => {
  let component: QuoteChildPlanComponent;
  let fixture: ComponentFixture<QuoteChildPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuoteChildPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteChildPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
