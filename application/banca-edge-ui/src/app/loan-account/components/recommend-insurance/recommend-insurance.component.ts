import { Component, OnInit, OnDestroy } from '@angular/core';
import { RecommendService } from '@app/loan-account/service/recommend-service';
import { MatDialog } from '@angular/material/dialog';
import { LoanComponent } from '@app/loan-account/loan.component';
import { MoreDetailsHealthComponent } from '@app/quote/more-details-health/more-details-health.component';
import { LoaderService } from '@app/_services/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recommend-insurance',
  templateUrl: './recommend-insurance.component.html',
  styleUrls: ['./recommend-insurance.component.css'],
})
export class RecommendInsuranceComponent implements OnInit, OnDestroy {
  productQuoteArr = [];
  recommendationData;
  quoteInput;
  quoteId;
  isDialogOpened = false;
  addOnArr;
  gst;
  basepremium;
  totalPremium;
  premiumKey;
  productQuote;
  quoteForm: FormGroup;
  enableBtn = false;
  public getQuoteSubscription: Subscription;

  constructor(
    private recommendService: RecommendService,
    public dialog: MatDialog,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.quoteForm = new FormGroup({});
    this.route.params.subscribe((param) => {
      if (param.quoteId) {
        this.quoteId = param.quoteId;
      }
    });

    this.loaderService.showSpinner(true);
    this.recommendService.getQuoteById(this.quoteId).subscribe(
      (data) => {
        this.loaderService.showSpinner(false);

        this.quoteId = data['quoteId'];
        if (data['numQuotesExpected'] > 0) {
          this.getQuoteSubscription = this.recommendService.getHealthQuote(this.quoteId).subscribe(
            (result) => {
              this.recommendationData = result;
              this.recommendationData.productQuote.forEach((product, index) => {
                if (this.quoteForm.get(`product-checkbox-${index}`) === null) {
                  this.quoteForm.addControl(`product-checkbox-${index}`, new FormControl());
                }
              });
            },
            (error) => {
              this.loaderService.showSpinner(false);
            },
          );
        }
      },
      (error) => {
        this.loaderService.showSpinner(false);
      },
    );
  }

  ngOnDestroy() {
    if (this.recommendService.fetchQuoteSuccess) {
      this.recommendService.fetchQuoteSuccess.unsubscribe();
    }
    if (this.getQuoteSubscription) {
      this.getQuoteSubscription.unsubscribe();
    }
  }

  onSubmit() {
    const allReqBody = [];
    Object.keys(this.quoteForm.controls).forEach((control) => {
      if (this.quoteForm.get(control).value) {
        const currentIndex = control.slice(-1);
        const selectedMode = this.recommendationData.productQuote[currentIndex].selectedMode;
        const reqBody = {
          customerId: this.recommendationData.quoteInput.customerId,
          lob: 'Life',
          productType: 'GC',
          productId: this.recommendationData.productQuote[currentIndex].productId,
          planId: this.recommendationData.productQuote[currentIndex].planId,
          productName: this.recommendationData.productQuote[currentIndex].productName,
          insurerId: this.recommendationData.productQuote[currentIndex].insurerId,
          insurerName: this.recommendationData.productQuote[currentIndex].insurerName,
          pt: this.recommendationData.productQuote[currentIndex].pt,
          ppt: this.recommendationData.productQuote[currentIndex].ppt,
          selectedMode: this.recommendationData.productQuote[currentIndex].selectedMode,
          sa: this.recommendationData.productQuote[currentIndex].sa,
          pb: this.recommendationData.productQuote[currentIndex].premiums[selectedMode],
          quoteInput: this.recommendationData.quoteInput,
        };
        allReqBody.push(this.recommendService.createApplication(reqBody.productId, reqBody));
      }
    });
    this.loaderService.showSpinner(true);

    forkJoin(allReqBody).subscribe(
      (res) => {
        this.loaderService.showSpinner(false);
        if (res.length === 1) {
          this.router.navigate(['proposal', res[0]['productId'], res[0]['applicationNo'], 'Long']);
        } else {
          this.router.navigate(['policyvault']);
        }
      },
      (error) => {
        this.loaderService.showSpinner(false);
      },
    );
  }

  onCheckboxChange(event) {
    if (event.checked) {
      this.enableBtn = true;
    } else {
      let flag = false;
      Object.keys(this.quoteForm.controls).forEach((control) => {
        if (this.quoteForm.get(control).value) {
          flag = true;
        }
      });
      if (flag) {
        this.enableBtn = true;
      } else {
        this.enableBtn = false;
      }
    }
  }

  moreDetails(i) {
    if (!this.isDialogOpened) {
      const dialogRef = this.dialog.open(MoreDetailsHealthComponent, {
        data: { policyList: this.recommendationData.productQuote[i], quoteInput: this.quoteInput },
        panelClass: 'more-details-width',
      });
      dialogRef.afterOpened().subscribe((result) => {
        this.isDialogOpened = true;
      });
      dialogRef.afterClosed().subscribe((res) => {
        this.isDialogOpened = false;
        if (res !== undefined) {
          this.addOnArr = res.policyList.addonBenefits;
          this.gst = res.gst;
          this.basepremium = res.basePremium;
          this.totalPremium = res.totalPremium;
          this.premiumKey = Object.keys(this.productQuoteArr[i].premiums)[0];
          this.productQuoteArr[i].premiums[this.premiumKey].totalPremium = res.totalPremium;
          this.productQuoteArr[i].premiums[this.premiumKey].gst = res.gst;
          this.productQuoteArr[i].premiums[this.premiumKey].basePremium = res.basePremium;
        } else {
          this.addOnArr = this.productQuoteArr[i]?.addonBenefits;
        }
      });
    }
  }
}
