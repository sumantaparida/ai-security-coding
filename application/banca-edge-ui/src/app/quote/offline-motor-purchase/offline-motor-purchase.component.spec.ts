import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineMotorPurchaseComponent } from './offline-motor-purchase.component';

describe('OfflineMotorPurchaseComponent', () => {
  let component: OfflineMotorPurchaseComponent;
  let fixture: ComponentFixture<OfflineMotorPurchaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflineMotorPurchaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineMotorPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
