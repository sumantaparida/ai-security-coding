import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalRequirementComponent } from './medical-requirement.component';

describe('MedicalRequirementComponent', () => {
  let component: MedicalRequirementComponent;
  let fixture: ComponentFixture<MedicalRequirementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicalRequirementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalRequirementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
