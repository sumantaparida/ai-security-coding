import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteUnitLinkedComponent } from './quote-unit-linked.component';

describe('QuoteUnitLinkedComponent', () => {
  let component: QuoteUnitLinkedComponent;
  let fixture: ComponentFixture<QuoteUnitLinkedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuoteUnitLinkedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteUnitLinkedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
