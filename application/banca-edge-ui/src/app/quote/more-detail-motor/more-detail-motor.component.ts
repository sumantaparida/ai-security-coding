import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  CreateAppicationData,
  PolicyQuoteList,
} from '../display-result-motor-quote/display-result-motor-quote.component';
import { QuoteService } from '../quote.service';
@Component({
  selector: 'app-more-detail-motor',
  templateUrl: './more-detail-motor.component.html',
  styleUrls: ['./more-detail-motor.component.css'],
})
export class MoreDetailMotorComponent implements OnInit {
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

  applicationNo;

  tpbase;

  tpaddon;

  addonpremium;

  addonnetpremium;

  addonInformation = false;

  payPremium;

  isBuyNow;

  constructor(
    public dialogRef: MatDialogRef<MoreDetailMotorComponent>,
    @Inject(MAT_DIALOG_DATA) public toSend: CreateAppicationData,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: PolicyQuoteList,
    private quoteService: QuoteService,
  ) {}

  ngOnInit(): void {
    this.policyQuoteArr = this.data.policyList;
    this.quoteInput = this.data.quoteInput;
    this.includedBenefit = this.policyQuoteArr.standardBenefits;
    this.addOnBenifit = this.policyQuoteArr.addonBenefits;
    this.premiumsObj = this.policyQuoteArr.premiums;
    this.payPremium = this.policyQuoteArr.pt;
    this.tpbase = this.policyQuoteArr.premiums[0]?.base;
    this.tpaddon = this.policyQuoteArr.premiums[0]?.addon;
    this.addOnBenifit.map((element) => {
      if (element.selected === false) {
        this.showBtn = this.addBtn;
        this.showSentence = this.addSentence;
        this.showBtnMobile = this.addBtnMobile;
      } else {
        this.showBtn = this.removeBtn;
        this.showSentence = this.removeSentence;
        this.showBtnMobile = this.removeBtnMobile;
      }
    });

    this.totalPremiumDisplayed = this.premiumsObj[0].totalPremium;
    this.gstDisplayed = this.policyQuoteArr.premiums[0].gst;
    this.basePremiumDisplayed = this.policyQuoteArr.premiums[0]?.basePremium;

    this.addOnBenifit.map((arr) => {
      if (!arr.coverId) {
        this.showCustomisePolicy = false;
      } else {
        this.showCustomisePolicy = true;
      }
    });
    this.netPremiumCustomPolicy = this.addOnBenifit.map((arr) => {
      return arr.premium[0].netPremium;
    });
    this.premiumCustomPolicy = this.addOnBenifit.map((arr) => {
      return arr.premium[0]?.premium;
    });
  }

  toggleShow(index) {
    this.isShowDescription[index] = !this.isShowDescription[index];
  }

  toggleShowCustomise(index) {
    this.isShowCustomDesc[index] = !this.isShowCustomDesc[index];
  }

  hideShowPremiumBreakup() {
    this.isShowPremiumBreakup = !this.isShowPremiumBreakup;
  }

  addOrRemoveCustomisePolicy(index) {
    if (this.addOnBenifit[index].selected === false) {
      this.addonInformation = true;
      this.addOnBenifit[index].selected = true;
      this.includedBenefit.unshift(this.addOnBenifit[index]);
      this.addOnBenifit[index].selected = true;
      this.totalPremiumDisplayed =
        this.totalPremiumDisplayed + this.addOnBenifit[index].premium[0]?.netPremium;
      this.gstCustomPolicy =
        this.addOnBenifit[index].premium[0]?.premium -
        this.addOnBenifit[index].premium[0]?.netPremium;
      this.gstDisplayed = this.gstDisplayed + this.gstCustomPolicy;
      this.basePremiumDisplayed = this.totalPremiumDisplayed - this.gstDisplayed;
    } else if (this.addOnBenifit[index].selected === true) {
      this.addOnBenifit[index].selected = false;
      this.totalPremiumDisplayed =
        this.totalPremiumDisplayed - this.addOnBenifit[index].premium[0]?.netPremium;
      const toRemoveIndex = this.includedBenefit.findIndex(
        (arr) => arr.coverId === this.addOnBenifit[index].coverId,
      );
      this.addOnBenifit[index].slected = false;
      this.addOnBenifit[index].selected = false;
      this.includedBenefit.splice(toRemoveIndex, 1);
      this.gstCustomPolicy =
        this.addOnBenifit[index].premium[0]?.premium -
        this.addOnBenifit[index].premium[0]?.netPremium;
      this.gstDisplayed = this.gstDisplayed - this.gstCustomPolicy;
      this.basePremiumDisplayed = this.totalPremiumDisplayed - this.gstDisplayed;
    }
  }

  assignValue() {
    this.toSend.addOnArr = this.addOnBenifit;
    // console.log('this add on to senf', this.toSend.addOnArr);
    this.toSend['basePremium'] = this.basePremiumDisplayed;
    this.toSend['gst'] = this.gstDisplayed;
    this.toSend['totalPremium'] = this.totalPremiumDisplayed;
  }

  exitMoreDetails() {
    this.assignValue();
    this.toSend.isBuyNow = false;
    this.dialogRef.close(this.data);
  }

  onBuyNow() {
    this.assignValue();

    this.toSend.isBuyNow = true;

    this.dialogRef.close(this.data);
  }

  brochureLink(url) {
    window.open(url, '_blank');
  }
}
