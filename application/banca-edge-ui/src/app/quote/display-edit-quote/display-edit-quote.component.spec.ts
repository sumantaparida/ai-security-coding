import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayEditQuoteComponent } from './display-edit-quote.component';

describe('DisplayEditQuoteComponent', () => {
  let component: DisplayEditQuoteComponent;
  let fixture: ComponentFixture<DisplayEditQuoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayEditQuoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayEditQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
