import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthInsuranceproposerComponent } from './health-insuranceproposer.component';

describe('HealthInsuranceproposerComponent', () => {
  let component: HealthInsuranceproposerComponent;
  let fixture: ComponentFixture<HealthInsuranceproposerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthInsuranceproposerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthInsuranceproposerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
