import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LoanService } from '@app/loan-account/service/loan.service';
import { User } from '@app/_models';
import { AccountService } from '@app/_services';
import { LoaderService } from '@app/_services/loader.service';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { AddLoanDetailsComponent } from './add-loan-details.component';

class LoaderServiceStub {
  public showSpinner(value) {
    return value;
  }
}

class AccountServiceStub {
  public user: BehaviorSubject<User> = new BehaviorSubject({
    firstName: 'Sunjith',
    lastName: 'Ps',
    organizationCode: 'BOM',
    orgLogo: 'https://s3.amazonaws.com/lastdecimal.brokeredge.data/ilogo/bom.svg',
    branchCode: '9999',
    userName: 'Sunjith.ps@lastdecimal.com',
    mobileNo: '9538175232',
    email: 'Sunjith.ps@lastdecimal.com',
    isSP: false,
    isBankCustomer: false,
    isInsurerUser: false,
    insurerId: 0,
    roles: ['BRANCH.POLICY.VIEW', 'BRANCH.COMPLAINT.CREATE', 'BRANCH.QUOTE.CREATE', 'BRANCH.SR.RESOLVE', 'BRANCH.SR.VIEW', 'BRANCH.CUSTOMER.VIEW', 'BRANCH.ACTIVITIES.LIST', 'BRANCH.CUSTOMER.CREATE', 'BRANCH.COMPLAINT.RESOLVE', 'BRANCH.QUOTE.VIEW', 'BRANCH.PAYMENT.INITIATE', 'BRANCH.POLICY.CREATE', 'BRANCH.CUSTOMER.EDIT', 'BRANCH.POLICY.EDIT', 'BRANCH.SR.CREATE', 'BRANCH.POLICY.SERVICE', 'BRANCH.PAYMENT.VIEW', 'BRANCH.REPORT.VIEW'],
    sendEmailOnCreate: false,
    sp: false,
    insurerUser: false,
    bankCustomer: false,
    allowedBranches: []
  });
}

class RouterMock {
  public navigate(path: any[]) { }
}

class MatDialogMock {
  public open(component, properties) {
    return {
      afterClosed: () => {
        return of({
          firstName: 'Sameer',
          lastName: 'PS',
          gender: 'M',
          dob: '12-10-1992',
          mobileNo: '95959636985',
          email: 'sups@gmail.com'
        });
      }
    };
  }
}

