import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  CreateAppicationData,
  PolicyQuoteList,
} from '../display-result-child-plan-quote/display-result-child-plan-quote.component';
@Component({
  selector: 'app-more-detail-child-plan',
  templateUrl: './more-detail-child-plan.component.html',
  styleUrls: ['./more-detail-child-plan.component.css'],
})
export class MoreDetailChildPlanComponent implements OnInit {
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
    public dialogRef: MatDialogRef<MoreDetailChildPlanComponent>,
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
  }

  brochureLink(url) {
    window.open(url, '_blank');
  }
}
