import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteHealthHospitalisationComponent } from './quote-health-hospitalisation.component';

describe('QuoteHealthHospitalisationComponent', () => {
  let component: QuoteHealthHospitalisationComponent;
  let fixture: ComponentFixture<QuoteHealthHospitalisationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuoteHealthHospitalisationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteHealthHospitalisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
