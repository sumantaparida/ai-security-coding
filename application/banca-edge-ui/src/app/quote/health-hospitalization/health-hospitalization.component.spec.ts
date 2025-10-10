import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthHospitalizationComponent } from './health-hospitalization.component';

describe('HealthHospitalizationComponent', () => {
  let component: HealthHospitalizationComponent;
  let fixture: ComponentFixture<HealthHospitalizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HealthHospitalizationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthHospitalizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
