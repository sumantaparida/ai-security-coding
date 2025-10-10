import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoanService } from '@app/loan-account/service/loan.service';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';
import { User } from '@app/_models';
import { AccountService } from '@app/_services';
import { LoaderService } from '@app/_services/loader.service';
import * as moment from 'moment';
// import { Subscription } from 'rxjs';
import { CancelPromptModelComponent } from '../cancel-prompt-model/cancel-prompt-model.component';
import { CustomerSearchModelComponent } from '../customer-search-model/customer-search-model.component';

@Component({
  selector: 'app-add-loan-details',
  templateUrl: './add-loan-details.component.html',
  styleUrls: ['./add-loan-details.component.css'],
})
export class AddLoanDetailsComponent implements OnInit {
  user: User;

  tilteMaster;

  loanTypeMaster;

  allowedBranches;

  inputType;

  loanAccountNumber;

  minAgeRequired;

  seventyYears;

  loanEndMinDate;

  loanEndMaxDate;

  borrowerBankId;

  borrowerCustomerId;

  coBorrowerBankId;

  coBorrowerCustomerId;

  customerCif;

  moratoriumPeriod;

  // minDate;

  minDate = new Date(moment().subtract(4, 'months').toDate());
  // The Above is commented out for testing purposes only. This should not be moved to the production.

  addLoanDetailsForm = this.fb.group({
    loanType: ['', [Validators.required]],
    branchCode: ['', [Validators.required, Validators.pattern('^[0-9]{1,4}$')]],
    loanAccouontNo: ['', [Validators.required, Validators.pattern('^[0-9]{11,15}$')]],
    loanStartDate: ['', [Validators.required]],
    loanEndDate: ['', [Validators.required]],
    totalLoanAmount: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    // hasCoBorrower: ['', [Validators.required]],
    primaryBorrowerTitle: [, [Validators.required]],
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
    primaryBorrowerMobile: ['', [Validators.required, Validators.pattern('^[6789][0-9]{9}$')]],
    primaryBorrowerEmail: ['', [Validators.email]],
  });

