import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-payment-option-modal',
  templateUrl: './payment-option-modal.component.html',
  styleUrls: ['./payment-option-modal.component.css'],
})
export class PaymentOptionModalComponent implements OnInit {
  atBankArray = [
    '122N116V01',
    '148HL05CI1',
    '148HL04I01',
    '153HL02PA1',
    '153HL01I01',
    '158GL01V01',
    '117N080V02',
    '130N092V01'
  ];

  onlineArray = ['158FI01H01'];

  restrictOnline = false;

  restrictBank = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<PaymentOptionModalComponent>,
  ) { }

  ngOnInit() {
    console.log('got the data', this.data);
    if (this.atBankArray.findIndex((productId) => productId === this.data.productId) > -1) {
      this.restrictOnline = true;
    } else if (this.onlineArray.findIndex((productId) => productId === this.data.productId) > -1) {
      this.restrictBank = true;
    }
  }

  onClick(type) {
    this.dialogRef.close(type);
  }
}
