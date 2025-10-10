import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalSectionComponent } from './medical-section.component';

describe('MedicalSectionComponent', () => {
  let component: MedicalSectionComponent;
  let fixture: ComponentFixture<MedicalSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicalSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
