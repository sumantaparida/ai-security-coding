import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerMobileNoDobModalComponent } from './customer-mobile-no-dob-modal.component';

describe('CustomerMobileNoDobModalComponent', () => {
  let component: CustomerMobileNoDobModalComponent;
  let fixture: ComponentFixture<CustomerMobileNoDobModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerMobileNoDobModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerMobileNoDobModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
