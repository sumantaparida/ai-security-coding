import { Component, Input, OnChanges, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MoreDetailProtectionComponent } from '../more-detail-protection/more-detail-protection.component';
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
  selector: 'app-display-result-protection-quote',
  templateUrl: './display-result-protection-quote.component.html',
  styleUrls: ['./display-result-protection-quote.component.css'],
})
export class DisplayResultProtectionQuoteComponent implements OnInit, OnChanges {
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

  errordatafound = false;

  errorDetail;

  isBankCustomer;

  user;

  isBranchUser = false;

  premiumKey;

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
    this.isBranchUser = this.accountService.isBranchUser;
    this.accountService.user.subscribe((x) => (this.user = x));
    if (this.user['bankCustomer'] == 'false') {
      this.isBankCustomer = false;
    } else if (this.user['bankCustomer'] == 'true') {
      this.isBankCustomer = true;
    }
  }

  moreDetails(i) {
    if (!this.isDialogOpened) {
      const dialogRef = this.dialog.open(MoreDetailProtectionComponent, {
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
    // this.cookie.set('appData', JSON.stringify(createApplicationData));
    const dialogRef = this.dialog.open(SelectCustomerModalComponent, {
      // height: '400px',
      width: '45%',
      panelClass: 'dialog-width',
      // data:
      //   {}
    });

    dialogRef.afterOpened().subscribe(() => {
      this.isDialogOpened = true;
      // console.log(`Dialog result: ${result}`);
    });
    dialogRef.afterClosed().subscribe((res) => {
      this.isDialogOpened = false;

      // this.router.navigate(['action-selection'], { state: { example: 'bar' } });
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
    // console.log('slected product protection', selectedProduct, 'arr;', this.productQuoteArr[index]);
    const createApplicationData = {
      customerId: this.quoteInput.customerId,
      lob: 'Life',
      productType: 'Term',
      productId: selectedProduct.productId,
      planId: selectedProduct.planId,
      productName: selectedProduct.productName,
      insurerId: selectedProduct.insurerId,
      insurerName: selectedProduct.insurerName,
      pt: selectedProduct.pt,
      ppt: selectedProduct.ppt,
      mode: this.premiumKey,
      selectedMode: this.premiumKey,
      sa: selectedProduct.sa,
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
            sa: 0,
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
      this.callCreateApplication(selectedProduct, createApplicationData);
    }
  }

  callCreateApplication(selectedProduct, createApplicationData) {
    this.quoteService
      .createProtectionApplication(selectedProduct.productId, createApplicationData)
      .subscribe(
        (result) => {
          // const applicationArr = result;
          if (this.isBranchUser) {
            if (selectedProduct['askForFormType']) {
              const dialogRef = this.dialog.open(PolicyPromptModalComponent, {
                data: '',
                panelClass: 'dialog-width',
                disableClose: true,
              });
              dialogRef.afterClosed().subscribe((formType) => {
                console.log('data from modal', formType);
                if (formType !== '') {
                  if (formType === 'Long') {
                    if (result['productId'] === '147N071V01') {
                      this.checkNonMedical(result, selectedProduct);
                    } else {
                      this.router.navigate([
                        '/proposal',
                        selectedProduct.productId,
                        this.applicationNo,
                        formType,
                      ]);
                    }
                  } else {
                    const dialogRefPValut = this.dialog.open(PolicyErrorModalComponent, {
                      data: 'Your Lead has been forwarded to the Insurer RM',
                      panelClass: 'dialog-width',
                    });
                    dialogRefPValut.afterClosed().subscribe(() => {
                      this.router.navigate(['/policyvault']);
                    });
                  }
                }
              });
            } else {
              if (result['productId'] === '147N071V01') {
                this.checkNonMedical(result, selectedProduct);
              } else {
                this.router.navigate([
                  '/proposal',
                  selectedProduct.productId,
                  result['applicationNo'],
                  selectedProduct['defaultFormType'],
                ]);
              }
            }
          } else {
            if (result['productId'] === '147N071V01') {
              this.checkNonMedical(result, selectedProduct);
            } else {
              this.router.navigate([
                '/proposal',
                selectedProduct.productId,
                result['applicationNo'],
                'Long',
              ]);
            }
          }
        },
        (error) => {
          this.errordatafound = true;
          // this.isquoteLoading = false;
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

  routeToOffline() {
    this.router.navigate([
      '/offline-policies/new-application',
      'Life',
      this.quoteInput?.customerId,
      this.quoteInput?.productType,
    ]);
  }

  checkNonMedical(result, selectedProduct) {
    if (selectedProduct.planName.indexOf('Non Medical') > -1) {
      const dialogRefLeadError = this.dialog.open(PolicyErrorModalComponent, {
        data: 'The underwriting status of the customer may change basis the assessment of tele medicals and other information',
        panelClass: 'dialog-width',
      });
      dialogRefLeadError.afterClosed().subscribe(() => {
        // navigate
        this.router.navigate([
          '/proposal',
          selectedProduct.productId,
          result['applicationNo'],
          selectedProduct['defaultFormType'],
        ]);
      });
    } else {
      const dialogRefLeadError = this.dialog.open(PolicyErrorModalComponent, {
        data: 'Discount availed in 1st year premium is applicable only if medicals are completed in 7 days from login',
        panelClass: 'dialog-width',
      });
      dialogRefLeadError.afterClosed().subscribe(() => {
        // navigate
        this.router.navigate([
          '/proposal',
          selectedProduct.productId,
          result['applicationNo'],
          selectedProduct['defaultFormType'],
        ]);
      });
    }
  }
}
