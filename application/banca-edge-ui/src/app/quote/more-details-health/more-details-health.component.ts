import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  CreateAppicationData,
  PolicyQuoteList,
} from '../display-result-quote/display-result-quote.component';
import { QuoteService } from '../quote.service';

@Component({
  selector: 'app-more-details-health',
  templateUrl: './more-details-health.component.html',
  styleUrls: ['./more-details-health.component.css'],
})
export class MoreDetailsHealthComponent implements OnInit {
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

  addOnBenifitCopy;

  isBuyNow;

  premiumKey;

  constructor(
    public dialogRef: MatDialogRef<MoreDetailsHealthComponent>,
    @Inject(MAT_DIALOG_DATA) public toSend: CreateAppicationData,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: PolicyQuoteList,
    private quoteService: QuoteService,
  ) {}

  ngOnInit(): void {
    this.dialogRef.disableClose = true;
    this.policyQuoteArr = this.data.policyList;
    this.quoteInput = this.data.quoteInput;
    this.includedBenefit = this.policyQuoteArr?.standardBenefits;
    this.addOnBenifit = this.policyQuoteArr?.addonBenefits;
    this.addOnBenifit?.forEach((arr) => {
      arr.premium.mode = Number(Object.keys(arr.premium)[0]);
    });
    this.addOnBenifitCopy = JSON.parse(JSON.stringify(this.addOnBenifit));
    this.premiumsObj = this.policyQuoteArr?.premiums;

    this.addOnBenifit.map((element) => {
      if (element.selected === false) {
        element['showBtn'] = this.addBtn;
        element['showSentence'] = this.addSentence;
        element['showBtnMobile'] = this.addBtnMobile;
      } else {
        element['showBtn'] = this.removeBtn;
        element['showSentence'] = this.removeSentence;
        element['showBtnMobile'] = this.removeBtnMobile;
      }
    });

    this.premiumKey = Object.keys(this.policyQuoteArr?.premiums)[0];
    this.totalPremiumDisplayed = this.premiumsObj[this.premiumKey].totalPremium;
    this.gstDisplayed = this.premiumsObj[this.premiumKey].gst;
    this.basePremiumDisplayed = this.premiumsObj[this.premiumKey]?.basePremium;
    this.addOnBenifit.map((arr) => {
      if (!arr.coverId) {
        this.showCustomisePolicy = false;
      } else {
        this.showCustomisePolicy = true;
      }
    });
    this.netPremiumCustomPolicy = this.addOnBenifit.map((arr) => {
      this.premiumKey = Object.keys(arr.premium)[0];
      return arr.premium[this.premiumKey].netPremium;
    });
    this.premiumCustomPolicy = this.addOnBenifit.map((arr) => {
      this.premiumKey = Object.keys(arr.premium)[0];
      return arr.premium[this.premiumKey]?.premium;
    });
    this.gstCustomPolicy = this.addOnBenifit.map((arr) => {
      this.premiumKey = Object.keys(arr.premium)[0];
      return arr.premium[this.premiumKey]?.premium - arr.premium[this.premiumKey]?.netPremium;
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

  goToBrochure(url) {
    window.open(url, '_blank');
  }

  addOrRemoveCustomisePolicy(index) {
    if (this.addOnBenifit[index].selected === false) {
      // console.log('inisde add n remove fasle');
      // this.gstCustomPolicy = this.premiumCustomPolicy[index] - this.netPremiumCustomPolicy[index];
      this.addOnBenifit[index].showSentence = this.removeSentence;
      this.addOnBenifit[index].showBtn = this.removeBtn;
      this.addOnBenifit[index].showBtnMobile = this.removeBtnMobile;
      // making selected true
      this.premiumKey = Object.keys(this.addOnBenifit[index].premium)[0];
      const val =
        this.totalPremiumDisplayed + this.addOnBenifit[index].premium[this.premiumKey]?.premium;
      this.addOnBenifit[index].selected = true;
      // this.addOnBenifitCopy[index].selected = true;
      // const addOn = {
      //   coverId: this.addOnBenifitCopy[index].coverId,
      //   sa: this.addOnBenifitCopy[index].sa,
      //   displayName: this.addOnBenifitCopy[index].displayName
      // };
      // this.toSend.addOnArr.push(addOn);

      this.includedBenefit.unshift(this.addOnBenifit[index]);
      // this.addOnBenifit[index].selected = true;
      // console.log('included benefit', this.premiumCustomPolicy);
      this.totalPremiumDisplayed = val;
      // console.log('included benefit in flsee', this.gstCustomPolicy, this.gstDisplayed);

      this.gstDisplayed = this.gstDisplayed + this.gstCustomPolicy[index];
      this.basePremiumDisplayed = this.totalPremiumDisplayed - this.gstDisplayed;
    } else if (this.addOnBenifit[index].selected === true) {
      // console.log('inisde add n remove true');
      this.addOnBenifit[index].showSentence = this.addSentence;
      this.addOnBenifit[index].showBtn = this.addBtn;
      this.addOnBenifit[index].showBtnMobile = this.addBtnMobile;
      // making selected false
      this.addOnBenifit[index].selected = false;
      // this.gstCustomPolicy = this.premiumCustomPolicy[index] - this.netPremiumCustomPolicy[index];
      this.premiumKey = Object.keys(this.addOnBenifit[index].premium)[0];
      // this.addOnBenifitCopy[index].selected = false;
      const val =
        this.totalPremiumDisplayed - this.addOnBenifit[index].premium[this.premiumKey]?.premium;
      const toRemoveIndex = this.includedBenefit.findIndex(
        (arr) => arr.coverId === this.addOnBenifit[index].coverId,
      );
      this.addOnBenifit[index].slected = false;
      this.includedBenefit.splice(toRemoveIndex, 1);
      this.totalPremiumDisplayed = val;
      // console.log('included benefit in true', this.gstCustomPolicy, this.gstDisplayed, this.premiumCustomPolicy);

      this.gstDisplayed = this.gstDisplayed - this.gstCustomPolicy[index];
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
}
