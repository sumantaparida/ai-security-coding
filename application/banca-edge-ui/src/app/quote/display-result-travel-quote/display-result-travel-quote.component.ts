import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AccountService } from '@app/_services';
import { QuoteDataService } from '@app/_services/quoteData.service';
import { CookieService } from 'ngx-cookie-service';
import { MoreDetailsHealthComponent } from '../more-details-health/more-details-health.component';
import { QuoteService } from '../quote.service';
import { SelectCustomerModalComponent } from '../select-customer-modal/select-customer-modal.component';
// import { SelectCustomerModalComponent } from '../select-customer-modal/select-customer-modal.component';
import { PolicyPromptModalComponent } from '@app/shared/components/policy-prompt-modal/policy-prompt-modal.component';
import { LoaderService } from '@app/_services/loader.service';

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
  selector: 'app-display-result-travel-quote',
  templateUrl: './display-result-travel-quote.component.html',
  styleUrls: ['./display-result-travel-quote.component.css']
})
export class DisplayResultTravelQuoteComponent implements OnInit, OnChanges {
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
  addOnArr = [];
  addOnArrFinal = [];
  gst;
  totalPremium;
  totalPremiumDisplayed;
  basepremium;
  applicationNo;
  isLoading;
  productType;
  user;
  isBankCustomer;
  isBranchUser = false;
  errorDataFound = false;
  errorDetail;

  constructor(
    public dialog: MatDialog,
    private quoteService: QuoteService,
    private router: Router,
    private quoteDataRootService: QuoteDataService,
    private cookie: CookieService,
    private accountService: AccountService,
    private loaderService: LoaderService

  ) { }

  ngOnChanges() {
    // this.accountService.user.subscribe(x => this.user = x);
    // if (this.user['bankCustomer'] == 'false') {
    //   this.isBankCustomer = false;
    // } else if (this.user['bankCustomer'] == 'true') {
    //   this.isBankCustomer = true;
    // }
    this.productQuoteArr = this.finalQuote?.productQuote;
    if (this.productQuoteArr !== undefined) {
      this.productQuoteArr.sort(this.compareValues('productId', 'desc'));
      // console.log('sortt', this.productQuoteArr.sort(this.compareValues('premiums[0]?.totalpremium', 'desc')));

    }

    this.quoteInput = this.finalQuote?.quoteInput;
    this.hasOffline = this.finalQuote?.hasOffline;
    this.productType = this.quoteInput?.productType;
    // console.log('productttttt tttype and iddddd', this.productType, this.quoteInput.customerId);

    this.totalPremiumDisplayed = this.productQuoteArr?.map(arr => {
      return arr.premiums[0]?.totalpremium;
    });
    // this.gst = this.productQuoteArr?.map(arr =>{
    //   return arr.premiums[0].gst;
    // });
    // this.basepremium = this.productQuoteArr?.map(arr =>{
    //   return arr.premiums[0].basepremium;
    // });


  }
  ngOnInit(): void {
    this.isBranchUser = this.accountService.isBranchUser;
    this.accountService.user.subscribe(x => this.user = x);
    if (this.user['bankCustomer'] === 'false') {
      this.isBankCustomer = false;
    } else if (this.user['bankCustomer'] === 'true') {
      this.isBankCustomer = true;
    }
    console.log('changes', this.isBankCustomer);
  }

