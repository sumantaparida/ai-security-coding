import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LmsService } from '@app/LMS/services/lms.service';
import { AccountService } from '@app/_services/account.service';
import { LoaderService } from '@app/_services/loader.service';

@Component({
  selector: 'app-direct-debit-modal',
  templateUrl: './direct-debit-modal.component.html',
  styleUrls: ['./direct-debit-modal.component.css'],
})
export class DirectDebitModalComponent implements OnInit {
  dbForm;

  today = new Date();

  showResponse = false;

  response;

  responseMessage;

  user;

  isSibUser;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<DirectDebitModalComponent>,
    private lmsService: LmsService,
    private loaderService: LoaderService,
    private accountService: AccountService,

  ) { }

  ngOnInit(): void {
    this.accountService.user.subscribe((x) => (this.user = x));
    if (this.user.organizationCode === 'SIB') {
      this.isSibUser = true
    }

    const moment = require('moment');
    let today = new Date();
    let todayDate = moment(today).format('YYYY-MM-DD');

    console.log('today', today);
    console.log('data', this.data);
    let customerName =
      this.data?.applicationData?.proposer?.firstName +
      ' ' +
      this.data?.applicationData.proposer?.lastName;
    this.dbForm = new FormGroup({
      accountNumber: new FormControl('', Validators.required),
      dbFormNumber: new FormControl('', Validators.required),
      ifscCode: new FormControl('', Validators.required),
      premium: new FormControl(this.data.leadBatch?.premiumamtWithTax, Validators.required),
      insurerName: new FormControl(this.data.insurerName, Validators.required),
      customerName: new FormControl(customerName, Validators.required),
      paymentDate: new FormControl({ value: todayDate, disabled: true }, Validators.required),
    });
    this.setTodayDate();
  }

  submitDd() {
    this.loaderService.showSpinner(true);
    let payload = {
      paymentType: 'DBT',
      cifNo: this.data?.bankCustomerId,
      accountNo: this.dbForm.get('accountNumber').value,
      instrumentDate: this.dbForm.get('paymentDate').value,
      instrumentNo: this.dbForm.get('dbFormNumber').value,
      ifscCode: this.dbForm.get('ifscCode').value,
      insurerId: this.data?.insurerCode,
      premiumPayable: this.dbForm.get('premium').value,
      appNo: this.data?.leadNumber,
      cisApp: true,
    };
    this.lmsService.initiateCisDebit(payload).subscribe((res) => {
      console.log('response =', res);
      this.loaderService.showSpinner(false);

      this.showResponse = true;
      this.response = res;
      if (res['responseCode'] == 0) {
        this.responseMessage = 'Payment Initiated Successfully.';
      } else {
        this.responseMessage = res['responseMessage'];
      }
    });
  }

  dateInputEvent(event) {
    console.log('date =', event.value);
    const moment = require('moment');
    const newDate = new Date(event.value);
    this.dbForm.get('paymentDate').setValue(moment(newDate).format('YYYY-MM-DD'));
  }

  setTodayDate() {

    const moment = require('moment');
    const newDate = new Date();
    this.dbForm.get('paymentDate').setValue(moment(newDate).format('YYYY-MM-DD'));
  }
}
