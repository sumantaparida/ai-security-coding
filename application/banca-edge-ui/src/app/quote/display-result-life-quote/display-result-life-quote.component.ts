import { Component, Input, OnChanges, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MoreDetailLifeComponent } from '../more-detail-life/more-detail-life.component';
import { QuoteService } from '../quote.service';
import { LoaderService } from '@app/_services/loader.service';
import { SelectCustomerModalComponent } from '../select-customer-modal/select-customer-modal.component';
import { QuoteDataService } from '@app/_services/quoteData.service';
import { AccountService } from '@app/_services';
import { PolicyPromptModalComponent } from '@app/shared/components/policy-prompt-modal/policy-prompt-modal.component';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';

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
  selector: 'app-display-result-life-quote',
  templateUrl: './display-result-life-quote.component.html',
  styleUrls: ['./display-result-life-quote.component.css'],
})
export class DisplayResultLifeQuoteComponent implements OnInit, OnChanges {
  @ViewChild('noQuoteGenerated') MyProp: ElementRef;

  isDialogOpened = false;

  @Input() finalQuote;

  @Input() minumumValue;

  @Input() higherValue;

  @Input() minimumPPTValue;

  @Input() higherPPTValue;

  @Input() minimumPayout;

  @Input() higherPayout;

  productQuoteArr;

  quoteInput;

  hasOffline;

  isGuaranteed;

  addOnArr;

  gst;

  totalPremium;

  basepremium;

  applicationNo;

  isLoading;

  tempProductQuoteArr;

  errorDataFound = false;

  errorDetail;

  premiumKey;

  user;

  isBankCustomer;

  productId;

  isBranchUser = false;

  // showShortDesciption: boolean[] = [];

  // isIndexZero: Array<boolean> = [];

  isIndexZero;

  showShortDesciption;

  groupedProductQuote;

  groupedProductArr;

