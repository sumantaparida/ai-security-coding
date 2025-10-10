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
import { CkycModalComponent } from '../ckyc-modal/ckyc-modal.component';
import { MoreDetailsHealthComponent } from '../more-details-health/more-details-health.component';
import { QuoteService } from '../quote.service';
import { SelectCustomerModalComponent } from '../select-customer-modal/select-customer-modal.component';
import { MintoproCkycModalComponent } from '../mintopro-ckyc-modal/mintopro-ckyc-modal.component';
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
  selector: 'app-display-result-quote',
  templateUrl: './display-result-quote.component.html',
  styleUrls: ['./display-result-quote.component.css'],
})
export class DisplayResultQuoteComponent implements OnInit, OnChanges {
  isDialogOpened = false;

  @Input() finalQuote;

  productQuoteArr;

  quoteInput;

  hasOffline;

  selectedProduct;

  addOnArray = [];

  addOn = {};


  ckycRequired=[{insurer:132,bank:"BOM"}]

  mintoProCkyc=[{insurer:151,bank:"SIB"},{insurer:103,bank:"CSB"}]
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
  ) { }

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
    if (!this.addOnArr && j != '') {
      console.log('if its is null or undegined');
      this.addOnArr = Object.values(this.groupedProductQuote)[j][index]?.addonBenefits;
    } else if (!this.addOnArr && j == '') {
      this.addOnArr = this.productQuoteArr[index]?.addonBenefits;
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
    if (j !== '') {
      this.selectedProduct = Object.values(this.groupedProductQuote)[j][index];
    } else if (j === '') {
      this.selectedProduct = this.productQuoteArr[index];
    }

    this.premiumKey = Object.keys(this.selectedProduct.premiums)[0];
    if (
      this.basepremium === undefined ||
      this.gst === undefined ||
      this.totalPremium === undefined
    ) {
      this.basepremium = this.selectedProduct.premiums[this.premiumKey].basePremium;
      this.gst = this.selectedProduct.premiums[this.premiumKey].gst;
      this.totalPremium = this.selectedProduct.premiums[this.premiumKey].totalPremium;
    }
    const createApplicationData = {
      customerId: this.quoteInput.customerId,
      lob: 'Health',
      productType: this.productType,
      productId: this.selectedProduct.productId,
      planId: this.selectedProduct.planId,
      productName: this.selectedProduct.productName,
      insurerId: this.selectedProduct.insurerId,
      insurerName: this.selectedProduct.insurerName,
      pt: this.selectedProduct.pt,
      ppt: this.selectedProduct.ppt,
      selectedMode: this.selectedProduct.selectedMode,
      sa: this.selectedProduct.sa,
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
      quoteId: this.finalQuote.quoteInput.quoteId,
    };
    if (this.quoteInput.customerId === 0 && !this.isBankCustomer) {
      this.selectCustomer(this.selectedProduct, createApplicationData);
    } else {
      // this.callCreateApplication(this.selectedProduct, createApplicationData, index);
      console.log('hihih',this.selectedProduct.insurerId,this.user['organizationCode'])

      if(this.ckycRequired.findIndex(val=>this.selectedProduct.insurerId === val.insurer && this.user['organizationCode'] === val.bank)>-1){
        console.log('hi2')
        this.ckycCheck(
          this.quoteInput.customerId,
          createApplicationData,
          this.selectedProduct,
          index,
          'ckyc',
        );
      }
      else if (this.mintoProCkyc.findIndex(val=>this.selectedProduct.insurerId === val.insurer && this.user['organizationCode'] === val.bank)>-1) {
      console.log('hihih',this.selectedProduct.insurerId,this.user['organizationCode'])

        this.ckycCheck(
          this.quoteInput.customerId,
          createApplicationData,
          this.selectedProduct,
          index,
          'mintProKyc',
        );
      } else {

        // this.callCreateApplication(this.selectedProduct, createApplicationData, index);
      }
    }
  }

  ckycCheck(customerId, createApplicationData, selectedProduct, index,type) {
    this.quoteService.getCustomerById(customerId).subscribe((customer) => {
      this.loaderService.showSpinner(false);
      console.log('customer =', customer);
      if (customer['ckycNumber'] !== '' || customer['ckycRefNo'] !== '') {
        createApplicationData['ckycNumber'] = customer['ckycNumber'];
        createApplicationData['ckycRefNo'] = customer['ckycRefNo'];
        this.callCreateApplication(selectedProduct, createApplicationData, index);
      } else {
        if(type==='ckyc'){
          this.handleCkyc(customer, createApplicationData, selectedProduct, index);
        } else if(type==='mintProKyc') {
          this.handleMintProCkyc(customer, createApplicationData, selectedProduct, index);
        }
      }
    });
  }

  handleMintProCkyc(customer, createApplicationData, selectedProduct, index) {
    const dialogRef = this.dialog.open(MintoproCkycModalComponent, {
      data:{
        quoteId: this.quoteInput.quoteId,
        dob: customer.dob,
        fullName: customer.firstName + customer.lastName,
        gender: customer.gender,
        customerId: customer.customerId,
        insurerId: selectedProduct.insurerId,
        coverType:this.quoteInput.productType,
        pinCode:this.quoteInput.pincode,
        bankOrgCode: this.user['organizationCode']
      },
    });
    dialogRef.afterClosed().subscribe(res=>{
      if (res['returnCode'] === 0){
        createApplicationData['ckycNumber'] = res['ckycNumber'];
        createApplicationData['panNumber'] = res['panNo']
        this.callCreateApplication(selectedProduct, createApplicationData, index);
      }
    })
  }

  handleCkyc(customer, createApplicationData, selectedProduct, index) {
    let dialogRef = this.dialog.open(CkycModalComponent, {
      data: {
        quoteId: this.quoteInput.quoteId,
        dob: customer.dob,
        fullName: customer.firstName + customer.lastName,
        gender: customer.gender,
        customerId: customer.customerId,
        insurerId: selectedProduct.insurerId,
        coverType:this.quoteInput.productType,
        pinCode:this.quoteInput.pincode,
        bankOrgCode: this.user['organizationCode']
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      console.log('res==', res);
      createApplicationData['ckycNumber'] = res['ckycNumber'];
      this.callCreateApplication(selectedProduct, createApplicationData, index);
    });
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
