import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreDetailProtectionComponent } from './more-detail-protection.component';

describe('MoreDetailProtectionComponent', () => {
  let component: MoreDetailProtectionComponent;
  let fixture: ComponentFixture<MoreDetailProtectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoreDetailProtectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoreDetailProtectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
