import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerMailIdComponent } from './customer-mail-id.component';

describe('CustomerMailIdComponent', () => {
  let component: CustomerMailIdComponent;
  let fixture: ComponentFixture<CustomerMailIdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerMailIdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerMailIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
