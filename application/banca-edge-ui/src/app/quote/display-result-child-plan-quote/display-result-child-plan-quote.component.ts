import { Component, Input, OnChanges, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MoreDetailChildPlanComponent } from '../more-detail-child-plan/more-detail-child-plan.component';
import { QuoteService } from '../quote.service';
import { LoaderService } from '@app/_services/loader.service';
import { SelectCustomerModalComponent } from '../select-customer-modal/select-customer-modal.component';
import { QuoteDataService } from '@app/_services/quoteData.service';
import { AccountService } from '@app/_services';

export interface PolicyQuoteList {
  policyList;
  quoteInput;
}

export interface CreateAppicationData {
  totalPremium;
  basePremium;
  gst;
  addOnArr;
  isBuyNow;
}

@Component({
  selector: 'app-display-result-child-plan-quote',
  templateUrl: './display-result-child-plan-quote.component.html',
  styleUrls: ['./display-result-child-plan-quote.component.css'],
})
export class DisplayResultChildPlanQuoteComponent implements OnInit, OnChanges {
  @ViewChild('noQuoteGenerated') MyProp: ElementRef;

  isDialogOpened = false;

  @Input() finalQuote;

  @Input() minumumValue;

  @Input() higherValue;

  @Input() minimumPPTValue;

  @Input() higherPPTValue;

  productQuoteArr;

  quoteInput;

  hasOffline;

  isGuaranteed;

  addOnArr;

  gst;

  totalPremium;

  totalPremiumDisplayed;

  basepremium;

  applicationNo;

  isLoading;

  tempProductQuoteArr;

  errorDataFound = false;

  errorDetail;

  premiumKey;

  isBankCustomer;

  user;

  constructor(
    public dialog: MatDialog,
    private quoteService: QuoteService,
    private router: Router,
    private loaderService: LoaderService,
    private quoteDataRootService: QuoteDataService,
    private accountService: AccountService,
  ) {}

  ngOnChanges(changes) {
    if (changes.hasOwnProperty('finalQuote') && this.finalQuote !== undefined) {
      this.productQuoteArr = this.finalQuote?.productQuote;
      this.quoteInput = this.finalQuote?.quoteInput;
      this.hasOffline = this.finalQuote?.hasOffline;
      this.isGuaranteed = this.finalQuote?.quoteInput?.isGuaranteed;
      this.productQuoteArr?.filter((arr) => {
        arr.premiums.mode = Number(Object.keys(arr.premiums)[0]);
      });
    }
    if (
      (changes.hasOwnProperty('minumumValue') && this.minumumValue !== undefined) ||
      (changes.hasOwnProperty('higherValue') && this.higherValue !== undefined) ||
      (changes.hasOwnProperty('minimumPPTValue') && this.minimumPPTValue !== undefined) ||
      (changes.hasOwnProperty('higherPPTValue') && this.higherPPTValue !== undefined)
    ) {
      this.productQuoteArr = this.finalQuote?.productQuote;
      this.tempProductQuoteArr = this.productQuoteArr?.filter((arr) => {
        if (
          arr.ppt >= this.minimumPPTValue &&
          arr.ppt <= this.higherPPTValue &&
          arr.pt >= this.minumumValue &&
          arr.pt <= this.higherValue
        ) {
          return arr;
        }
      });

      this.productQuoteArr = this.tempProductQuoteArr;
      this.tempProductQuoteArr = this.finalQuote?.productQuote;
    }
  }

  ngOnInit(): void {
    this.accountService.user.subscribe((x) => (this.user = x));
    if (this.user['bankCustomer'] == 'false') {
      this.isBankCustomer = false;
    } else if (this.user['bankCustomer'] == 'true') {
      this.isBankCustomer = true;
    }
  }

  moreDetails(i) {
    if (!this.isDialogOpened) {
      const dialogRef = this.dialog.open(MoreDetailChildPlanComponent, {
        data: { policyList: this.productQuoteArr[i], quoteInput: this.quoteInput },
        disableClose: true,
        panelClass: 'more-details-width',
      });
      dialogRef.afterOpened().subscribe(() => {
        this.isDialogOpened = true;
      });
      dialogRef.afterClosed().subscribe((res) => {
        this.isDialogOpened = false;
        if (res['isBuyNow'] === true) {
          this.onBuyNow(i);
        }
      });
    }
  }

