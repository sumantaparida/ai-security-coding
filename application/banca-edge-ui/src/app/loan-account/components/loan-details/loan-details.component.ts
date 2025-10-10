import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoanService } from '@app/loan-account/service/loan.service';
import { RecommendService } from '@app/loan-account/service/recommend-service';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';
import { LoaderService } from '@app/_services/loader.service';
import { User } from '@app/_models';
import { AccountService } from '@app/_services/account.service';

@Component({
  selector: 'app-loan-details',
  templateUrl: './loan-details.component.html',
  styleUrls: ['./loan-details.component.css'],
})
export class LoanDetailsComponent implements OnInit, OnChanges {
  user: User;

  isInsurer;

  quoteId;

  leadValues;

  LoanDetails;

  recommendationData;

  currentLoanType;

  orgCode;

  @Input() applicationDetails;

  @Input() inputType;

  @Input() loanTypeMaster;

  constructor(
    private loaderService: LoaderService,
    private recommendService: RecommendService,
    private router: Router,
    private dialog: MatDialog,
    private loanService: LoanService,
    private accountService: AccountService,
  ) {}

  ngOnInit(): any {
    this.accountService.user.subscribe((x) => (this.user = x));

    this.isInsurer = this.user.isInsurerUser;
    this.accountService.user.subscribe((user) => {
      if (user) {
        this.orgCode = user.organizationCode;
      }
    });
  }

  ngOnChanges(changes) {
    if (changes.loanTypeMaster && this.loanTypeMaster) {
      const results = this.loanTypeMaster.find(
        (element) => element.id === this.applicationDetails.loanType.toString(),
      );
      this.currentLoanType = results;
    }
  }

  onRecommendClick() {
    console.log(this.orgCode, this.currentLoanType);
    if (
      this.orgCode === 'KB' &&
      (this.currentLoanType === '' ||
        this.currentLoanType === undefined ||
        this.currentLoanType === null)
    ) {
      let message =
        'Please use the edit button to select the loan type correctly to continue the journey. Premium will be calculated based on the loan type and later modifications are not allowed.';
      this.openErrorModal(message);
    } else {
      this.loaderService.showSpinner(true);
      const reqbody = {
        inputType: this.inputType,
        loanAccountNo: this.applicationDetails.loanAccountNo,
      };
      this.recommendService.recommendInsuranceDetails(reqbody).subscribe(
        (data) => {
          this.loaderService.showSpinner(false);
          if (data['responseCode'] === 0 && data['numQuotesExpected'] > 0) {
            this.quoteId = data['quoteId'];
            this.router.navigate(['group-credit', 'loan-quote', this.quoteId]);
          } else {
            const message = data['responseMessage'];
            this.openErrorModal(message);
          }
        },
        () => {
          this.loaderService.showSpinner(false);
          const message = 'Unable to fetch the data';
          this.openErrorModal(message);
        },
      );
    }
  }

  onCreateLead() {
    const reqBody = {
      inputType: 2,
      loanAccountNo: this.applicationDetails.loanAccountNo,
      orgCode: 'BOM',
    };
    this.loanService.createLead(reqBody).subscribe(
      (response) => {
        if (response['responseCode'] === 0) {
          this.router.navigate(['lead-management', 'viewleads']);
          const message = 'Lead has been created Successfully';
          this.dialog.open(PolicyErrorModalComponent, {
            data: message,
            panelClass: 'dialog-width',
          });
        } else if (response['responseCode'] !== 0) {
          this.openErrorModal(response['responseMessage']);
        }
      },
      () => {
        this.loaderService.showSpinner(false);
        const message = 'Unable to fetch the data.';
        this.openErrorModal(message);
      },

      // this.router.navigate(['/group-credit/leads'], { state: this.leadValues });
    );
  }

  // openErrorModal(arg0: any) {
  //   throw new Error('Method not implemented.');
  // }

  // this.leadManagement.createLead(reqBody).subscribe(
  //   (response) => {
  //     if (response['responseCode'] === 0) {
  // this.router.navigate(['lead-management', 'viewleads']);
  //       const message = 'Lead has been created Successfully';
  //       this.dialog.open(PolicyErrorModalComponent, {
  //         data: message,
  //         panelClass: 'dialog-width',
  //       });
  //     } else if (response['responseCode'] !== 0) {
  //       this.openErrorModal(response['responseMessage']);
  //     }
  //   },
  //   () => {
  //     this.loaderService.showSpinner(false);
  //     const message = 'Unable to fetch the data.';
  //     this.openErrorModal(message);
  //   },
  // );

  onEdit() {
    // const reqBody = {
    //   inputType: 2,
    //   loanAccountNo: this.applicationDetails.loanAccountNo,
    // };
      this.LoanDetails = this.applicationDetails;
      this.router.navigate(['/group-credit/edit-loan'], { state: this.LoanDetails });
   
    // API TESTING PURPOSE
    // const reqBody = {
    //   inputType: 2,
    //   cifNumber: '20000118638',
    //   // loanAccountNo: 55552223655654,
    //   orgCode: 'BOM',
    // };
    // this.loanService.getCustomerfromBank(reqBody).subscribe((customerInfo) => {
    //   console.log('Customer Info', customerInfo);
    // });
  }

  openErrorModal(message) {
    this.dialog.open(PolicyErrorModalComponent, {
      data: message,
      panelClass: 'dialog-width',
    });
  }
}
