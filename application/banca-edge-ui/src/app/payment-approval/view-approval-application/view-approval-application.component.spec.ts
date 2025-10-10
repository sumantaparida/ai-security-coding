import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewApprovalApplicationComponent } from './view-approval-application.component';

describe('ViewApplicationComponent', () => {
  let component: ViewApprovalApplicationComponent;
  let fixture: ComponentFixture<ViewApprovalApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewApprovalApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewApprovalApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
