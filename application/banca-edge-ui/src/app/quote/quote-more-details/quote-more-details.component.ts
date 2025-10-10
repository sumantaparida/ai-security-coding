import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CreateAppicationData, PolicyQuoteList } from '../display-result-quote/display-result-quote.component';
import { QuoteService } from '../quote.service';

@Component({
  selector: 'app-quote-more-details',
  templateUrl: './quote-more-details.component.html',
  styleUrls: ['./quote-more-details.component.css']
})
export class QuoteMoreDetailsComponent implements OnInit {


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
  isBuyNow;

  constructor(
    public dialogRef: MatDialogRef<QuoteMoreDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public toSend: CreateAppicationData, private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: PolicyQuoteList, private quoteService: QuoteService
  ) { }

  ngOnInit(): void {
    this.dialogRef.disableClose = true;
    this.policyQuoteArr = this.data.policyList;
    this.quoteInput = this.data.quoteInput;
    this.includedBenefit = this.policyQuoteArr?.standardBenefits;
    this.addOnBenifit = this.policyQuoteArr?.addonBenefits;
    this.premiumsObj = this.policyQuoteArr?.premiums;
    this.addOnBenifit.map(element => {
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

    this.addOnBenifit.map(arr => {
      if (!arr.coverId) {
        this.showCustomisePolicy = false;
      } else {
        this.showCustomisePolicy = true;
      }
    });
    this.netPremiumCustomPolicy = this.addOnBenifit.map(arr => {
      return arr.premium[0].netPremium;
    });
    this.premiumCustomPolicy = this.addOnBenifit.map(arr => {
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

  goToBrochure(url) {
    window.open(url, '_blank');
  }

  addOrRemoveCustomisePolicy(index) {
    if (this.addOnBenifit[index].selected === false) {
      this.showSentence = this.removeSentence;
      this.showBtn = this.removeBtn;
      this.showBtnMobile = this.removeBtnMobile;
      // making selected true
      const val = this.totalPremiumDisplayed + this.addOnBenifit[index].premium[0]?.premium;
      this.addOnBenifit[index].selected = true;

      this.includedBenefit.unshift(this.addOnBenifit[index]);
      // this.addOnBenifit[index].selected = true;
      this.totalPremiumDisplayed = val;
      this.gstCustomPolicy = this.premiumCustomPolicy[index] - this.netPremiumCustomPolicy[index];
      this.gstDisplayed = this.gstDisplayed + this.gstCustomPolicy;
      this.basePremiumDisplayed = this.totalPremiumDisplayed - this.gstDisplayed;
    }
    else if (this.addOnBenifit[index].selected === true) {
      this.showSentence = this.addSentence;
      this.showBtn = this.addBtn;
      this.showBtnMobile = this.addBtnMobile;
      // making selected false
      this.addOnBenifit[index].selected = false;
      const val = this.totalPremiumDisplayed - this.addOnBenifit[index].premium[0]?.premium;
      const toRemoveIndex = this.includedBenefit.findIndex(arr => arr.coverId === this.addOnBenifit[index].coverId);
      this.addOnBenifit[index].slected = false;
      this.includedBenefit.splice(toRemoveIndex, 1);
      this.totalPremiumDisplayed = val;
      this.gstDisplayed = this.gstDisplayed - this.gstCustomPolicy;
      this.basePremiumDisplayed = this.totalPremiumDisplayed - this.gstDisplayed;
    }
  }



  exitMoreDetails() {
    this.toSend.addOnArr = this.addOnBenifit.filter(arr => {
      if (arr.selected === true) {
        return arr;
      }
    });
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
}