  constructor(
    private fb: FormBuilder,
    private loanService: LoanService,
    private accountService: AccountService,
    private loaderService: LoaderService,
    private router: Router,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    // console.log(this.addLoanDetailsForm);
    this.addLoanDetailsForm.get('loanType').valueChanges.subscribe((loanTypes) => {
      this.addLoanDetailsForm.get('loanStartDate').reset();
      this.addLoanDetailsForm.get('loanEndDate').reset();

      if (loanTypes !== '7') {
      }

      if (loanTypes !== '4') {
        console.log('INSIDE IF for Other Types');
        const today = new Date();
        this.minAgeRequired = new Date(moment(today).subtract(18, 'years').toDate());
        this.seventyYears = new Date(moment(today).subtract(70, 'years').toDate());
      } else {
        console.log('INSIDE IF for Education');
        const today = new Date();
        this.minAgeRequired = new Date(moment(today).subtract(15, 'years').toDate());
        this.seventyYears = new Date(moment(today).subtract(70, 'years').toDate());
      }
      // let hasCoBorrowerSubscription: Subscription;
      // if (loanTypes === '5' || loanTypes === '2') {
      //   this.addLoanDetailsForm.addControl(
      //     'hasCoBorrower',
      //     new FormControl('', Validators.required),
      //   );
      //   hasCoBorrowerSubscription = this.addLoanDetailsForm
      //     .get('hasCoBorrower')
      //     .valueChanges.subscribe((value) => {
      //       if (value === 'Y') {
      //         this.addLoanDetailsForm.addControl(
      //           'coBorrowerTitle',
      //           new FormControl('', Validators.required),
      //         );
      //         this.addLoanDetailsForm.addControl(
      //           'coBorrowerFirstName',
      //           new FormControl({ value: '', disabled: true }, [
      //             Validators.required,
      //             Validators.minLength(2),
      //             Validators.maxLength(50),
      //             Validators.pattern('^[a-zA-z ]+$'),
      //           ]),
      //         );
      //         this.addLoanDetailsForm.addControl(
      //           'coBorrowerLastName',
      //           new FormControl({ value: '', disabled: true }, Validators.required),
      //         );
      //         this.addLoanDetailsForm.addControl(
      //           'coBorrowerDob',
      //           new FormControl({ value: '', disabled: true }, Validators.required),
      //         );
      //         this.addLoanDetailsForm.addControl(
      //           'coBorrowerGender',
      //           new FormControl({ value: '', disabled: true }, Validators.required),
      //         );
      //         this.addLoanDetailsForm.addControl(
      //           'coBorrowerMobile',
      //           new FormControl('', [Validators.required, Validators.pattern('^[6789][0-9]{9}$')]),
      //         );
      //         this.addLoanDetailsForm.addControl(
      //           'coBorrowerEmail',
      //           new FormControl('', Validators.email),
      //         );
      //         this.addLoanDetailsForm.addControl(
      //           'primaryBorrowerShare',
      //           new FormControl('', [Validators.required, Validators.min(50), Validators.max(100)]),
      //         );
      //       } else {
      //         this.addLoanDetailsForm.removeControl('coBorrowerTitle');
      //         this.addLoanDetailsForm.removeControl('coBorrowerFirstName');
      //         this.addLoanDetailsForm.removeControl('coBorrowerLastName');
      //         this.addLoanDetailsForm.removeControl('coBorrowerDob');
      //         this.addLoanDetailsForm.removeControl('coBorrowerGender');
      //         this.addLoanDetailsForm.removeControl('coBorrowerMobile');
      //         this.addLoanDetailsForm.removeControl('coBorrowerEmail');
      //         this.addLoanDetailsForm.removeControl('primaryBorrowerShare');
      //       }
      //     });
      // } else {
      //   if (hasCoBorrowerSubscription) {
      //     hasCoBorrowerSubscription.unsubscribe();
      //   }
      //   this.addLoanDetailsForm.removeControl('hasCoBorrower');
      // }
    });

    this.accountService.user.subscribe((x) => (this.user = x));

    this.loanService.getFromMaster('122N116V01', 'Title').subscribe(
      (data) => {
        this.tilteMaster = data;
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

    this.loanService.getFromMaster('122N116V01', 'LoanType').subscribe(
      (data) => {
        this.loanTypeMaster = data;
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

    this.loanService.getAllowedBranches().subscribe((data) => {
      this.allowedBranches = data;
    });

    // Moratorum

    this.loanService.getFromMasterMoratorium('BOM').subscribe((masterValues) => {
      this.moratoriumPeriod = masterValues;
    });

    this.addLoanDetailsForm.get('loanType').valueChanges.subscribe((data) => {
      if (data === '4') {
        this.addLoanDetailsForm.addControl(
          'moratoriumPeriod',
          new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
        );
      } else {
        this.addLoanDetailsForm.removeControl('moratoriumPeriod');
      }
    });

    this.addLoanDetailsForm.get('loanStartDate').valueChanges.subscribe((date) => {
      const loanType = this.addLoanDetailsForm.get('loanType').value;
      if (loanType === '7') {
        this.loanEndMinDate = new Date(moment(date).add(11, 'years').subtract(1, 'day').toDate());
      } else {
        this.loanEndMinDate = new Date(moment(date).add(2, 'years').subtract(1, 'day').toDate());
      }
      if (loanType === '1') {
        this.loanEndMaxDate = new Date(moment(date).add(7, 'years').subtract(1, 'day').toDate());
      } else if (loanType === '2' || loanType === '7' || loanType === '8') {
        this.loanEndMaxDate = new Date(moment(date).add(30, 'years').subtract(1, 'day').toDate());
      } else if (loanType === '3') {
        this.loanEndMaxDate = new Date(moment(date).add(15, 'years').subtract(1, 'day').toDate());
      } else if (loanType === '4') {
        this.loanEndMaxDate = new Date(moment(date).add(20, 'years').subtract(1, 'day').toDate());
      } else if (loanType === '5') {
        this.loanEndMaxDate = new Date(moment(date).add(7, 'years').subtract(1, 'day').toDate());
      }
    });
    console.log(this.addLoanDetailsForm);
  }

  onSubmit() {
    const disFormValue = this.addLoanDetailsForm.getRawValue();
    // let hasCoBorrower = '';
    const hasCoBorrower = this.addLoanDetailsForm.value['hasCoBorrower'] === 'Y' ? 'Y' : 'N';
    const reqBody = {
      acctType: 1,
      cifNumber: 10016958790,
      loanAccountNo: this.addLoanDetailsForm.value['loanAccouontNo'],
      loanType: this.addLoanDetailsForm.value['loanType'],
      orgCode: this.user['organizationCode'],
      branchCode: +this.addLoanDetailsForm.value['branchCode'],
      loanStartDate: moment(new Date(this.addLoanDetailsForm.value['loanStartDate'])).format(
        'YYYY-MM-DD',
      ),
      loanEndDate: moment(new Date(this.addLoanDetailsForm.value['loanEndDate'])).format(
        'YYYY-MM-DD',
      ),
      loanTerm: this.addLoanDetailsForm.value['loanTerm'],
      outstandingAmount: this.addLoanDetailsForm.value['totalLoanAmount'],
      moratoriumPeriod: 0,
      hasCoBorrower,
      primaryBorrowerShare: 100,
      borrower: {
        title: this.addLoanDetailsForm.value['primaryBorrowerTitle'],
        bankCustomerId: this.borrowerBankId,
        customerId: this.borrowerCustomerId,

        firstName: disFormValue['primaryBorrowerFirstName'],
        lastName: disFormValue['primaryBorrowerLastName'],
        dob: moment(new Date(disFormValue['primaryBorrowerDob'])).format('YYYY-MM-DD'),
        gender: disFormValue['primaryBorrowerGender'],
        mobile: this.addLoanDetailsForm.value['primaryBorrowerMobile'],
        contactList: [
          {
            contactType: 'mobile',
            contactText: this.addLoanDetailsForm.value['primaryBorrowerMobile'],
          },
          {
            contactType: 'email',
            contactText: this.addLoanDetailsForm.value['primaryBorrowerEmail'],
          },
        ],
      },
      coBorrower: {},
    };

    // if (reqBody.hasCoBorrower === 'Y') {
    //   reqBody.primaryBorrowerShare = this.addLoanDetailsForm.value['primaryBorrowerShare'];
    //   reqBody.coBorrower = {
    //     title: this.addLoanDetailsForm.value['coBorrowerTitle'],
    //     firstName: disFormValue['coBorrowerFirstName'],
    //     lastName: disFormValue['coBorrowerLastName'],
    //     dob: moment(new Date(disFormValue['coBorrowerDob'])).format('YYYY-MM-DD'),
    //     gender: disFormValue['coBorrowerGender'],
    //     bankCustomerId: this.coBorrowerBankId,
    //     customerId: this.coBorrowerCustomerId,
    //     mobile: this.addLoanDetailsForm.value['coBorrowerMobile'],

    //     contactList: [
    //       {
    //         contactType: 'mobile',
    //         contactText: this.addLoanDetailsForm.value['coBorrowerMobile'],
    //       },
    //       {
    //         contactType: 'email',
    //         contactText: this.addLoanDetailsForm.value['coBorrowerEmail'],
    //       },
    //     ],
    //   };
    // }

    if (reqBody.loanType === '4') {
      reqBody.moratoriumPeriod = this.addLoanDetailsForm.value['moratoriumPeriod'];
    }

    this.loaderService.showSpinner(true);

    this.loanService.addLoanDetails(reqBody).subscribe(
      (data) => {
        this.loaderService.showSpinner(false);
        if (data['responseCode'] === 0) {
          this.router.navigate(['group-credit', '2', reqBody.loanAccountNo]);
        } else {
          const message = data['responseMessage'];
          this.dialog.open(PolicyErrorModalComponent, {
            data: message,
            panelClass: 'dialog-width',
          });
        }
      },
      () => {
        this.loaderService.showSpinner(false);
        const message = 'Unable to Add Loan, Please try after sometime';
        this.dialog.open(PolicyErrorModalComponent, {
          data: message,
          panelClass: 'dialog-width',
        });
      },
    );
  }

  openCustomerDailog(type) {
    const dialogRef = this.dialog.open(CustomerSearchModelComponent, {
      panelClass: 'customer-modal',
    });

    dialogRef.afterClosed().subscribe((data) => {
      this.customerCif = data.bankCustomerId;
      if (data !== '') {
        let email = {};
        if (data.contactList) {
          email = data.contactList.find((contact) => {
            if (contact['contactType'].toLowerCase() === 'email') {
              return contact;
            }
          });
        }

        if (type === 'borrower') {
          this.addLoanDetailsForm.get('primaryBorrowerFirstName').setValue(data.firstName);
          this.addLoanDetailsForm.get('primaryBorrowerLastName').setValue(data.lastName);
          this.addLoanDetailsForm.get('primaryBorrowerGender').setValue(data.gender);
          this.addLoanDetailsForm.get('primaryBorrowerDob').setValue(data.dob);
          this.addLoanDetailsForm.get('primaryBorrowerMobile').setValue(data.mobileNo);
          if (email) {
            this.addLoanDetailsForm.get('primaryBorrowerEmail').setValue(email['contactText']);
          }
          this.borrowerBankId = data.bankCustomerId;
          this.borrowerCustomerId = data.customerId;
        }
        // if (type === 'co-borrower') {
        //   this.addLoanDetailsForm.get('coBorrowerFirstName').setValue(data.firstName);
        //   this.addLoanDetailsForm.get('coBorrowerLastName').setValue(data.lastName);
        //   this.addLoanDetailsForm.get('coBorrowerGender').setValue(data.gender);
        //   this.addLoanDetailsForm.get('coBorrowerDob').setValue(data.dob);
        //   this.addLoanDetailsForm.get('coBorrowerMobile').setValue(data.mobileNo);
        //   this.addLoanDetailsForm.get('coBorrowerEmail').setValue(email['contactText']);
        //   this.coBorrowerBankId = data.bankCustomerId;
        //   this.coBorrowerCustomerId = data.customerId;
        // }
      }
    });
  }

  onCancel() {
    const dialogRef = this.dialog.open(CancelPromptModelComponent, {});

    dialogRef.afterClosed().subscribe((data) => {
      console.log(data);
    });
  }
}
