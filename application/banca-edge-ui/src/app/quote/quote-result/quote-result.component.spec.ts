import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteResultComponent } from './quote-result.component';

describe('QuoteResultComponent', () => {
  let component: QuoteResultComponent;
  let fixture: ComponentFixture<QuoteResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuoteResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
