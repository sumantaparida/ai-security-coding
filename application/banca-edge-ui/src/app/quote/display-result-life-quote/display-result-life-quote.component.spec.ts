import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayResultLifeQuoteComponent } from './display-result-life-quote.component';

describe('DisplayResultLifeQuoteComponent', () => {
  let component: DisplayResultLifeQuoteComponent;
  let fixture: ComponentFixture<DisplayResultLifeQuoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayResultLifeQuoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayResultLifeQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
