import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  CreateAppicationData,
  PolicyQuoteList,
} from '../display-result-life-quote/display-result-life-quote.component';
@Component({
  selector: 'app-more-detail-life',
  templateUrl: './more-detail-life.component.html',
  styleUrls: ['./more-detail-life.component.css'],
})
export class MoreDetailLifeComponent implements OnInit {
  isShowPremiumBreakup = false;

  isShowDescription = [];

  isShowCustomDesc = [];

  addBtn = 'Add';

  addBtnMobile = 'add_circle_outline';

  removeBtn = 'Remove';

  removeBtnMobile = 'remove_circle_outline';

  addSentence = 'Add for Rs.';

  removeSentence = 'Added for Rs.';

  showSentence;

  showBtn;

  showBtnMobile;

  policyQuoteArr;

  includedBenefit;

  addOnBenifit;

  premiumsObj;

  totalPremiumDisplayed;

  basePremiumDisplayed;

  gstDisplayed;

  netPremiumCustomPolicy;

  premiumCustomPolicy;

  gstCustomPolicy;

  showCustomisePolicy;

  quoteInput;

  isBuyNow;

  premiumKey;

  constructor(
    public dialogRef: MatDialogRef<MoreDetailLifeComponent>,
    @Inject(MAT_DIALOG_DATA) public toSend: CreateAppicationData,
    @Inject(MAT_DIALOG_DATA) public data: PolicyQuoteList,
  ) {}

  ngOnInit(): void {
    this.policyQuoteArr = this.data.policyList;
    this.quoteInput = this.data.quoteInput;
    this.includedBenefit = this.policyQuoteArr.standardBenefits;
    this.addOnBenifit = this.policyQuoteArr.addonBenefits;
    this.premiumsObj = this.policyQuoteArr.premiums;
    this.showSentence = this.addSentence;
    this.showBtn = this.addBtn;
    this.showBtnMobile = this.addBtnMobile;

    this.premiumKey = Object.keys(this.policyQuoteArr.premiums)[0];
    this.totalPremiumDisplayed = +this.premiumsObj[this.premiumKey].totalPremium;
    this.gstDisplayed = this.policyQuoteArr.premiums[this.premiumKey].gst;
    this.basePremiumDisplayed = this.policyQuoteArr.premiums[this.premiumKey]?.basePremium;
  }

  toggleShow(index) {
    this.isShowDescription[index] = !this.isShowDescription[index];
  }

  hideShowPremiumBreakup() {
    this.isShowPremiumBreakup = !this.isShowPremiumBreakup;
  }

  exitMoreDetails() {
    this.toSend.basePremium = this.basePremiumDisplayed;
    this.toSend.gst = this.gstDisplayed;
    this.toSend.totalPremium = this.totalPremiumDisplayed;
    this.toSend.isBuyNow = false;
    this.dialogRef.close(this.data);
  }

  onBuyNow() {
    this.toSend.isBuyNow = true;
    this.dialogRef.close(this.data);

    // const createApplicationData = {
    //   lob: 'Life',
    //   productType: 'ENDW',
    //   productId: this.policyQuoteArr.productId,
    //   planId: this.policyQuoteArr.planId,
    //   productName: this.policyQuoteArr.productName,
    //   insurerId: this.policyQuoteArr.insurerId,
    //   insurerName: this.policyQuoteArr.insurerName,
    //   pt: this.policyQuoteArr.pt,
    //   ppt: this.policyQuoteArr.ppt,
    //   selectedMode: this.policyQuoteArr.mode,
    //   sa: this.policyQuoteArr.sa,
    //   mode: this.policyQuoteArr.mode,
    //   customerId: this.quoteInput.customerId ? this.quoteInput.customerId : 0,
    //   pb: {
    //     basePremium: this.basePremiumDisplayed,
    //     gst: this.gstDisplayed,
    //     totalPremium: this.totalPremiumDisplayed,
    //     base: [
    //       {
    //         coverId: 'MORT',
    //         displayName: 'Life Cover',
    //         sa: 0,
    //         netPremium: this.basePremiumDisplayed,
    //         premium: this.totalPremiumDisplayed,
    //         selected: false
    //       }
    //     ],
    //     addon: []
    //   },
    //   quoteInput: this.quoteInput
    // };
    // const addOnArr = this.addOnBenifit.filter(arr => {
    //   if (arr.selected === true) {
    //     return arr;
    //   }
    // });
    // if (addOnArr != null) {
    //   createApplicationData['addons'] = addOnArr;
    // }
    // if (this.policyQuoteArr.premiums[1]) {
    //   createApplicationData['selectedMode'] = 1;
    //   createApplicationData['mode'] = 1;
    // }
    // else if (this.policyQuoteArr.premiums[0]) {
    //   createApplicationData['selectedMode'] = 0;
    //   createApplicationData['mode'] = 0;
    // }
    // else if (this.policyQuoteArr.premiums[2]) {
    //   createApplicationData['selectedMode'] = 2;
    //   createApplicationData['mode'] = 2;
    // }
    // else if (this.policyQuoteArr.premiums[4]) {
    //   createApplicationData['selectedMode'] = 4;
    //   createApplicationData['mode'] = 4;
    // }
    // else {
    //   createApplicationData['selectedMode'] = 12;
    //   createApplicationData['mode'] = 12;
    // }
    // this.quoteService.createLifeApplication(this.policyQuoteArr.productId, createApplicationData).subscribe(result => {
    //   const applicationArr = result;
    //   if (applicationArr['online'] === false) {
    //     this.applicationNo = applicationArr['applicationNo'];
    //     this.router.navigate(['/quote/offline-life-purchase', this.applicationNo]);
    //   }
    //   else {
    //     this.applicationNo = applicationArr['applicationNo'];
    //     this.router.navigate(['/proposal/lifefg', this.applicationNo]);
    //   }
    // }, error => {
    //   console.log('error msg', error.message);
    // });
    // this.dialogRef.close(this.data);
  }

  brochureLink(url) {
    window.open(url, '_blank');
  }
}
