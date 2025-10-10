import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';
import { PolicyPromptModalComponent } from '@app/shared/components/policy-prompt-modal/policy-prompt-modal.component';
import { AccountService } from '@app/_services';
import { LoaderService } from '@app/_services/loader.service';
import { QuoteDataService } from '@app/_services/quoteData.service';
import { CookieService } from 'ngx-cookie-service';
import { filter, groupBy } from 'rxjs/operators';
import { MoreDetailsHealthComponent } from '../more-details-health/more-details-health.component';
import { QuoteService } from '../quote.service';
import { SelectCustomerModalComponent } from '../select-customer-modal/select-customer-modal.component';
// import { SelectCustomerModalComponent } from '../select-customer-modal/select-customer-modal.component';

export interface PolicyQuoteList {
  policyList;
  quoteInput;
  addOnArr;
}
export interface CreateAppicationData {
  totalPremium;
  basePremium;
  gst;
  isBuyNow;
  addOnArr;
}
@Component({
  selector: 'app-display-result-ci',
  templateUrl: './display-result-ci.component.html',
  styleUrls: ['./display-result-ci.component.css'],
})
export class DisplayResultCiComponent implements OnInit, OnChanges {
  isDialogOpened = false;

  @Input() finalQuote;

  productQuoteArr;

  quoteInput;

  hasOffline;

  addOnArray = [];

  addOn = {};
  // addOn: {

  //   coverId: string,
  //   displayName: string,
  //   netPremium: string,
  //   premium: string,
  //   sa: string,
  //   selected: boolean
  // };
  addOnArr;

  addOnArrFinal = [];

  gst;

  totalPremium;

  totalPremiumDisplayed;

  basepremium;

  applicationNo;

  productType;

  user;

  isBankCustomer;

  premiumKey;

  isBranchUser = false;

  currentUser;

  errorDataFound = false;

  errorDetail;

  sameInsurerProduct = [];

  otherInsurerProducts = [];

  groupedProductQuote;

  groupedProductArr;

  Object = Object;

  panelOpenState = false;

  isIndexZero = [true, true, true, true];

  showShortDesciption = [true, true, true, true];

  constructor(
    public dialog: MatDialog,
    private quoteService: QuoteService,
    private router: Router,
    private quoteDataRootService: QuoteDataService,
    private cookie: CookieService,
    private accountService: AccountService,
    private loaderService: LoaderService,
  ) {}

  ngOnChanges() {
    // this.accountService.user.subscribe(x => this.user = x);
    // if (this.user['bankCustomer'] == 'false') {
    //   this.isBankCustomer = false;
    // } else if (this.user['bankCustomer'] == 'true') {
    //   this.isBankCustomer = true;
    // }
    this.productQuoteArr = this.finalQuote?.productQuote;

    this.groupedProductQuote = this.productQuoteArr?.reduce((acc, curr) => {
      if (!acc[curr.insurerId]) acc[curr.insurerId] = [];
      acc[curr.insurerId].push(curr);
      return acc;
    }, {});
    if (this.groupedProductQuote) {
      Object.values(this.groupedProductQuote)?.forEach((arr) => {
        console.log(arr, 'arr');
        this.groupedProductArr = arr;
      });
    }

    console.log('result==', Object.values(this.groupedProductQuote), this.groupedProductArr);

    // this.productQuoteArr?.forEach((obj) =>
    //   [this.otherInsurerProducts, this.sameInsurerProduct][
    //     +(
    //       this.productQuoteArr?.map((obj) => obj.insurerId).filter((id) => id === obj.insurerId)
    //         .length > 1
    //     )
    //   ]?.push(obj),
    // );

    console.log('uniqObjs:', this.otherInsurerProducts);
    console.log('dupeObjs:', this.sameInsurerProduct);
    console.log('same product', this.sameInsurerProduct, this.productQuoteArr);
    this.productQuoteArr?.forEach((arr) => {
      arr.premiums.mode = Number(Object.keys(arr.premiums)[0]);
      this.premiumKey = Object.keys(arr.premiums)[0];
    });
    if (this.productQuoteArr != undefined) {
      this.productQuoteArr.sort(this.compareValues('productId', 'desc'));
    }

    this.quoteInput = this.finalQuote?.quoteInput;
    this.hasOffline = this.finalQuote?.hasOffline;
    this.productType = this.quoteInput?.productType;
    // console.log('productttttt tttype and iddddd', this.productType, this.quoteInput.customerId);
    this.totalPremiumDisplayed = this.productQuoteArr?.map((arr) => {
      return arr.premiums[this.premiumKey]?.totalPremium;
    });

    // this.addOnArr = this.productQuoteArr?.map(arr => {
    //   return arr.addonBenefits;
    // })
    this.gst = this.productQuoteArr?.map((arr) => {
      return arr.premiums[this.premiumKey]?.gst;
    });
    this.basepremium = this.productQuoteArr?.map((arr) => {
      return arr.premiums[this.premiumKey]?.basePremium;
    });
  }

