import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { LoanSearchComponent } from './loan-search.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AddLoanDetailsComponent } from '../add-loan-details/add-loan-details.component';
import { Router } from '@angular/router';

fdescribe('LoanSearchComponent', () => {
  let component: LoanSearchComponent;
  let fixture: ComponentFixture<LoanSearchComponent>;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
      ],
      declarations: [LoanSearchComponent, AddLoanDetailsComponent],
      providers: []
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('onSubmitClicked method should emit Object with inputype value as 1', () => {
    // Assert
    const submitClickedSpy = spyOn(component.submitClicked, 'emit');
    component.searchByLoan.get('loanAccountNo').setValue('12345612345685');
    const valueToEmit = {
      inputType: '1',
      loanAccountNo: '12345612345685',
    };

    // Action
    component.onSubmitClicked();

    // Accept
    expect(submitClickedSpy).toHaveBeenCalledWith(valueToEmit);
  });

  it('onSubmitClicked method should emit Object with inputype value as 2', () => {
    // Assert
    const submitClickedSpy = spyOn(component.submitClicked, 'emit');
    component.searchByLoan.get('loanAccountNo').setValue('12345612345685');
    component.searchByLoan.get('inputType').setValue(false);
    const valueToEmit = {
      inputType: '2',
      loanAccountNo: '12345612345685',
    };

    // Action
    component.onSubmitClicked();

    // Accept
    expect(submitClickedSpy).toHaveBeenCalledWith(valueToEmit);
  });

  it('onToggled should reset loanAccountNo control', () => {
    // ASSERT
    component.searchByLoan.get('loanAccountNo').setValue('12345612345685');

    //  Action
    component.onToggled();

    // ACCEPT
    expect(component.searchByLoan.get('loanAccountNo').value).toBe(null);
  });

  it('ngOnChanges should set control type inputType to false and loanAccountNo to 12345612345685', () => {
    // ASSERT
    const changes = {
      inputType: {
        currentValue: '2'
      },
      loanAccountNo: {
        currentValue: '12345612345685'
      }
    };

    // Action
    component.ngOnChanges(changes);

    // Accept
    expect(component.searchByLoan.get('inputType').value).toBe(false);
    expect(component.searchByLoan.get('loanAccountNo').value).toBe('12345612345685');

  });

  it('ngOnChanges should set control type inputType to true and loanAccountNo to 12345612345685', () => {
    // ASSERT
    const changes = {
      inputType: {
        currentValue: '1'
      },
      loanAccountNo: {
        currentValue: '12345612345685'
      }
    };

    // Action
    component.ngOnChanges(changes);

    // Accept
    expect(component.searchByLoan.get('inputType').value).toBe(true);
    expect(component.searchByLoan.get('loanAccountNo').value).toBe('12345612345685');

  });

  it('ngOnChanges should not set control type inputType and loanAccountNo', () => {
    // ASSERT
    component.searchByLoan.get('inputType').setValue(null);
    component.searchByLoan.get('loanAccountNo').setValue(null);
    const changes = {};

    // Action
    component.ngOnChanges(changes);

    // Accept
    expect(component.searchByLoan.get('inputType').value).toBe(null);
    expect(component.searchByLoan.get('loanAccountNo').value).toBe(null);

  });

  it('OnClick should Navigate to groupCredit add Loan', () => {
    const navigateByUrlSpy = spyOn(TestBed.inject(Router), 'navigateByUrl');

    component.onClick();

    expect(navigateByUrlSpy).toHaveBeenCalledWith('group-credit/add-loan');
  });

});
