import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayEditMotorQuoteComponent } from './display-edit-motor-quote.component';

describe('DisplayEditMotorQuoteComponent', () => {
  let component: DisplayEditMotorQuoteComponent;
  let fixture: ComponentFixture<DisplayEditMotorQuoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayEditMotorQuoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayEditMotorQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
