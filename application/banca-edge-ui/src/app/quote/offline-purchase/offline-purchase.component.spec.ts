import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflinePurchaseComponent } from './offline-purchase.component';

describe('OfflinePurchaseComponent', () => {
  let component: OfflinePurchaseComponent;
  let fixture: ComponentFixture<OfflinePurchaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflinePurchaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflinePurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