fdescribe('AddLoanDetailsComponent', () => {
  let component: AddLoanDetailsComponent;
  let fixture: ComponentFixture<AddLoanDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddLoanDetailsComponent],
      providers: [LoanService,
        { provide: AccountService, useClass: AccountServiceStub },
        { provide: LoaderService, useClass: LoaderServiceStub },
        { provide: Router, useClass: RouterMock },
        { provide: MatDialog, useClass: MatDialogMock }
      ],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        MatSelectModule,
        MatInputModule,
        MatFormFieldModule,
        BrowserAnimationsModule

      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLoanDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('ngOnInit method should add coBorrower related controls', () => {

    // Assert
    const titleMaster = [{
      id: 'MASTER',
      value: 'Master',
      gender: 'M'
    },
    {
      id: 'MR',
      value: 'Mr.',
      gender: 'M'
    },
    {
      id: 'MRS',
      value: 'Mrs.',
      gender: 'F'
    },
    {
      id: 'MISS',
      value: 'Ms.',
      gender: 'M'
    }];

    const loanTypeMaster = [{
      id: '1',
      value: 'Car Loan'
    },
    {
      id: '2',
      value: 'Schematic Home Loan'
    },
    {
      id: '3',
      value: 'Loan Against Property'
    },
    {
      id: '4',
      value: 'Education Loan'
    },
    {
      id: '5',
      value: 'Personal and Business Loan'
    }];

    const allowedBranches = [{
      organizationCode: 'BOM',
      branchCode: '01',
      branchName: 'Pune-Bajirao Road',
      parentBranchCode: '9999'
    },
    {
      organizationCode: 'BOM',
      branchCode: '02',
      branchName: 'Pune-Deccan Gymkhana',
      parentBranchCode: '9999'
    },
    {
      organizationCode: 'BOM',
      branchCode: '9999',
      branchName: 'HeadQuaters',
      parentBranchCode: '0'
    }];

    spyOn(TestBed.inject(LoanService), 'addLoanDetails').and.callFake((addLoan) => of({ responseCode: 0 }));
    spyOn(TestBed.inject(LoanService), 'getFromMaster').and.callFake((productId, masterType) => {
      if (masterType === 'Title') {
        return of(titleMaster);
      } else if (masterType === 'LoanType') {
        return of(loanTypeMaster);
      }
    });
    spyOn(TestBed.inject(LoanService), 'getAllowedBranches').and.callFake(() => of(allowedBranches));
    component.addLoanDetailsForm.get('loanType').setValue('5');
    component.addLoanDetailsForm.get('hasCoBorrower').setValue('Y');

    // Action
    component.ngOnInit();

    // Accept
    expect(component.tilteMaster).toEqual(titleMaster);
    expect(component.loanTypeMaster).toEqual(loanTypeMaster);
    expect(component.addLoanDetailsForm.get('coBorrowerTitle')).toBeDefined();
    expect(component.addLoanDetailsForm.get('coBorrowerFirstName')).toBeDefined();
    expect(component.addLoanDetailsForm.get('coBorrowerLastName')).toBeDefined();
    expect(component.addLoanDetailsForm.get('coBorrowerDob')).toBeDefined();
    expect(component.addLoanDetailsForm.get('coBorrowerGender')).toBeDefined();
    expect(component.addLoanDetailsForm.get('coBorrowerMobile')).toBeDefined();
    expect(component.addLoanDetailsForm.get('coBorrowerEmail')).toBeDefined();
    expect(component.addLoanDetailsForm.get('primaryBorrowerShare')).toBeDefined();

  });

  it('ngOnInit method should remove coBorrower related controls', () => {

    // Assert
    const titleMaster = [{
      id: 'MASTER',
      value: 'Master',
      gender: 'M'
    },
    {
      id: 'MR',
      value: 'Mr.',
      gender: 'M'
    },
    {
      id: 'MRS',
      value: 'Mrs.',
      gender: 'F'
    },
    {
      id: 'MISS',
      value: 'Ms.',
      gender: 'M'
    }];

    const loanTypeMaster = [{
      id: '1',
      value: 'Car Loan'
    },
    {
      id: '2',
      value: 'Schematic Home Loan'
    },
    {
      id: '3',
      value: 'Loan Against Property'
    },
    {
      id: '4',
      value: 'Education Loan'
    },
    {
      id: '5',
      value: 'Personal and Business Loan'
    }];

    const allowedBranches = [
      { organizationCode: 'BOM', branchCode: '01', branchName: 'Pune-Bajirao Road', parentBranchCode: '9999' },
      { organizationCode: 'BOM', branchCode: '02', branchName: 'Pune-Deccan Gymkhana', parentBranchCode: '9999' },
      { organizationCode: 'BOM', branchCode: '9999', branchName: 'HeadQuaters', parentBranchCode: '0' }]

    spyOn(TestBed.inject(LoanService), 'addLoanDetails').and.callFake((addLoan) => of({ responseCode: 0 }));
    spyOn(TestBed.inject(LoanService), 'getFromMaster').and.callFake((productId, masterType) => {
      if (masterType === 'Title') {
        return of(titleMaster);
      } else if (masterType === 'LoanType') {
        return of(loanTypeMaster);
      }
    });
    spyOn(TestBed.inject(LoanService), 'getAllowedBranches').and.callFake(() => of(allowedBranches));
    component.addLoanDetailsForm.get('loanType').setValue('5');
    component.addLoanDetailsForm.get('hasCoBorrower').setValue('N');
    component.addLoanDetailsForm.get('loanStartDate').setValue(new Date());

    // Action
    component.ngOnInit();

    // Accept
    expect(component.tilteMaster).toEqual(titleMaster);
    expect(component.loanTypeMaster).toEqual(loanTypeMaster);
    expect(component.addLoanDetailsForm.get('coBorrowerTitle')).toEqual(null);
    expect(component.addLoanDetailsForm.get('coBorrowerFirstName')).toEqual(null);
    expect(component.addLoanDetailsForm.get('coBorrowerLastName')).toEqual(null);
    expect(component.addLoanDetailsForm.get('coBorrowerDob')).toEqual(null);
    expect(component.addLoanDetailsForm.get('coBorrowerGender')).toEqual(null);
    expect(component.addLoanDetailsForm.get('coBorrowerMobile')).toEqual(null);
    expect(component.addLoanDetailsForm.get('coBorrowerEmail')).toEqual(null);
    expect(component.addLoanDetailsForm.get('primaryBorrowerShare')).toEqual(null);

  });

  it('onSubmitClick method should navigate to group credit page', () => {

    // Assert
    const loaderService = TestBed.inject(LoaderService);
    const showLoaderSpy = spyOn(loaderService, 'showSpinner');
    const navigateSpy = spyOn(TestBed.inject(Router), 'navigate');
    const dialogOpenSpy = spyOn(TestBed.inject(MatDialog), 'open');
    spyOn(TestBed.inject(LoanService), 'addLoanDetails').and.callFake((addLoan) => of({ responseCode: 0 }));
    component.addLoanDetailsForm.get('hasCoBorrower').setValue('Y');
    component.addLoanDetailsForm.get('loanAccouontNo').setValue('12345678912');

    // Action
    component.onSubmit();

    // Accept
    expect(showLoaderSpy).toHaveBeenCalledTimes(2);
    expect(navigateSpy).toHaveBeenCalledWith(['group-credit', '2', '12345678912']);
    expect(dialogOpenSpy).toHaveBeenCalledTimes(0);

  });

  it('onSubmitClick method should not navigate to group credit page, instead it shold open and show the dialog', () => {

    // Assert
    const loaderService = TestBed.inject(LoaderService);
    const showLoaderSpy = spyOn(loaderService, 'showSpinner');
    const navigateSpy = spyOn(TestBed.inject(Router), 'navigate');
    const dialogOpenSpy = spyOn(TestBed.inject(MatDialog), 'open');
    spyOn(TestBed.inject(LoanService), 'addLoanDetails').and.callFake((addLoan) => of({
      responseCode: 1,
      responseMessage: 'Error Exists'
    }));
    component.addLoanDetailsForm.get('hasCoBorrower').setValue('N');
    component.addLoanDetailsForm.get('loanAccouontNo').setValue('12345678912');
    component.addLoanDetailsForm.get('loanType').setValue('4');

    // Action
    component.onSubmit();

    // Accept
    expect(showLoaderSpy).toHaveBeenCalledTimes(2);
    expect(navigateSpy).toHaveBeenCalledTimes(0);
    expect(dialogOpenSpy).toHaveBeenCalledTimes(1);
  });

  it('openCustomerDailog method should open dialog and assign borrower related controls', () => {

    component.openCustomerDailog('borrower');

    expect(component.addLoanDetailsForm.get('primaryBorrowerFirstName').value).toEqual('Sameer');
  });

  it('openCustomerDailog method should open dialog and assign coborrower related controls', () => {

    component.addLoanDetailsForm.addControl('coBorrowerTitle', new FormControl('', Validators.required));
    component.addLoanDetailsForm.addControl('coBorrowerFirstName', new FormControl('',
      [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern('^[a-zA-z ]+$')]));
    component.addLoanDetailsForm.addControl('coBorrowerLastName', new FormControl('', Validators.required));
    component.addLoanDetailsForm.addControl('coBorrowerDob', new FormControl('', Validators.required));
    component.addLoanDetailsForm.addControl('coBorrowerGender', new FormControl('', Validators.required));
    component.addLoanDetailsForm.addControl('coBorrowerMobile', new FormControl('',
      [Validators.required, Validators.pattern('^[6789][0-9]{9}$')]));
    component.addLoanDetailsForm.addControl('coBorrowerEmail', new FormControl('', [Validators.required, Validators.email]));
    component.addLoanDetailsForm.addControl('primaryBorrowerShare', new FormControl('', [Validators.required,
    Validators.min(50), Validators.max(100)]));
    component.openCustomerDailog('co-borrower');

    expect(component.addLoanDetailsForm.get('coBorrowerFirstName').value).toEqual('Sameer');
  });
});
