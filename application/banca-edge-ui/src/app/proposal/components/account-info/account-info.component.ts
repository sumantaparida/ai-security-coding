import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.css'],
})
export class AccountInfoComponent implements OnInit, OnChanges {
  @Input() paymentForm: FormGroup;

  @Input() accountDetails;

  @Input() currentScreen;

  threeMonthsBack: Date;

  todaysDate: Date;

  paymentTypes = [
    { id: 'DBT', value: 'Direct Debit' },
    { id: 'CHQ', value: 'Cheque' },
    { id: 'DD', value: 'Demand Draft' },
  ];

  ngOnInit() {
    this.todaysDate = new Date();
    const today = moment().subtract(3, 'months');
    this.threeMonthsBack = new Date(today.toDate());
  }

  ngOnChanges(changes) {
    if (changes.hasOwnProperty('currentScreen') && changes.currentScreen) {
      this.paymentTypes = this.paymentTypes.filter(
        (paymentType) => this.currentScreen.paymentTypesAllowed.indexOf(paymentType.id) > -1,
      );
    }
  }

  onPaymentMethodChange(event) {
    if (event.value === 'DBT') {
      this.paymentForm.addControl(
        'accountNumber',
        new FormControl(this.accountDetails[0].accountNo, Validators.required),
      );
      this.paymentForm.removeControl('chequeOrDDNo');
      this.paymentForm.removeControl('chkOrDDDate');
      this.paymentForm.removeControl('ifscCode');
      this.paymentForm.removeControl('micrCode');
    } else {
      this.paymentForm.removeControl('accountNumber');
      this.paymentForm.addControl(
        'chequeOrDDNo',
        new FormControl('', [Validators.required, Validators.pattern(/[0-9]{6}/)]),
      );
      this.paymentForm.addControl('chkOrDDDate', new FormControl('', [Validators.required]));
      this.paymentForm.addControl(
        'ifscCode',
        new FormControl('', [Validators.required, Validators.pattern(/^[A-Z]{4}0[0-9]{6}$/)]),
      );
      this.paymentForm.addControl(
        'micrCode',
        new FormControl('', [Validators.required, Validators.pattern(/[0-9]{9}/)]),
      );
      this.paymentForm.get('chequeOrDDNo').enable();
      this.paymentForm.get('chkOrDDDate').enable();
    }
  }

  capitalize(controlName, event) {
    this.paymentForm.get(controlName).setValue(event.target.value.toUpperCase());
  }
}