  Object = Object;

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
      this.productQuoteArr?.forEach((arr) => {
        arr.premiums.mode = Number(Object.keys(arr.premiums)[0]);
      });
    }
    if (
      (changes.hasOwnProperty('minumumValue') && this.minumumValue !== undefined) ||
      (changes.hasOwnProperty('higherValue') && this.higherValue !== undefined) ||
      (changes.hasOwnProperty('minimumPPTValue') && this.minimumPPTValue !== undefined) ||
      (changes.hasOwnProperty('higherPPTValue') && this.higherPPTValue !== undefined) ||
      (changes.hasOwnProperty('minimumPayout') && this.minimumPayout !== undefined) ||
      (changes.hasOwnProperty('higherPayout') && this.higherPayout !== undefined)
    ) {
      this.productQuoteArr = this.finalQuote?.productQuote;
      // --grouping--

      this.tempProductQuoteArr = this.productQuoteArr?.filter((arr) => {
        if (
          arr.ppt >= this.minimumPPTValue &&
          arr.ppt <= this.higherPPTValue &&
          arr.pt >= this.minumumValue &&
          arr.pt <= this.higherValue &&
          arr.payoutPeriod <= this.higherPayout &&
          arr.payoutPeriod >= this.minimumPayout
        ) {
          return arr;
        }
      });

      this.productQuoteArr = this.tempProductQuoteArr;
      this.tempProductQuoteArr = this.finalQuote?.productQuote;
    }

    this.groupedProductQuote = this.productQuoteArr?.reduce((acc, curr) => {
      if (!acc[curr.productName]) acc[curr.productName] = [];
      acc[curr.productName].push(curr);
      return acc;
    }, {});
    if (this.groupedProductQuote) {
      // this.isIndexZero:Array<boolean> = [Object.keys(this.groupedProductQuote).length] ;
      this.isIndexZero = new Array(Object.keys(this.groupedProductQuote).length).fill(true);
      this.showShortDesciption = new Array(Object.keys(this.groupedProductQuote).length).fill(true);
      Object.values(this.groupedProductQuote)?.forEach((arr) => {
        console.log(arr, 'arr');
        this.groupedProductArr = arr;
      });
    }
    console.log('grpp', this.groupedProductQuote, this.groupedProductArr, this.isIndexZero);
  }

  ngOnInit(): void {
    // Array.fill(this.showShortDesciption, true);
    // this.showShortDesciption.fill(true);
    // this.isIndexZero.fill(true);
    this.isBranchUser = this.accountService.isBranchUser;
    this.accountService.user.subscribe((x) => (this.user = x));
    if (this.user['bankCustomer'] === 'false') {
      this.isBankCustomer = false;
    } else if (this.user.bankCustomer === 'true') {
      this.isBankCustomer = true;
    }
  }

  moreDetails(j, i) {
    if (!this.isDialogOpened) {
      let objToPass;
      if (j === '') {
        objToPass = this.productQuoteArr[i];
      } else {
        objToPass = Object.values(this.groupedProductQuote)[j][i];
      }
      const dialogRef = this.dialog.open(MoreDetailLifeComponent, {
        data: {
          policyList: objToPass,
          quoteInput: this.quoteInput,
        },
        disableClose: true,
        panelClass: 'more-details-width',
      });
      dialogRef.afterOpened().subscribe(() => {
        this.isDialogOpened = true;
      });
      dialogRef.afterClosed().subscribe((res) => {
        this.isDialogOpened = false;
        if (res['isBuyNow'] === true) {
          this.onBuyNow(j, i);
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

  

  onBuyNow(j, index) {
    // this.isLoading = true;
    console.log('slected product = ', Object.values(this.groupedProductQuote)[j][index], j, index);

    const selectedProduct = Object.values(this.groupedProductQuote)[j][index];
    const checkSp = this.quoteService.checkSpValidation(selectedProduct.insurerId)
    if(checkSp){
      const message = 'Non specified person cannot proceed. SP can login for new proposal';
      const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
        data: message,
        panelClass: 'dialog-width',
      });
    }

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
        illustrationId: selectedProduct.premiums[this.premiumKey].illustrationId,
        illustrationUrl: selectedProduct.premiums[this.premiumKey].illustrationUrl,
        base: [
          {
            coverId: 'MORT',
            displayName: 'Life Cover',
            sa: selectedProduct.sa,
            netPremium: this.basepremium,
            premium: this.totalPremium,
            selected: false,
          },
        ],
        addon: [],
      },
      // addons: this.addOnArr,
      quoteInput: this.finalQuote.quoteInput,
    };
    if (this.addOnArr !== undefined) {
      createApplicationData['addons'] = this.addOnArr;
    }
    if (this.quoteInput.customerId === 0 && !this.isBankCustomer) {
      this.selectCustomer(selectedProduct, createApplicationData);
    } else {
      this.callCreateApplication(selectedProduct, createApplicationData, j, index);
    }
  }

  callCreateApplication(selectedProduct, createApplicationData, j, index) {
    this.loaderService.showSpinner(true);
    this.quoteService
      .createLifeApplication(selectedProduct.productId, createApplicationData)
      .subscribe(
        (result) => {
          this.loaderService.showSpinner(false);
          const applicationArr = result;
          // if (applicationArr['online'] === false) {
          //   this.applicationNo = applicationArr['applicationNo'];
          //   this.loaderService.showSpinner(false);
          //   this.router.navigate(['/quote/offline-life-purchase', this.applicationNo]);
          // } else {
          // this.applicationNo = applicationArr['applicationNo'];
          // this.productId = applicationArr['productId'];
          // this.loaderService.showSpinner(false);
          // this.router.navigate(['/proposal', this.productId, this.applicationNo]);
          // }
          this.applicationNo = applicationArr['applicationNo'];
          if (this.isBranchUser) {
            if (selectedProduct['askForFormType']) {
              const dialogRef = this.dialog.open(PolicyPromptModalComponent, {
                data: '',
                panelClass: 'dialog-width',
                disableClose: true,
              });
              dialogRef.afterClosed().subscribe((formType) => {
                console.log('data from modal', formType);
                // this.router.navigate(['/proposal', selectedProduct.productId, this.applicationNo, formType]);
                if (formType !== '') {
                  if (formType === 'Long') {
                    this.router.navigate([
                      '/proposal',
                      selectedProduct.productId,
                      this.applicationNo,
                      formType,
                    ]);
                  } else {
                    const dialogRefLeadError = this.dialog.open(PolicyErrorModalComponent, {
                      data: 'Your Lead has been forwarded to the Insurer RM',
                      panelClass: 'dialog-width',
                    });
                    dialogRefLeadError.afterClosed().subscribe(() => {
                      // navigate
                      this.router.navigate(['/policyvault']);
                    });
                  }
                }
              });
            } else {
              this.router.navigate([
                '/proposal',
                selectedProduct.productId,
                this.applicationNo,
                selectedProduct['defaultFormType'],
              ]);
            }
          } else {
            this.router.navigate([
              '/proposal',
              selectedProduct.productId,
              this.applicationNo,
              'Long',
            ]);
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
          // if (error.status === 500) {
          //   this.errorDetail = error.error.message;
          // } else {
          //   this.errorDetail = error.error.details[0];
          // }
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

  viewAll(i, j) {
    console.log('perinitng ', i, j);

    this.showShortDesciption[j] = !this.showShortDesciption[j];
    this.isIndexZero[j] = !this.isIndexZero[j];
  }
}
