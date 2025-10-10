import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteThroughQrComponent } from './quote-through-qr.component';

describe('QuoteThroughQrComponent', () => {
  let component: QuoteThroughQrComponent;
  let fixture: ComponentFixture<QuoteThroughQrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuoteThroughQrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteThroughQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
