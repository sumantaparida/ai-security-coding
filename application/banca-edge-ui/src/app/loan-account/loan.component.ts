import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';
import { LoaderService } from '@app/_services/loader.service';
import { LoanService } from './service/loan.service';
import { AccountService } from '@app/_services';

@Component({
  selector: 'app-loan',
  templateUrl: './loan.component.html',
  styleUrls: ['./loan.component.css'],
})
export class LoanComponent implements OnInit {
  isSubmited = false;
  applicationDetails;
  inputType;
  loanAccountNumber;
  loanTypeMaster;
  orgCode;
  constructor(
    private route: ActivatedRoute,
    private loanService: LoanService,
    private loaderService: LoaderService,
    private dialog: MatDialog,
    private accountService: AccountService,
  ) {}

  ngOnInit(): void {
    this.accountService.user.subscribe((user) => {
      this.orgCode = user.organizationCode;
    });
    this.route.params.subscribe((param) => {
      this.inputType = param['inputType'];
      this.loanAccountNumber = param['loanAccountNumber'];
    });
    this.loanService.getFromMaster('122N116V01', 'LoanType').subscribe((data) => {
      this.loanTypeMaster = data;
    });
    if (this.inputType && this.loanAccountNumber) {
      const reqBody = {
        inputType: this.inputType,
        loanAccountNo: this.loanAccountNumber,
      };
      this.getLoanDetails(reqBody, 'submitLoanDetails');
    }
  }

  getLoanDetails(reqBody, type) {
    this.loaderService.showSpinner(true);
    this.loanService[type](reqBody).subscribe(
      (data) => {
        this.loaderService.showSpinner(false);
        if (data['responseCode'] === 0) {
          this.isSubmited = true;
          this.applicationDetails = data;
        } else if (data['responseCode'] === 500) {
          const message = 'Error Getting data from Bank';
          const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
            data: message,
            panelClass: 'dialog-width',
          });
          dialogRef.afterClosed().subscribe(() => {
            // navigate
          });
        } else {
          const message = data['responseMessage'];
          const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
            data: message,
            panelClass: 'dialog-width',
          });
          dialogRef.afterClosed().subscribe(() => {
            // navigate
          });
        }
      },
      (error) => {
        this.loaderService.showSpinner(false);
        const message = 'Unable to fetch data, Please try after Sometime.';
        const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
          data: message,
          panelClass: 'dialog-width',
        });
        dialogRef.afterClosed().subscribe((data) => {
          // navigate
        });
      },
    );
  }

  onSubmitClicked(event) {
    this.inputType = event.inputType;
    this.loanAccountNumber = event.loanAccountNo;
    const reqBody = {
      inputType: event.inputType,
      loanAccountNo: event.loanAccountNo,
    };
    this.orgCode === 'BOM'
      ? this.getLoanDetails(reqBody, 'submitLoanDetails')
      : this.getLoanDetails(reqBody, 'submitLoanDetails');
  }
}
