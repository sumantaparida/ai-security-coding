import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCustomerModalComponent } from './select-customer-modal.component';

describe('SelectCustomerModalComponent', () => {
  let component: SelectCustomerModalComponent;
  let fixture: ComponentFixture<SelectCustomerModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectCustomerModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectCustomerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
