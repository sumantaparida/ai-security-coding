import { Component, Input, OnChanges, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MoreDetailMotorComponent } from '../more-detail-motor/more-detail-motor.component';
import { QuoteService } from '../quote.service';
import { LoaderService } from '@app/_services/loader.service';
import { SelectCustomerModalComponent } from '../select-customer-modal/select-customer-modal.component';
import { QuoteDataService } from '@app/_services/quoteData.service';
import { PolicyPromptModalComponent } from '@app/shared/components/policy-prompt-modal/policy-prompt-modal.component';
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
  selector: 'app-display-result-motor-quote',
  templateUrl: './display-result-motor-quote.component.html',
  styleUrls: ['./display-result-motor-quote.component.css'],
})
export class DisplayResultMotorQuoteComponent implements OnInit, OnChanges {
  @ViewChild('noQuoteGenerated') MyProp: ElementRef;

  isDialogOpened = false;

  @Input() finalQuote;

  productQuoteArr;

  quoteInput;

  hasOffline;

  addOnArr;

  gst;

  totalPremium;

  totalPremiumDisplayed;

  basepremium;

  applicationNo;

  isLoading;

  errordatafound = false;

  errorDetail;

  isBankCustomer;

  isBranchUser = false;

  user;

  constructor(
    public dialog: MatDialog,
    private quoteService: QuoteService,
    private router: Router,
    private loaderService: LoaderService,
    private quoteDataRootService: QuoteDataService,
    private accountService: AccountService,
  ) {}

  ngOnChanges() {
    this.productQuoteArr = this.finalQuote?.productQuote;
    if (this.productQuoteArr !== undefined) {
      this.productQuoteArr.sort(this.compareValues('productId', 'desc'));
    }
    this.quoteInput = this.finalQuote?.quoteInput;
    this.hasOffline = this.finalQuote?.hasOffline;

    this.totalPremiumDisplayed = this.productQuoteArr?.map((arr) => {
      return arr.premiums[0]?.totalpremium;
    });
    this.gst = this.productQuoteArr?.map((arr) => {
      return arr.premiums[0]?.gst;
    });
    this.basepremium = this.productQuoteArr?.map((arr) => {
      return arr.premiums[0]?.basePremium;
    });
  }

  ngOnInit() {
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
      // const dialogRef = this.dialog.open(MoreDetailMotorComponent, { data: { policyList: this.productQuoteArr[i] } });
      const dialogRef = this.dialog.open(MoreDetailMotorComponent, {
        data: { policyList: this.productQuoteArr[i], quoteInput: this.quoteInput },
        disableClose: true,
        panelClass: 'more-details-width',
      });
      dialogRef.afterOpened().subscribe(() => {
        this.isDialogOpened = true;
      });
      dialogRef.afterClosed().subscribe((res) => {
        this.isDialogOpened = false;
        if (res !== undefined) {
          this.addOnArr = res.addOnArr;
          this.gst = res.gst;
          this.basepremium = res.basePremium;
          this.totalPremium = res.totalPremium;
          this.productQuoteArr[i].premiums[0].totalPremium = res.totalPremium;
          this.productQuoteArr[i].premiums[0].basePremium = res.basePremium;
          this.productQuoteArr[i].premiums[0].gst = res.gst;
        }
        if (res['isBuyNow'] === true) {
          this.onBuyNow(i);
        }
      });
    }
  }

  compareValues(key, order) {
    return function innerSort(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      }

      const varA = typeof a[key] === 'string' ? a[key].toUpperCase() : a[key];
      const varB = typeof b[key] === 'string' ? b[key].toUpperCase() : b[key];

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return order === 'desc' ? comparison * -1 : comparison;
    };
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
    if (
      this.basepremium === undefined ||
      this.gst === undefined ||
      this.totalPremium === undefined
    ) {
      this.basepremium = selectedProduct.premiums[0].basePremium;
      this.gst = selectedProduct.premiums[0].gst;
      this.totalPremium = selectedProduct.premiums[0].totalPremium;
    }
    const createApplicationData = {
      customerId: this.quoteInput.customerId,
      lob: 'Motor',
      productType: 'PC',
      productId: selectedProduct.productId,
      planId: selectedProduct.planId,
      productName: selectedProduct.productName,
      insurerId: selectedProduct.insurerId,
      insurerName: selectedProduct.insurerName,
      pt: selectedProduct.pt,
      ppt: selectedProduct.ppt,
      selectedMode: selectedProduct.selectedMode,
      sa: selectedProduct.sa,
      pb: {
        basePremium: this.basepremium,
        gst: this.gst,
        totalPremium: this.totalPremium,
        base: [
          {
            coverId: 'HOSP',
            displayName: 'Base Cover',
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
    // if (this.finalQuote.quoteInput === 0) {
    //   createApplicationData['customerId'] = 0;
    // } else {
    //   createApplicationData['customerId'] = this.finalQuote.quoteInput.customerId;
    // }
    if (this.addOnArr !== undefined) {
      createApplicationData['addons'] = this.addOnArr;
    }

    if (this.quoteInput.customerId === 0 && !this.isBankCustomer) {
      this.selectCustomer(selectedProduct, createApplicationData);
    } else {
      this.callCreateApplication(selectedProduct, createApplicationData, index);
    }
  }

  callCreateApplication(selectedProduct, createApplicationData, index) {
    this.loaderService.showSpinner(true);
    this.quoteService
      .createMotorApplication(selectedProduct.productId, createApplicationData)
      .subscribe(
        (result) => {
          this.loaderService.showSpinner(false);
          const applicationArr = result;
          // if (applicationArr['online'] === false) {
          //   this.applicationNo = applicationArr['applicationNo'];
          //   // this.isLoading = false;
          //   this.router.navigate(['/quote/offline-motor-purchase', this.applicationNo]);
          // } else if (applicationArr['online'] === true) {
          this.applicationNo = applicationArr['applicationNo'];
          if (this.isBranchUser) {
            if (this.productQuoteArr[index]['askForFormType']) {
              const dialogRef = this.dialog.open(PolicyPromptModalComponent, {
                width: '650px',
                height: '250px',
                data: '',
                // panelClass: 'dialog-width',
                backdropClass: 'dailogBoxBackground',
                disableClose: true,
              });
              dialogRef.afterClosed().subscribe((formType) => {
                console.log('data from modal', formType);
                this.router.navigate([
                  '/proposal',
                  selectedProduct.productId,
                  this.applicationNo,
                  formType,
                ]);
              });
            } else {
              this.router.navigate([
                '/proposal',
                selectedProduct.productId,
                this.applicationNo,
                this.productQuoteArr[index]['defaultFormType'],
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
          // }
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
      'Motor',
      this.quoteInput?.customerId,
      this.quoteInput?.productType,
    ]);
  }
}
