import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NeedLoanComponent } from './need-loan.component';

describe('NeedLoanComponent', () => {
  let component: NeedLoanComponent;
  let fixture: ComponentFixture<NeedLoanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NeedLoanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NeedLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
