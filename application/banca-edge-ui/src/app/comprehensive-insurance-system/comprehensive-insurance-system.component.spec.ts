import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprehensiveInsuranceSystemComponent } from './comprehensive-insurance-system.component';

describe('ComprehensiveInsuranceSystemComponent', () => {
  let component: ComprehensiveInsuranceSystemComponent;
  let fixture: ComponentFixture<ComprehensiveInsuranceSystemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ComprehensiveInsuranceSystemComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprehensiveInsuranceSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
