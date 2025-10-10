import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoanService } from '@app/loan-account/service/loan.service';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';
import { User } from '@app/_models';
import { AccountService } from '@app/_services';
import { LoaderService } from '@app/_services/loader.service';
import moment from 'moment';
import { CancelPromptModelComponent } from '../cancel-prompt-model/cancel-prompt-model.component';

@Component({
  selector: 'app-edit-loan-details',
  templateUrl: './edit-loan-details.component.html',
  styleUrls: ['./edit-loan-details.component.css'],
})
export class EditLoanDetailsComponent implements OnInit {
  user: User;

  addLoanDetailsForm;

  LoanDetails;

  allowedBranches;

  loanTypeMaster;

  minDate;

  loanEndMinDate;

  loanEndMaxDate;

  tilteMaster;

  minAgeRequired;

  seventyYears;

  hasCoBorrower;

  moratoriumPeriod;

  moratoriumSelect = false;

  typeOfLoanAmount = [
    { id: 'Sanctioned Amount', value: '' },
    { id: 'Outstanding Amount', value: '' },
  ];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private loanService: LoanService,
    private accountService: AccountService,
    private loaderService: LoaderService,

    private dialog: MatDialog,
  ) {
    this.LoanDetails = this.router.getCurrentNavigation().extras.state;
    console.log(this.LoanDetails);
    this.typeOfLoanAmount[0].value = this.LoanDetails.hasOwnProperty('sanctionedAmount')
      ? this.LoanDetails.sanctionedAmount
      : '';
    this.typeOfLoanAmount[1].value = this.LoanDetails.hasOwnProperty('outstandingAmount') ? this.LoanDetails.outstandingAmount
    : '';
    this.typeOfLoanAmount = this.typeOfLoanAmount.filter((loanAmtType) => {
      return (
        loanAmtType.value !== '' && loanAmtType.value !== null && loanAmtType.value !== undefined
      );
    });
    console.log(this.typeOfLoanAmount);
  }

  ngOnInit(): void {
    this.addLoanDetailsForm = this.fb.group({
      branchCode: [
        { value: '', disabled: true },
        [Validators.required, Validators.pattern('^[0-9]{1,4}$')],
      ],
      loanAccouontNo: [
        { value: '', disabled: true },
        [Validators.required, Validators.pattern('^[0-9]{11,15}$')],
      ],
      loanStartDate: [{ value: '', disabled: true }, [Validators.required]],
      loanEndDate: [{ value: '', disabled: true }, [Validators.required]],
      // hasCoBorrower: ['', [Validators.required]],
      primaryBorrowerTitle: [{ value: '', disabled: true }, [Validators.required]],
      primaryBorrowerFirstName: [
        { value: '', disabled: true },
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          Validators.pattern('^[a-zA-z ]+$'),
        ],
      ],
      primaryBorrowerLastName: [
        { value: '', disabled: true },
        [Validators.required, Validators.pattern('^[a-zA-z ]+$')],
      ],
      primaryBorrowerDob: [{ value: '', disabled: true }, [Validators.required]],
      primaryBorrowerGender: [{ value: '', disabled: true }, [Validators.required]],
      primaryBorrowerMobile: [
        { value: '', disabled: true },
        [Validators.pattern('^[6789][0-9]{9}$')],
      ],
      primaryBorrowerEmail: [{ value: '', disabled: true }, [Validators.email]],
      moratoriumPeriod: [''],
    });

    this.setFormValues();
  }

  setFormValues() {
    // if (this.LoanDetails?.loanType == 4 && this.LoanDetails.orgCode === 'BOM' ) {
    //   this.addLoanDetailsForm.addControl(
    //     'loanType',
    //     new FormControl({ value: '', disabled: true }, Validators.required),
    //   );
    //   this.addLoanDetailsForm.addControl(
    //     'totalLoanAmount',
    //     new FormControl({ value: '', disabled: true }, [
    //       Validators.required,
    //       Validators.pattern('^[0-9]+$'),
    //     ]),
    //   );
    // } else {}
    this.addLoanDetailsForm.addControl(
      'loanType',
      new FormControl({ value: '', disabled: false }, Validators.required),
    );
    this.addLoanDetailsForm.addControl(
      'totalLoanAmount',
      new FormControl({ value: '', disabled: false }, [
        Validators.required,
        Validators.pattern('^[0-9]+$'),
      ]),
    );

    this.addLoanDetailsForm.get('loanAccouontNo').setValue(this.LoanDetails?.loanAccountNo);
    // this.addLoanDetailsForm.get('totalLoanAmount').setValue(this.LoanDetails?.outstandingAmount);
    this.addLoanDetailsForm.get('loanStartDate').setValue(this.LoanDetails?.loanStartDate);
    this.addLoanDetailsForm.get('loanEndDate').setValue(this.LoanDetails?.loanEndDate);
    this.addLoanDetailsForm.get('moratoriumPeriod').setValue(this.LoanDetails?.moratoriumPeriod);
    // Borrower Section
    this.addLoanDetailsForm
      .get('primaryBorrowerFirstName')
      .setValue(this.LoanDetails?.borrower?.firstName);
    this.addLoanDetailsForm
      .get('primaryBorrowerLastName')
      .setValue(this.LoanDetails?.borrower?.lastName);
    this.addLoanDetailsForm.get('primaryBorrowerDob').setValue(this.LoanDetails?.borrower?.dob);
    this.addLoanDetailsForm
      .get('primaryBorrowerMobile')
      .setValue(this.LoanDetails?.borrower?.mobileNo);
    this.addLoanDetailsForm
      .get('primaryBorrowerGender')
      .setValue(this.LoanDetails?.borrower?.gender);
    // TO Get BRANCH CODE
    this.loanService.getAllowedBranches().subscribe((data) => {
      this.allowedBranches = data;
      this.addLoanDetailsForm.get('branchCode').setValue(this.LoanDetails?.borrower?.branchCode);

      // if (this.LoanDetails?.borrower?.branchCode == '9999') {
      // }
    });

    // TO Get LOAN TYPE

    this.loanService.getFromMaster('122N116V01', 'LoanType').subscribe(
      (data) => {
        this.loanTypeMaster = data;
        this.addLoanDetailsForm.get('loanType').setValue(this.LoanDetails?.loanType);
      },
      () => {
        this.loaderService.showSpinner(false);
        const message = 'Unable to fetch LoanTypes, Please try after sometime.';
        this.dialog.open(PolicyErrorModalComponent, {
          data: message,
          panelClass: 'dialog-width',
        });
      },
    );

    // Moratorum
    if (this.LoanDetails?.orgCode === 'BOM' && this.LoanDetails.loanType === '4') {
      this.addLoanDetailsForm.get('moratoriumPeriod').setValue('');
      this.loanService.getFromMasterMoratorium('BOM').subscribe((masterValues) => {
        this.moratoriumPeriod = masterValues;
      });
      this.moratoriumSelect = true;
    }

    // To get Title

    this.loanService.getFromMaster('122N116V01', 'Title').subscribe(
      (data) => {
        this.tilteMaster = data;
        this.addLoanDetailsForm
          .get('primaryBorrowerTitle')
          .setValue(this.LoanDetails?.borrower?.titleCode);
      },
      () => {
        this.loaderService.showSpinner(false);
        const message = 'Unable to fetch Titles, Please try after sometime.';
        this.dialog.open(PolicyErrorModalComponent, {
          data: message,
          panelClass: 'dialog-width',
        });
      },
    );

    // To Get Email
    this.addLoanDetailsForm.get('primaryBorrowerEmail').setValue(this.LoanDetails?.borrower?.email);

    if (this.LoanDetails.loanType == 4) {
      this.addLoanDetailsForm.get('moratoriumPeriod').setValue(this.LoanDetails?.orgCode);
    }
  }

  onSubmit() {
    this.accountService.user.subscribe((x) => (this.user = x));

    const reqBody = {
      acctType: 1,
      loanAccountNo: this.LoanDetails?.loanAccountNo,
      loanType: this.addLoanDetailsForm.get('loanType').value,
      orgCode: this.user['organizationCode'],
      branchCode: +this.LoanDetails?.borrower?.branchCode,
      loanStartDate: this.addLoanDetailsForm.get('loanStartDate').value,
      loanEndDate: this.LoanDetails?.loanEndDate,
      loanTerm: this.LoanDetails?.loanTerm,
      outstandingAmount: +this.addLoanDetailsForm.get('totalLoanAmount').value,
      moratoriumPeriod: this.addLoanDetailsForm?.value['moratoriumPeriod'],
      // hasCoBorrower,
      primaryBorrowerShare: 100,
      borrower: {
        title: this.addLoanDetailsForm.value['primaryBorrowerTitle'],
        // bankCustomerId: this.borrowerBankId,
        // customerId: this.borrowerCustomerId,

        // firstName: disFormValue['primaryBorrowerFirstName'],
        // lastName: disFormValue['primaryBorrowerLastName'],
        // dob: moment(new Date(disFormValue['primaryBorrowerDob'])).format('YYYY-MM-DD'),
        // gender: disFormValue['primaryBorrowerGender'],
        mobile: this.LoanDetails?.mobileNo,
        contactList: [
          {
            contactType: 'mobile',
            contactText: this.LoanDetails?.borrower?.mobileNo,
          },
          {
            contactType: 'email',
            contactText: this.LoanDetails?.borrower?.email,
          },
        ],
      },
      coBorrower: {},
      hasCoBorrower: 'N',
    };

    this.loanService.updateLoanDetails(reqBody).subscribe(
      (data) => {
        this.loaderService.showSpinner(false);
        if (data['responseCode'] === 0) {
          this.router.navigate(['group-credit', '2', reqBody.loanAccountNo]);
        } else {
          this.loaderService.showSpinner(false);

          const message = data['responseMessage'];
          this.dialog.open(PolicyErrorModalComponent, {
            data: message,
            panelClass: 'dialog-width',
          });
        }
      },
      (error) => {
        this.loaderService.showSpinner(false);

        const message = 'Unable to submit changes, Please try after sometime.';
        this.dialog.open(PolicyErrorModalComponent, {
          data: message,
          panelClass: 'dialog-width',
        });
      },
    );

    if (reqBody.loanType === '4') {
      reqBody.moratoriumPeriod = this.addLoanDetailsForm.value['moratoriumPeriod'];
    }

    this.loaderService.showSpinner(true);
  }

  onCancel() {
    const dialogRef = this.dialog.open(CancelPromptModelComponent, {});

    dialogRef.afterClosed().subscribe((data) => {
      console.log(data);
    });
  }

  openCustomerDailog() {}

  loanTypeChange() {
    if (
      this.LoanDetails.orgCode === 'BOM' &&
      this.addLoanDetailsForm.get('loanType').value === '4'
    ) {
      this.moratoriumSelect = true;
    } else {
      this.moratoriumSelect = false;
    }
  }

  loanAmountTypeChange(event) {
    console.log('valee', event.source.triggerValue.split('-')[0]);
    const loanAmountType = event.source.triggerValue.split('-')[0];
    if (loanAmountType === 'Outstanding Amount') {
      this.getLoanTerm(
        moment(new Date()).format('YYYY-MM-DD'),
        this.addLoanDetailsForm.get('loanEndDate').value,
      );
    } else {
      this.getLoanTerm(
        this.addLoanDetailsForm.get('loanStartDate').value,
        this.addLoanDetailsForm.get('loanEndDate').value,
      );
    }
  }

  getLoanTerm(loanStartDate, loanEndDate) {
    // console.log(loanStartDate,loanEndDate)
    const yearDiff = moment(loanEndDate).diff(moment(loanStartDate), 'years');
    const monthDiff = moment(loanEndDate).diff(moment(loanStartDate), 'months');
    const dayOfLoanStartDate = loanStartDate.split('-')[2];
    const dayOfLoanEndDate = loanEndDate.split('-')[2];
    if (yearDiff * 12 !== monthDiff) {
      this.LoanDetails.loanTerm = yearDiff + 1;
    } else {
      if (dayOfLoanStartDate < dayOfLoanEndDate) {
        this.LoanDetails.loanTerm = yearDiff + 1;
      } else {
        this.LoanDetails.loanTerm = yearDiff;
      }
    }
    console.log(this.LoanDetails.loanTerm);
  }
}
