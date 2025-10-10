import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayResultQuoteComponent } from './display-result-quote.component';

describe('DisplayResultQuoteComponent', () => {
  let component: DisplayResultQuoteComponent;
  let fixture: ComponentFixture<DisplayResultQuoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayResultQuoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayResultQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
