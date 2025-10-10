import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLoanDetailsComponent } from './edit-loan-details.component';

describe('EditLoanDetailsComponent', () => {
  let component: EditLoanDetailsComponent;
  let fixture: ComponentFixture<EditLoanDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditLoanDetailsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLoanDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
