import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteLifeProtectionComponent } from './quote-life-protection.component';

describe('QuoteLifeProtectionComponent', () => {
  let component: QuoteLifeProtectionComponent;
  let fixture: ComponentFixture<QuoteLifeProtectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuoteLifeProtectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteLifeProtectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