  moreDetails(i) {
    console.log('in moredetails', this.isDialogOpened);
    if (!this.isDialogOpened) {
      const dialogRef = this.dialog.open(MoreDetailsHealthComponent, {
        data:
          { policyList: this.productQuoteArr[i], quoteInput: this.quoteInput }, panelClass: 'more-details-width'
      });
      dialogRef.afterOpened().subscribe(result => {
        this.isDialogOpened = true;
        // console.log(`Dialog result: ${result}`);
      });
      dialogRef.afterClosed().subscribe(res => {
        this.isDialogOpened = false;
        console.log('result', res['isBuyNow'], res);
        if (res !== undefined) {

          this.addOnArr = res.policyList.addonBenefits;


          console.log('add on aray', this.addOnArr);
          this.gst = res.gst;
          this.basepremium = res.basePremium;
          this.totalPremium = res.totalPremium;
          this.productQuoteArr[i].premiums[0].totalPremium = res.totalPremium;
          if (res['isBuyNow'] === true) {
            this.onBuyNow(i);
          }
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

      const varA = (typeof a[key] === 'string')
        ? a[key].toUpperCase() : a[key];
      const varB = (typeof b[key] === 'string')
        ? b[key].toUpperCase() : b[key];

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return (
        (order === 'desc') ? (comparison * -1) : comparison
      );
    };
  }

  selectCustomer(selectedProduct, createApplicationData) {
    this.loaderService.showSpinner(false);
    this.quoteDataRootService.setData(createApplicationData);
    // this.cookie.set('appData', JSON.stringify(createApplicationData));
    const dialogRef = this.dialog.open(SelectCustomerModalComponent, {
      // height: '400px',
      width: '45%',
      panelClass: 'dialog-width'
      // data:
      //   {}
    });

    dialogRef.afterOpened().subscribe(result => {
      this.isDialogOpened = true;
      // console.log(`Dialog result: ${result}`);
    });
    dialogRef.afterClosed().subscribe(res => {
      this.isDialogOpened = false;

      // this.router.navigate(['action-selection'], { state: { example: 'bar' } });
      if (res) {
        this.router.navigate(['/mycustomers', selectedProduct.productId]);
      }
    }
    );
  }

  onBuyNow(index) {
    const addOnArray = [];
    console.log('add on aray in buy now', this.addOnArr);

    this.addOnArr.filter(arr => {

      const addOn = {};

      addOn['premium'] = arr.premium[0].premium;
      addOn['netPremium'] = arr.premium[0].netPremium;
      addOn['sa'] = arr.sa;
      addOn['displayName'] = arr.displayName;
      addOn['coverId'] = arr.coverId;
      addOn['selected'] = arr.selected;
      // return addOn;
      addOnArray.push(addOn);
      console.log('foreach', arr.coverId, addOnArray);


    });

    console.log('formType', this.productQuoteArr[index]['askForFormType']);


    console.log('calling buy nw', this.addOnArr, addOnArray);
    this.loaderService.showSpinner(true);
    const selectedProduct = this.productQuoteArr[index];
    if (this.basepremium === undefined || this.gst === undefined || this.totalPremium === undefined) {
      this.basepremium = selectedProduct.premiums[0].basePremium;
      this.gst = selectedProduct.premiums[0].gst;
      this.totalPremium = selectedProduct.premiums[0].totalPremium;
    }
    const createApplicationData = {
      customerId: this.quoteInput.customerId,
      lob: 'Travel',
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
            coverId: "HOSP",
            displayName: "Base Cover",
            sa: 0,
            netPremium: this.basepremium,
            premium: this.totalPremium,
            selected: false
          }
        ],
        addon: addOnArray
      },
      // addons: this.addOnArr,
      quoteInput: this.finalQuote.quoteInput
    };
    // if (this.addOnArr !== undefined) {
    //   createApplicationData['addons'] = this.addOnArr;
    // }
    if (this.quoteInput.customerId === 0 && !this.isBankCustomer) {
      console.log('create ap dtat', createApplicationData);

      this.selectCustomer(selectedProduct, createApplicationData);
    } else {
      this.callCreateApplication(selectedProduct, createApplicationData, index);
    }

  }

  callCreateApplication(selectedProduct, createApplicationData, index) {
    // console.log('create ap dtat', createApplicationData);
    this.loaderService.showSpinner(true);
    this.quoteService.createHealthApplication(selectedProduct.productId, createApplicationData).subscribe(result => {
      this.loaderService.showSpinner(false);
      const applicationArr = result;
      // if (applicationArr['online'] === false) {
      //   this.applicationNo = applicationArr['applicationNo'];
      //   // this.isLoading = false;
      //   this.router.navigate(['/quote/offline-purchase', this.applicationNo]);
      // } else if (applicationArr['online'] === true) {
      this.applicationNo = applicationArr['applicationNo'];
      if (this.isBranchUser) {
        if (this.productQuoteArr[index]['askForFormType']) {
          const dialogRef = this.dialog.open(PolicyPromptModalComponent, {
            data: '',
            panelClass: 'dialog-width',
            disableClose: true
          });
          dialogRef.afterClosed().subscribe(formType => {
            console.log('data from modal', formType);
            this.router.navigate(['/proposal', selectedProduct.productId, this.applicationNo, formType]);
          });
        } else {
          this.router.navigate(['/proposal', selectedProduct.productId, this.applicationNo,
            this.productQuoteArr[index]['defaultFormType']]);
        }
      } else {
        this.router.navigate(['/proposal', selectedProduct.productId, this.applicationNo, 'Long']);
      }
      // }

    }, error => {
      this.errorDataFound = true;
      this.loaderService.showSpinner(false);
      if (error === 'Sorry the server was unable to process your request Internal Server Error'){
        this.errorDetail = error;
      }
      else{
        this.errorDetail = 'Sorry the server was unable to process your request'
      }
    });
  }

  routeToOffline() {
    this.router.navigate(['/offline-policies/new-application', 'Travel', this.quoteInput?.customerId, this.quoteInput?.productType]);

  }
}
