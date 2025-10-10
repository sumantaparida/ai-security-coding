import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayQuoteResultComponent } from './display-quote-result.component';

describe('DisplayQuoteResultComponent', () => {
  let component: DisplayQuoteResultComponent;
  let fixture: ComponentFixture<DisplayQuoteResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayQuoteResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayQuoteResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
