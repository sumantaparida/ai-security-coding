import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineLifePurchaseComponent } from './offline-life-purchase.component';

describe('OfflineLifePurchaseComponent', () => {
  let component: OfflineLifePurchaseComponent;
  let fixture: ComponentFixture<OfflineLifePurchaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflineLifePurchaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineLifePurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
