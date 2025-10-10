import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpApprovalComponent } from './sp-approval.component';

describe('SpApprovalComponent', () => {
  let component: SpApprovalComponent;
  let fixture: ComponentFixture<SpApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
