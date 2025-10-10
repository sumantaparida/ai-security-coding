import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreDetailChildPlanComponent } from './more-detail-child-plan.component';

describe('MoreDetailChildPlanComponent', () => {
  let component: MoreDetailChildPlanComponent;
  let fixture: ComponentFixture<MoreDetailChildPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoreDetailChildPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoreDetailChildPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