  selectCustomer(selectedProduct, createApplicationData) {
    this.isLoading = false;
    this.quoteDataRootService.setData(createApplicationData);
    const dialogRef = this.dialog.open(SelectCustomerModalComponent, {
      width: '45%',
      panelClass: 'dialog-width',
    });

    dialogRef.afterOpened().subscribe(() => {
      this.isDialogOpened = true;
    });
    dialogRef.afterClosed().subscribe((res) => {
      this.isDialogOpened = false;
      if (res) {
        this.router.navigate(['/mycustomers', selectedProduct.productId]);
      }
    });
  }

  onBuyNow(index) {
    const selectedProduct = this.productQuoteArr[index];
    this.premiumKey = Object.keys(selectedProduct.premiums)[0];
    if (
      this.basepremium === undefined ||
      this.gst === undefined ||
      this.totalPremium === undefined
    ) {
      this.basepremium = selectedProduct.premiums[this.premiumKey].basePremium;
      this.gst = selectedProduct.premiums[this.premiumKey].gst;
      this.totalPremium = selectedProduct.premiums[this.premiumKey].totalPremium;
    }
    const createApplicationData = {
      customerId: this.quoteInput.customerId,
      lob: 'Life',
      productType: 'ENDW',
      productId: selectedProduct.productId,
      planId: selectedProduct.planId,
      productName: selectedProduct.productName,
      insurerId: selectedProduct.insurerId,
      insurerName: selectedProduct.insurerName,
      pt: selectedProduct.pt,
      ppt: selectedProduct.ppt,
      sa: selectedProduct.sa,
      mode: this.premiumKey,
      selectedMode: this.premiumKey,
      pb: {
        basePremium: this.basepremium,
        gst: this.gst,
        totalPremium: this.totalPremium,
        base: [
          {
            coverId: 'MORT',
            displayName: 'Life Cover',
            sa: 0,
            netPremium: this.basepremium,
            premium: this.totalPremium,
            selected: false,
          },
        ],
        addon: [],
      },
      quoteInput: this.finalQuote.quoteInput,
    };
    if (this.addOnArr !== undefined) {
      createApplicationData['addons'] = this.addOnArr;
    }
    if (this.quoteInput.customerId === 0 && !this.isBankCustomer) {
      this.selectCustomer(selectedProduct, createApplicationData);
    } else {
      this.callCreateApplication(selectedProduct, createApplicationData);
    }
  }

  callCreateApplication(selectedProduct, createApplicationData) {
    this.loaderService.showSpinner(true);
    this.quoteService
      .createChildPlanApplication(selectedProduct.productId, createApplicationData)
      .subscribe(
        (result) => {
          this.loaderService.showSpinner(false);
          const applicationArr = result;
          if (applicationArr['online'] === false) {
            this.applicationNo = applicationArr['applicationNo'];
            this.isLoading = false;
            this.router.navigate(['/quote/offline-childplan-purchase', this.applicationNo]);
          } else {
            this.applicationNo = applicationArr['applicationNo'];
            this.isLoading = false;
            this.router.navigate(['/proposal/childplanfg', this.applicationNo]);
          }
        },
        (error) => {
          this.errorDataFound = true;
          this.loaderService.showSpinner(false);
          if (
            error === 'Sorry the server was unable to process your request Internal Server Error'
          ) {
            this.errorDetail = error;
          } else {
            this.errorDetail = 'Sorry the server was unable to process your request';
          }
          this.MyProp.nativeElement.scrollIntoView({ behavior: 'smooth' });
        },
      );
  }

  illustrationLink(url) {
    window.open(url, '_blank');
  }

  routeToOffline() {
    this.router.navigate([
      '/offline-policies/new-application',
      'Life',
      this.quoteInput?.customerId,
      this.quoteInput?.productType,
    ]);
  }
}
