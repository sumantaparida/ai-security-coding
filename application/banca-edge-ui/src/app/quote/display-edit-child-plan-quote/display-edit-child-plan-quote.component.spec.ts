import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayEditChildPlanQuoteComponent } from './display-edit-child-plan-quote.component';

describe('DisplayEditChildPlanQuoteComponent', () => {
  let component: DisplayEditChildPlanQuoteComponent;
  let fixture: ComponentFixture<DisplayEditChildPlanQuoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayEditChildPlanQuoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayEditChildPlanQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
