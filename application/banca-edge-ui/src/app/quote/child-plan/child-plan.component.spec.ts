import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildPlanComponent } from './child-plan.component';

describe('ChildPlanComponent', () => {
  let component: ChildPlanComponent;
  let fixture: ComponentFixture<ChildPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChildPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
