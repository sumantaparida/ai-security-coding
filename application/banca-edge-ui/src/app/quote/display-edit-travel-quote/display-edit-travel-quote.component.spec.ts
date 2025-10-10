import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayEditTravelQuoteComponent } from './display-edit-travel-quote.component';

describe('DisplayEditQuoteComponent', () => {
  let component: DisplayEditTravelQuoteComponent;
  let fixture: ComponentFixture<DisplayEditTravelQuoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayEditTravelQuoteComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayEditTravelQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
