import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayEditProtectionQuoteComponent } from './display-edit-protection-quote.component';

describe('DisplayEditProtectionQuoteComponent', () => {
  let component: DisplayEditProtectionQuoteComponent;
  let fixture: ComponentFixture<DisplayEditProtectionQuoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayEditProtectionQuoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayEditProtectionQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
