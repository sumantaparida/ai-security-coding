import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayResultMotorQuoteComponent } from './display-result-motor-quote.component';

describe('DisplayResultMotorQuoteComponent', () => {
  let component: DisplayResultMotorQuoteComponent;
  let fixture: ComponentFixture<DisplayResultMotorQuoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayResultMotorQuoteComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayResultMotorQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
