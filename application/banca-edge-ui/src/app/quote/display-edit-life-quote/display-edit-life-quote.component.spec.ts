import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayEditLifeQuoteComponent } from './display-edit-life-quote.component';

describe('DisplayEditLifeQuoteComponent', () => {
  let component: DisplayEditLifeQuoteComponent;
  let fixture: ComponentFixture<DisplayEditLifeQuoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayEditLifeQuoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayEditLifeQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
