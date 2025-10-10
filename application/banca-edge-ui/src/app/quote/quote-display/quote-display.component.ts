import { Component, Input, OnChanges, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AccountService } from '@app/_services';
import { LoaderService } from '@app/_services/loader.service';
import { QuoteDataService } from '@app/_services/quoteData.service';
import { CookieService } from 'ngx-cookie-service';
import { CkycModalComponent } from '../ckyc-modal/ckyc-modal.component';
import { MoreDetailsHealthComponent } from '../more-details-health/more-details-health.component';
import { QuoteService } from '../quote.service';
import { SelectCustomerModalComponent } from '../select-customer-modal/select-customer-modal.component';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';
// import { SelectCustomerModalComponent } from '../select-customer-modal/select-customer-modal.component';

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
  selector: 'app-quote-display',
  templateUrl: './quote-display.component.html',
  styleUrls: ['./quote-display.component.css'],
})
export class QuoteDisplayComponent implements OnInit, OnChanges {
  @ViewChild('noQuoteGenerated') MyProp: ElementRef;

  isDialogOpened = false;

  @Input() finalQuote;

  productQuoteArr;

  quoteInput;

  addOnArr;

  gst;

  totalPremium;

  totalPremiumDisplayed;

  basepremium;

  applicationNo;

  isLoading;

  productType;

  formType;

  user;

  isBankCustomer;

  isFire = false;

  errorDataFound = false;

  errorDetail;

  ckycReqInsurers = [132,158];

  ckycReqBank = ['BOM','CSB']

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
    if (this.finalQuote?.quoteInput['lob'] === 'Fire') {
      console.log(this.finalQuote?.quoteInput['lob'], 'proinitng lob');
      this.isFire = true;
    }
    if (this.productQuoteArr != undefined) {
      this.productQuoteArr.sort(this.compareValues('productId', 'desc'));
      // console.log('sortt', this.productQuoteArr.sort(this.compareValues('premiums[0]?.totalpremium', 'desc')));
    }

    this.quoteInput = this.finalQuote?.quoteInput;
    this.productType = this.quoteInput?.productType;
    // console.log('productttttt tttype and iddddd', this.productType, this.quoteInput.customerId);

    this.totalPremiumDisplayed = this.productQuoteArr?.map((arr) => {
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
    this.accountService.user.subscribe((x) => (this.user = x));
    if (this.user['bankCustomer'] == 'false') {
      this.isBankCustomer = false;
    } else if (this.user['bankCustomer'] == 'true') {
      this.isBankCustomer = true;
    }
    console.log('changes', this.isBankCustomer);
  }

  moreDetails(i) {
    console.log('in moredetails', this.isDialogOpened);
    if (!this.isDialogOpened) {
      const dialogRef = this.dialog.open(MoreDetailsHealthComponent, {
        data: { policyList: this.productQuoteArr[i], quoteInput: this.quoteInput },
        panelClass: 'more-details-width',
      });
      dialogRef.afterOpened().subscribe((result) => {
        this.isDialogOpened = true;
        // console.log(`Dialog result: ${result}`);
      });
      dialogRef.afterClosed().subscribe((res) => {
        this.isDialogOpened = false;
        console.log('result', res['isBuyNow'], res);
        if (res !== undefined) {
          this.addOnArr = res.addOnArr;
          this.gst = res.gst;
          this.basepremium = res.basePremium;
          this.totalPremium = res.totalPremium;
          this.productQuoteArr[i].premiums[0].totalPremium = res.totalPremium;
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

    dialogRef.afterOpened().subscribe((result) => {
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
    // console.log('calling buy nw');
    // this.isLoading = true;
    const selectedProduct = this.productQuoteArr[index];
    this.formType = selectedProduct.defaultFormType;
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
      lob: this.quoteInput['lob'],
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
      console.log('selecyted product=', selectedProduct.insurerId,selectedProduct.insurerId,this.user);
      if (this.ckycReqBank.some(bank=>bank===this.user['organizationCode']) && this.ckycReqInsurers.some(insurerCode => insurerCode === selectedProduct.insurerId)) {
        this.ckycCheck(this.quoteInput.customerId, createApplicationData, selectedProduct);
      } else {
        this.callCreateApplication(selectedProduct, createApplicationData);
      }
    }
  }

  ckycCheck(customerId, createApplicationData, selectedProduct) {
    this.quoteService.getCustomerById(customerId).subscribe((customer) => {
      console.log('customer =', customer);
      if (customer['ckycNumber'] !== '' || customer['ckycRefNo'] !== '') {
        createApplicationData['ckycNumber'] = customer['ckycNumber'];
        createApplicationData['ckycRefNo'] = customer['ckycRefNo'];
        this.callCreateApplication(selectedProduct, createApplicationData);
      } else {
        this.handleCkyc(customer, createApplicationData, selectedProduct);
      }
    });
  }

  handleCkyc(customer, createApplicationData, selectedProduct) {
    let dialogRef = this.dialog.open(CkycModalComponent, {
      data: {
        dob: customer.dob,
        fullName: customer.firstName + customer.lastName,
        gender: customer.gender,
        customerId: customer.customerId,
        insurerId:selectedProduct.insurerId,
        bankOrgCode: this.user['organizationCode']
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      console.log('res==', res);
      if(res['status']==='Failed'){
       const message = `Please complete your KYC using the following link:`
        const dialogRef =  this.dialog.open(PolicyErrorModalComponent, {
          data: {message,link:res['url']},
          panelClass: 'dialog-width',
        });
      } else {
        createApplicationData['ckycNumber'] = res['ckycNumber'];
        createApplicationData['policyOptions']={
          CkycDocId:res['docId'],
          DigitCkycNumber:res['ckycNumber']
          }
        this.callCreateApplication(selectedProduct, createApplicationData);
      }
    
    });
  }

  callCreateApplication(selectedProduct, createApplicationData) {
    this.loaderService.showSpinner(true);
    this.quoteService
      .createHealthApplication(selectedProduct.productId, createApplicationData)
      .subscribe(
        (result) => {
          this.loaderService.showSpinner(false);
          const applicationArr = result;
          if (applicationArr['online'] === false) {
            this.applicationNo = applicationArr['applicationNo'];
            // this.isLoading = false;
            this.router.navigate(['/quote/offline-purchase', this.applicationNo]);
          } else if (applicationArr['online'] === true) {
            this.applicationNo = applicationArr['applicationNo'];
            // this.isLoading = false;
            this.router.navigate([
              '/proposal',
              selectedProduct.productId,
              this.applicationNo,
              this.formType,
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
}
