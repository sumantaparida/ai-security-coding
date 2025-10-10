import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayResultProtectionQuoteComponent } from './display-result-protection-quote.component';

describe('DisplayResultProtectionQuoteComponent', () => {
  let component: DisplayResultProtectionQuoteComponent;
  let fixture: ComponentFixture<DisplayResultProtectionQuoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayResultProtectionQuoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayResultProtectionQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
