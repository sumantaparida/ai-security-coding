import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateQuoteComponent } from './generate-quote.component';

describe('GenerateQuoteComponent', () => {
  let component: GenerateQuoteComponent;
  let fixture: ComponentFixture<GenerateQuoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateQuoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
