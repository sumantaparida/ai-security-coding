import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthInsuranceproposerdialogComponent } from './health-insuranceproposerdialog.component';

describe('HealthInsuranceproposerdialogComponent', () => {
  let component: HealthInsuranceproposerdialogComponent;
  let fixture: ComponentFixture<HealthInsuranceproposerdialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthInsuranceproposerdialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthInsuranceproposerdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
