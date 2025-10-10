import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayResultTravelQuoteComponent } from './display-result-travel-quote.component';

describe('DisplayResultTravelQuoteComponent', () => {
  let component: DisplayResultTravelQuoteComponent;
  let fixture: ComponentFixture<DisplayResultTravelQuoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayResultTravelQuoteComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayResultTravelQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