  ngOnInit() {
    this.isBranchUser = this.accountService.isBranchUser;
    console.log('is branch user in buy now = ', this.isBranchUser);
    this.accountService.user.subscribe((x) => (this.user = x));
    if (this.user['bankCustomer'] == 'false') {
      this.isBankCustomer = false;
    } else if (this.user['bankCustomer'] == 'true') {
      this.isBankCustomer = true;
    }
  }

  moreDetails(j, i) {
    if (!this.isDialogOpened) {
      console.log('groiped array', this.groupedProductArr, j, i);
      let objToPass;
      if (j === '') {
        objToPass = this.productQuoteArr[i];
      } else {
        objToPass = Object.values(this.groupedProductQuote)[j][i];
      }
      const dialogRef = this.dialog.open(MoreDetailsHealthComponent, {
        data: {
          policyList: objToPass,
          quoteInput: this.quoteInput,
        },
        panelClass: 'more-details-width',
      });
      dialogRef.afterOpened().subscribe(() => {
        this.isDialogOpened = true;
      });
      dialogRef.afterClosed().subscribe((res) => {
        this.isDialogOpened = false;
        // console.log('result', res['isBuyNow'], res);
        if (res !== undefined) {
          this.addOnArr = res.policyList.addonBenefits;
          this.gst = res.gst;
          this.basepremium = res.basePremium;
          this.totalPremium = res.totalPremium;
          this.premiumKey = Object.keys(this.productQuoteArr[i].premiums)[0];
          this.productQuoteArr[i].premiums[this.premiumKey].totalPremium = res.totalPremium;
          this.productQuoteArr[i].premiums[this.premiumKey].gst = res.gst;
          this.productQuoteArr[i].premiums[this.premiumKey].basePremium = res.basePremium;
          if (res['isBuyNow'] === true) {
            this.onBuyNow(j, i);
          }
        } else {
          this.addOnArr = this.productQuoteArr[i]?.addonBenefits;
        }
        console.log('add on aray', this.addOnArr);
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
    this.loaderService.showSpinner(false);
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
        // this.quoteDataRootService.setData(createApplicationData);

        this.router.navigate(['/mycustomers', selectedProduct.productId]);
      }
    });
  }

  onBuyNow(j, index) {
    const addOnArray = [];
    console.log('add on aray in buy now', this.addOnArr);
    if (!this.addOnArr) {
      console.log('if its is null or undegined');
      this.addOnArr = Object.values(this.groupedProductQuote)[j][index]?.addonBenefits;
    }
    this.addOnArr.filter((arr) => {
      const addOn = {};
      this.premiumKey = Object.keys(arr.premium)[0];
      addOn['premium'] = arr.premium[this.premiumKey].premium;
      addOn['netPremium'] = arr.premium[this.premiumKey].netPremium;
      addOn['sa'] = arr.sa;
      addOn['displayName'] = arr.displayName;
      addOn['coverId'] = arr.coverId;
      addOn['selected'] = arr.selected;
      // return addOn;
      addOnArray.push(addOn);
      // console.log('foreach', arr.coverId, addOnArray);
    });

    // console.log('calling buy nw', this.addOnArr, addOnArray);
    this.loaderService.showSpinner(true);
    const selectedProduct = Object.values(this.groupedProductQuote)[j][index];
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
      lob: 'Health',
      productType: this.productType,
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
        addon: addOnArray,
      },
      // addons: this.addOnArr,
      quoteInput: this.finalQuote.quoteInput,
    };
    if (this.quoteInput.customerId === 0 && !this.isBankCustomer) {
      this.selectCustomer(selectedProduct, createApplicationData);
    } else {
      this.callCreateApplication(selectedProduct, createApplicationData, index);
    }
  }

  callCreateApplication(selectedProduct, createApplicationData, index) {
    this.loaderService.showSpinner(true);
    this.quoteService
      .createHealthApplication(selectedProduct.productId, createApplicationData)
      .subscribe(
        (result) => {
          this.loaderService.showSpinner(false);
          const applicationArr = result;
          this.applicationNo = applicationArr['applicationNo'];
          if (this.isBranchUser) {
            if (this.productQuoteArr[index]['askForFormType']) {
              const dialogRef = this.dialog.open(PolicyPromptModalComponent, {
                data: '',
                panelClass: 'dialog-width',
                disableClose: true,
              });
              dialogRef.afterClosed().subscribe((formType) => {
                console.log('data from modal', formType);
                if (formType !== '') {
                  if (formType === 'Long') {
                    this.router.navigate([
                      '/proposal',
                      selectedProduct.productId,
                      this.applicationNo,
                      formType,
                    ]);
                  } else {
                    const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
                      data: 'Your Lead has been forwarded to the Insurer RM',
                      panelClass: 'dialog-width',
                    });
                    dialogRef.afterClosed().subscribe(() => {
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
        },
      );
  }

  routeToOffline() {
    this.router.navigate([
      '/offline-policies/new-application',
      'Health',
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
