import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NeedInvestmentComponent } from './need-investment.component';

describe('NeedInvestmentComponent', () => {
  let component: NeedInvestmentComponent;
  let fixture: ComponentFixture<NeedInvestmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NeedInvestmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NeedInvestmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
