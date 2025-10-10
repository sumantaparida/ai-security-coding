import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankB2cComponent } from './bank-b2c.component';

describe('BankB2cComponent', () => {
  let component: BankB2cComponent;
  let fixture: ComponentFixture<BankB2cComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankB2cComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankB2cComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
