import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMotorQuoteComponent } from './edit-motor-quote.component';

describe('EditMotorQuoteComponent', () => {
  let component: EditMotorQuoteComponent;
  let fixture: ComponentFixture<EditMotorQuoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMotorQuoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMotorQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
