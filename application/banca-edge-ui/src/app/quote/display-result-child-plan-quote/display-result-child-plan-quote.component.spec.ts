import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayResultChildPlanQuoteComponent } from './display-result-child-plan-quote.component';

describe('DisplayResultChildPlanQuoteComponent', () => {
  let component: DisplayResultChildPlanQuoteComponent;
  let fixture: ComponentFixture<DisplayResultChildPlanQuoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayResultChildPlanQuoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayResultChildPlanQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
