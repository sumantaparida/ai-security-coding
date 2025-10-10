import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupcreditLeadsComponent } from './groupcredit-leads.component';

describe('GroupcreditLeadsComponent', () => {
  let component: GroupcreditLeadsComponent;
  let fixture: ComponentFixture<GroupcreditLeadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GroupcreditLeadsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupcreditLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
