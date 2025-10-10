import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnualIncomeComponent } from './annual-income.component';

describe('AnnualIncomeComponent', () => {
  let component: AnnualIncomeComponent;
  let fixture: ComponentFixture<AnnualIncomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnualIncomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnualIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
