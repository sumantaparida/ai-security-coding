import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteAnnuityComponent } from './quote-annuity.component';

describe('QuoteAnnuityComponent', () => {
  let component: QuoteAnnuityComponent;
  let fixture: ComponentFixture<QuoteAnnuityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuoteAnnuityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteAnnuityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
