import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetakeOneMinPlanComponent } from './retake-one-min-plan.component';

describe('RetakeOneMinPlanComponent', () => {
  let component: RetakeOneMinPlanComponent;
  let fixture: ComponentFixture<RetakeOneMinPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetakeOneMinPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetakeOneMinPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
