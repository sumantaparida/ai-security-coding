import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteCriticalIllnessComponent } from './quote-critical-illness.component';

describe('QuoteCriticalIllnessComponent', () => {
  let component: QuoteCriticalIllnessComponent;
  let fixture: ComponentFixture<QuoteCriticalIllnessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuoteCriticalIllnessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteCriticalIllnessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
