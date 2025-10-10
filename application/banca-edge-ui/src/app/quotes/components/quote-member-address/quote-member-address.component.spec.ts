import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteMemberAddressComponent } from './quote-member-address.component';

describe('QuoteMemberAddressComponent', () => {
  let component: QuoteMemberAddressComponent;
  let fixture: ComponentFixture<QuoteMemberAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuoteMemberAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteMemberAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
