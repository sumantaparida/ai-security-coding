import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineChildplanPurchaseComponent } from './offline-childplan-purchase.component';

describe('OfflineChildplanPurchaseComponent', () => {
  let component: OfflineChildplanPurchaseComponent;
  let fixture: ComponentFixture<OfflineChildplanPurchaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflineChildplanPurchaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineChildplanPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
