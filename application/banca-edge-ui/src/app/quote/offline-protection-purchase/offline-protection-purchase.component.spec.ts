import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineProtectionPurchaseComponent } from './offline-protection-purchase.component';

describe('OfflineProtectionPurchaseComponent', () => {
  let component: OfflineProtectionPurchaseComponent;
  let fixture: ComponentFixture<OfflineProtectionPurchaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflineProtectionPurchaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineProtectionPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
