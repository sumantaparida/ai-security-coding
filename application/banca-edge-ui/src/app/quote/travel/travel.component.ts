import { Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { HealthAddInsurerComponent } from '../health-add-insurer/health-add-insurer.component';
import { QuoteService } from '../quote.service';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MY_FORMATS } from '@app/shared/utils/moment';
import { LoaderService } from '@app/_services/loader.service';


export interface DialogData {
  name: string;
}

@Component({
  selector: 'app-travel',
  templateUrl: './travel.component.html',
  styleUrls: ['./travel.component.css'],

  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})


export class TravelComponent implements OnInit {

  @ViewChild('noQuoteGenerated') MyProp: ElementRef;

  searchCtrl;
  searchCtrlCountries;
  today = new Date();
  isLoading = false;
  isShownPolicyDescription = false;
  isShownPolicyType = false;
  isShownPincode = false;
  isShownPolicyCover = false;
  isShownDeductible = false;
  isShownPolicyFor = false;
  isShownExistingCover = false;
  isShownDob = false;
  isShownPrimaryMember = false;
  helpTextWord = false;
  needHideHealthDetails = 'Need help?';
  needHidePolicyFor = 'Need help?'; // 3
  needHidePolicyType = 'Need help?';  // 1
  needHidePolicyCover = 'Need help?'; // 2
  needHidePolicyExistingCover = 'Need help?'; // 2a
  needHidePrimaryMember = 'Need help?';
  enhanceExistingCover = false;
  needHideDob = 'Need help?';
  needHidePincode = 'Need help?';
  needHideDeductible = 'Need help?';
  isDialogOpened = false;
  isErrorMsg = false;
  existingCoverAmount = [
    { value: '100000', viewValue: '100000' },
    { value: '200000', viewValue: '200000' },
    { value: '300000', viewValue: '300000' },
    { value: '400000', viewValue: '400000' },
    { value: '500000', viewValue: '500000' }
  ];
  tenureYearList = [
    { value: '1', viewValue: '1' },
    { value: '2', viewValue: '2' },
    { value: '3', viewValue: '3' }
  ];
  policyCoverOption = [
    { value: 1, viewValue: 'Buy a New Policy with Hospitalization Cover' },
    // { value: 2, viewValue: 'Buy a Corona Kavach Policy' },
    { value: 3, viewValue: 'Enhance Existing Cover' }
  ];
  optionCover;
  primaryMemberList;
  secondaryMemberList;
  productType = 'INDV';
  policyType;
  healthHospForm: FormGroup;
  sumAssuredAmount;
  displaySmoking;
  addedMemberArr = [];
  membersArr = [];
  quoteId;
  leadId;
  existingQuoteId;
  customerId;
  defaultPrimaryMember;
  isNoPolicyError = false;
  isSatisfyAllCondition = false;
  isFamilyFLoaterError = false;
  isAgeErro = false;
  // isLoading = false;
  pattern1 = '^[0-9]{6,6}$';
  finalQuote;
  quoteInput;
  isLoadingQuoteValue;
  selfPrimaryGender;
  selfPrimaryDob;
  memberArray = [];
  removeRelation = [];
  removedData;
  durationLabel;
  policyKind;
  durationElement = false;
  countriesList;
  countryCodes;
  customerDetails;
  numQuoteExpected;
  customerDetailsCopy;
  errorDetail;
  constructor(
    public dialog: MatDialog,
    private quoteService: QuoteService,
    private router: Router,
    public myElement: ElementRef,
    private loaderService: LoaderService,
    private route: ActivatedRoute) { }

  arrayThree(n: number, startFrom: number): number[] {
    return [...Array(n).keys()].map(i => i + startFrom);
  }


  ngOnInit(): void {

    this.route.params.subscribe(params => {
      this.customerId = params.customerId;
      this.leadId = params.leadId;
    });

    this.healthHospForm = new FormGroup({
      // policyType: new FormControl('', Validators.required),
      productType: new FormControl('', Validators.required),
      travelStartDate: new FormControl('', Validators.required),
      travelEndDate: new FormControl('', Validators.required),
      dob: new FormControl('', Validators.required),
      primaryMember: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      // smoker: new FormControl('', Validators.required),
      // pincode: new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern(this.pattern1)]),
      // tenure: new FormControl('', Validators.required),
      sumAssured: new FormControl('', Validators.required),
      countries: new FormControl('', Validators.required),
      duration: new FormControl(''),
      searchCtrl: new FormControl(''),
      searchCtrlCountries: new FormControl('')
    });

    this.route.params.subscribe(params => {
      if (params.customerId) {
        this.customerId = params.customerId;
        this.quoteService.getCustomerById(this.customerId).subscribe(customerData => {
          this.customerDetailsCopy = JSON.parse(JSON.stringify(customerData));
          this.customerDetails = customerData;
          // if (this.customerDetails?.addressList?.length > 0) {
          //   this.customerDetails.addressList.map(address => {
          //     if (address.addressType === 'PERMANENT' || address.addressType === 'CORRESPONDENCE' || address.addressType === 'OFFICE') {
          //       this.healthHospForm.get('pincode').setValue(address.postalcode);
          //     }
          //   });
          // }
          this.selfPrimaryDob = customerData['dob'];
          this.selfPrimaryGender = customerData['gender'];
          this.healthHospForm.get('dob').setValue(this.selfPrimaryDob);
          this.healthHospForm.get('gender').setValue(this.selfPrimaryGender);
        });
      }
    });

    this.getTravelCountries();

    this.route.params.subscribe(params => {
      if (params.quoteId) {
        // this.isLoadingQuoteValue = true;
        this.loaderService.showSpinner(true);
        this.existingQuoteId = params.quoteId;
        // this.isLoading = true;
        this.callQuoteApi();
      } else if (!params.quoteId) {

      }
    });
  }

  callQuoteApi() {
    this.quoteService.backToQuote(this.existingQuoteId).subscribe(finalQuoteRes => {
      this.finalQuote = finalQuoteRes;
      this.quoteInput = this.finalQuote?.quoteInput;
      this.setFormValue(); // if route is from quote page
    });
  }

  setFormValue() {
    this.customerId = this.quoteInput?.customerId;
    if (this.customerId !== 0) {
      this.quoteService.getCustomerById(this.customerId).subscribe(customerData => {
        this.customerDetailsCopy = JSON.parse(JSON.stringify(customerData));
        this.customerDetails = customerData;
        if (this.customerDetailsCopy?.dependentList) {
          this.customerDetails.dependentList = this.customerDetails?.dependentList.filter(item1 =>
            !this.quoteInput?.members.some(item2 => (item2.dob === item1.dob)));
        }
      });


    }
    this.healthHospForm.get('productType').setValue(this.quoteInput?.productType);
    if (this.quoteInput?.productType === 'LTS') {
      this.selectPolicyKind(1);
    } else if (this.quoteInput?.productType === 'AMT') {
      // this.healthHospForm.get('duration').setValue
      this.selectPolicyKind(2);
    } else {
      this.selectPolicyKind(3);
    }
    this.policyType = this.quoteInput?.productType;
    this.countryCodes = this.quoteInput?.countryCodes.map(i => Number(i));
    this.healthHospForm.get('countries').setValue(this.countryCodes);

    this.healthHospForm.get('travelStartDate').setValue(this.quoteInput?.travelStartDate);
    this.healthHospForm.get('travelEndDate').setValue(this.quoteInput?.travelEndDate);

    // const enteredQuoteInput = this.quoteService.getQuoteInput();
    // if (this.quoteInput?.familyType === 'INDV') {
    //   this.healthHospForm.get('policyType').setValue('1');
    //   this.productType = 'INDV';
    //   // this.selectPolicyType('1');
    // } else if (this.quoteInput?.familyType === 'FF') {
    //   this.healthHospForm.get('policyType').setValue('2');
    //   this.productType = 'FF';
    //   // this.selectPolicyType('2');
    // }
    // arr
    // const primaryElement = this.quoteInput.members.pop();
    this.healthHospForm.get('dob').setValue(this.quoteInput.members[0].dob);
    this.healthHospForm.get('gender').setValue(this.quoteInput.members[0].gender);
    // this.healthHospForm.get('smoker').setValue(this.quoteInput.members[0].rating);
    this.addedMemberArr = this.quoteInput.members.slice(1);
    this.membersArr = this.quoteInput.members.slice(1);
    // this.membersArr.some(arr => {
    //   if (arr.rating === 'S') {
    //     arr['smoking'] = 'Smoker';
    //   } else {
    //     arr['smoking'] = 'Non-Smoker';
    //   }
    // });
    this.membersArr.some(arr => {
      arr['relation'] = this.checkRelationship(arr.relationshipId);
    });
    // this.healthHospForm.get('pincode').setValue(this.quoteInput?.pincode);
    // tenure

    // this.isLoadingQuoteValue = false;
    this.loaderService.showSpinner(false);
  }

  getTravelCountries() {
    this.quoteService.getTravelCountries().subscribe(countries => {
      this.countriesList = countries;
    });
  }

  filterSearch() {
    const val = this.healthHospForm.get('searchFilt').value;
    const arrVal = this.primaryMemberList.map(arr => {
      if (arr.value === val) {
        return arr.value;
      }
    });
  }

  inputEvent(date) {
    const moment = require('moment');
    const newDate = new Date(date.value);
    this.healthHospForm.get('dob').setValue(moment(newDate).format('YYYY-MM-DD'));
    this.ageCheck();
  }

  inputEvent2(date, name) {
    console.log(date);
    const moment = require('moment');
    const newDate = new Date(date.value);
    if (name === 'travelStartDate') {
      this.endDate(date.value);
    }
    this.healthHospForm.get(name).setValue(moment(newDate).format('YYYY-MM-DD'));
  }

  startDate(): Date {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDate();
    return new Date(currentYear, currentMonth, currentDay + 1);
  }

  endDate(date) {
    const moment = require('moment');
    if (this.policyKind === 2) {
      const numberOfDaysToAdd = 364;
      const endDate = moment(date).add(numberOfDaysToAdd, 'days').toDate();
      this.healthHospForm.get('travelEndDate').setValue(moment(endDate).format('YYYY-MM-DD'));
    } else {
      this.healthHospForm.get('travelEndDate').enable();
      this.healthHospForm.get('travelEndDate').setValue(null);
    }
  }

  showDatesForEndDate(): Date {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDate();
    if (this.policyKind !== 2) {
      const check = new Date(this.healthHospForm.get('travelStartDate').value);
      const currentYear2 = check.getFullYear();
      const currentMonth2 = check.getMonth();
      const currentDay2 = check.getDate();
      return new Date(currentYear2, currentMonth2, currentDay2 + 1);
    }

    return new Date(currentYear, currentMonth, currentDay + 1);
  }

  maxDate() {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDate();
    const check = new Date(this.healthHospForm.get('travelStartDate').value);
    const numberOfDaysToAdd = 180;
    if (this.policyKind === 1) {
      check.setDate(check.getDate() + numberOfDaysToAdd);
      return new Date(check.getFullYear(), check.getMonth(), check.getDate());
    } else if (this.policyKind === 3) {
      return new Date(check.getFullYear() + 3, check.getMonth(), check.getDate());
    }

    return new Date(currentYear, currentMonth, currentDay + 1);
  }


  ageCheck() {
    const timeDiff = Math.abs(Date.now() - new Date(this.healthHospForm.get('dob').value).getTime());
    const age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
    const id = this.healthHospForm.get('primaryMember').value;
    if (id === 1 || id === 2 || id === 3 || id === 6 || id === 7 || id === 8 || id === 10 || id === 11 || id === 13 ||
      id === 14 || id === 15) {
      if (age < 18) {
        this.healthHospForm.get('dob').markAsPending();
        this.isAgeErro = true;

      } else {
        this.isAgeErro = false;
      }

    } else {
      this.isAgeErro = false;
    }
  }

  selectPolicyKind(event) {
    // console.log('check value -> ', this.healthHospForm.get('productType').value);
    if (event === 2) {
      this.durationElement = true;
      this.durationLabel = 'Maximum Days of travel in a year';
      this.policyKind = 2;
      this.setTravelDateNull();
    } else {
      this.durationElement = false;
      this.policyKind = event;
      this.durationLabel = '';
      this.setTravelDateNull();
    }
    this.selectPolicyType(event);
  }

  setTravelDateNull() {
    this.healthHospForm.get('travelStartDate').setValue(null);
    this.healthHospForm.get('travelEndDate').setValue(null);
    this.healthHospForm.get('travelEndDate').disable();
  }

  selectPolicyType(event) {
    if (event === 1) {
      this.policyType = 'LTS';
    } else if (event === 2) {
      this.policyType = 'AMT';
    } else if (event === 3) {
      this.policyType = 'STDN';
    }

    // if (event === 1) {
    // console.log('check value 2 -> ', this.policyType);
    this.quoteService.getInsuredRelationship('Travel', this.policyType).subscribe(relationshipList => {
      // this.productType = 'INDV';
      this.quoteService.getEnhanceCoverAmount('Travel', this.policyType).subscribe(assuredSum => {
        this.sumAssuredAmount = assuredSum;
        if (this.existingQuoteId) {
          // console.log('sadasdhi');
          this.sumAssuredAmount.filter(sumAssured => {
            if (sumAssured.id === this.quoteInput.sa.toString()) {
              // console.log('hi');
              this.healthHospForm.get('sumAssured').setValue(sumAssured.id);
            }
          });
        }
      }, error => {
        // this.isLoading = false;
        this.loaderService.showSpinner(false);
        this.isErrorMsg = true;
        if (error === 'Sorry the server was unable to process your request Internal Server Error'){
          this.errorDetail = error;
        } else{
          this.errorDetail = 'Sorry! Error loading application. Please try after sometime.';
        }
        this.MyProp.nativeElement.scrollIntoView({ behavior: 'smooth' });
      });
      this.primaryMemberList = relationshipList;
      this.secondaryMemberList = this.primaryMemberList;
      this.healthHospForm.get('primaryMember').setValue(this.primaryMemberList[0].id);

    }, error => {
      // this.isLoading = false;
      this.loaderService.showSpinner(false);
      
      this.isErrorMsg = true;
      this.errorDetail = 'Sorry! Error loading application. Please try after sometime.';

    });

  }

  setPolicyType(event) {
    if (event === 1) {
      this.productType = 'INDV';
    } else {
      this.productType = 'FF';
    }
  }

  toggleShow(event) {
    if (event === 'policyDescription') {
      this.isShownPolicyDescription = !this.isShownPolicyDescription;
      if (this.isShownPolicyDescription) {
        this.needHideHealthDetails = 'Hide help';
      } else {
        this.needHideHealthDetails = 'Need help?';
      }
      // 1
    } else if (event === 'policyType') {
      this.isShownPolicyType = !this.isShownPolicyType;
      if (this.isShownPolicyType) {
        this.needHidePolicyType = 'Hide help';
      } else {
        this.needHidePolicyType = 'Need help?';
      }
      // 2
    } else if (event === 'policyCover') {
      this.isShownPolicyCover = !this.isShownPolicyCover;
      if (this.isShownPolicyCover) {
        this.needHidePolicyCover = 'Hide help';
      } else {
        this.needHidePolicyCover = 'Need help?';
      }
      // 2a
    } else if (event === 'existingCover') {
      this.isShownExistingCover = !this.isShownExistingCover;
      if (this.isShownExistingCover) {
        this.needHidePolicyExistingCover = 'Hide help';
      } else {
        this.needHidePolicyExistingCover = 'Need help?';
      }
      // 3
    } else if (event === 'primaryMember') {
      this.isShownPrimaryMember = !this.isShownPrimaryMember;
      if (this.isShownPrimaryMember) {
        this.needHidePrimaryMember = 'Hide help';
      } else {
        this.needHidePrimaryMember = 'Need help?';
      }
    } else if (event === 'pincode') {
      this.isShownPincode = !this.isShownPincode;
      if (this.isShownPincode) {
        this.needHidePincode = 'Hide help';
      } else {
        this.needHidePincode = 'Need help?';
      }
    }
  }

  enhanceExisting(event) {
    if (this.healthHospForm.get('policyKind').value === 3) {
      this.enhanceExistingCover = true;
      this.healthHospForm.addControl('deductible', new FormControl('', Validators.required));
    } else {
      this.enhanceExistingCover = false;
      this.healthHospForm.removeControl('deductible');

    }
  }

  onPrimaryMemberChange() {
    if (this.productType === 'FF') {
      const selectionValue = this.healthHospForm.get('primaryMember').value;
      if (selectionValue === '1') {
        this.secondaryMemberList = this.primaryMemberList.filter(member => {
          if (member.id === '2' || member.id === '3' || member.id === '4' || member.id === '5') {
            return member;
          }
        });
      } else if (selectionValue === '2') {
        this.secondaryMemberList = this.primaryMemberList.filter(member => member.id === '3');
      } else if (selectionValue === '3') {
        this.secondaryMemberList = this.primaryMemberList.filter(member => member.id === '2');
      } else if (selectionValue === '7') {
        this.secondaryMemberList = this.primaryMemberList.filter(member => member.id === '14');
      } else if (selectionValue === '14') {
        this.secondaryMemberList = this.primaryMemberList.filter(member => member.id === '7');
      } else if (selectionValue === '8') {
        this.secondaryMemberList = this.primaryMemberList.filter(member => member.id === '13');
      } else if (selectionValue === '13') {
        this.secondaryMemberList = this.primaryMemberList.filter(member => member.id === '8');
      } else if (selectionValue === '11') {
        this.secondaryMemberList = this.primaryMemberList.filter(member => member.id === '10');
      } else if (selectionValue === '10') {
        this.secondaryMemberList = this.primaryMemberList.filter(member => member.id === '11');
      }
    }
  }

  addInsurer() {
    if (!this.isDialogOpened) {
      const dialogRef = this.dialog.open(HealthAddInsurerComponent,
        {
          data: {
            name: this.productType, primaryMemberList: this.secondaryMemberList,
            removedMemberList: this.removedData, customerDetails: this.customerDetails, customerId: this.customerId
          }, panelClass: 'dialog-width'
        });
      dialogRef.afterOpened().subscribe(result => {
        this.isDialogOpened = true;
      });
      dialogRef.afterClosed().subscribe(res => {
        this.isDialogOpened = false;
        if (res === undefined) {
          this.isDialogOpened = false;
        } else if (res !== undefined) {
          this.addedMemberArr.push(res);
          this.membersArr.push(res);
          if (this.customerDetails?.dependentList) {
            this.customerDetails.dependentList = this.customerDetails?.dependentList.filter(arr => {
              if (arr.id !== res.id) {
                return arr;
              }
            });
          }
          // this.membersArr = this.addedMemberArr;
          this.route.params.subscribe(params => {
            if (params.customerId) {
              this.customerId = params.customerId;
              this.membersArr.forEach((arr, index) => {
                this.secondaryMemberList.forEach((addArray) => {
                  if (this.membersArr[index].relationshipId === '4' || this.membersArr[index].relationshipId === '5' ||
                    this.membersArr[index].relationshipId === '6' || this.membersArr[index].relationshipId === '15') {

                  } else if (addArray.id === this.membersArr[index].relationshipId) {
                    this.removeRelation.push(addArray);
                    // return this.removeRelation;
                  }
                });
                if (this.membersArr[index].relationshipId === '4' || this.membersArr[index].relationshipId === '5' ||
                  this.membersArr[index].relationshipId === '6' || this.membersArr[index].relationshipId === '15') {

                } else {
                  this.secondaryMemberList = this.secondaryMemberList.filter(({ id }) => id !== this.membersArr[index].relationshipId);
                }
                // this.secondaryMemberList = this.secondaryMemberList.filter(({ id }) => id !== this.membersArr[index].relationshipId);
              });
            }
          });
          // this.membersArr.map(arr => {
          //   if (arr.rating === 'S') {
          //     arr['smoking'] = 'Smoker';
          //   } else if (arr.rating === 'NS') {
          //     arr['smoking'] = 'Non-Smoker';
          //   }
          // });
          this.checkCondition();
        }

      });
    }
  }
  removeInsurer(i, memberRelationshipId, memberId, memberDOB) {
    if (this.customerDetailsCopy?.dependentList) {
      this.customerDetailsCopy?.dependentList.forEach(cusData => {
        if (memberId === cusData.id || memberDOB === cusData.dob) {
          this.customerDetails.dependentList.push(cusData);
        }
      });
    }
    this.removeRelation.forEach((relation) => {
      if (relation.id === memberRelationshipId) {
        this.memberArray.push(relation);
        this.removedData = [].concat.apply([], this.memberArray);
      }
    });
    // console.log('remove rel', this.removeRelation);
    // this.memberArray.push(this.removeRelation.splice(i, 1));
    // this.removedData = [].concat.apply([], this.memberArray);
    this.addedMemberArr.splice(i, 1);
    this.membersArr.splice(i, 1);
    this.checkCondition();
  }

  checkCondition() {
    if (this.productType === 'FF') {
      if (this.addedMemberArr.length < 1) {
        this.isFamilyFLoaterError = true;
        // this.isLoading = false;
        this.isSatisfyAllCondition = false;
      } else {

        this.isFamilyFLoaterError = false;
        this.isSatisfyAllCondition = true;
      }
    } else if (this.productType === 'INDV') {
      this.isSatisfyAllCondition = true;
    }
  }

  checkRelationship(relationId) {

    if (relationId === 1) {
      return 'Self-Primary Member';
    } else if (relationId === 2) {
      return 'Wife';
    } else if (relationId === 3) {
      return 'Husband';
    } else if (relationId === 4) {
      return 'Daughter';
    } else if (relationId === 5) {
      return 'Son';
    } else if (relationId === 6) {
      return 'Sister';
    } else if (relationId === 7) {
      return 'Mother';
    } else if (relationId === 8) {
      return 'Mother in Law';
    } else if (relationId === 9) {
      return 'Grand Son';
    } else if (relationId === 10) {
      return 'Grand Mother';
    } else if (relationId === 11) {
      return 'Grand Father';
    } else if (relationId === 12) {
      return 'Grand Daughter';
    } else if (relationId === 13) {
      return 'Father in Law';
    } else if (relationId === 14) {
      return 'Father';
    } else if (relationId === 15) {
      return 'Brother';
    }
  }

  generateQuote() {
    this.checkCondition();
    // console.log(this.isSatisfyAllCondition);
    const quoteData = {
      lob: 'Travel',
      leadId: this.leadId,
      productType: this.healthHospForm.get('productType').value,
      familyType: this.productType,
      sa: this.healthHospForm.get('sumAssured').value,
      // pincode: this.healthHospForm.get('pincode').value,
      countryCodes: this.healthHospForm.get('countries').value,
      travelStartDate: this.healthHospForm.get('travelStartDate').value,
      travelEndDate: this.healthHospForm.get('travelEndDate').value
    };
    if (this.productType === 'FF') {
      quoteData['members'] = this.addedMemberArr;
    } else if (this.productType === 'INDV') {
      this.addedMemberArr.map(eachArr => {
        eachArr['sa'] = this.healthHospForm.get('sumAssured').value;
      });
      quoteData['members'] = this.addedMemberArr;
    }
    // if (this.customerId === undefined) {
    //   quoteData['customerId'] = 0;
    // } else {
    //   quoteData['customerId'] = this.customerId;
    // }
    if (this.quoteInput) {
      quoteData['customerId'] = this.quoteInput.customerId;
    } else if (this.customerId) {
      quoteData['customerId'] = this.customerId;
    } else {
      quoteData['customerId'] = 0;
    }


    if (this.isSatisfyAllCondition) {
      this.loaderService.showSpinner(true);
      const primaryMemberDetails = {
        dob: this.healthHospForm.get('dob').value,
        // rating: this.healthHospForm.get('smoker').value,
        gender: this.healthHospForm.get('gender').value,
        relationshipId: this.healthHospForm.get('primaryMember').value,
        // relation:'';
      };
      this.addedMemberArr.push(primaryMemberDetails);

      this.quoteService.postSubmitTravelQuote(quoteData).subscribe(result => {
        const quote = result;
        this.quoteId = quote['quoteId'];
        this.loaderService.showSpinner(false);
        if (quote['numQuotesExpected'] > 0) {
          this.numQuoteExpected = quote['numQuotesExpected'];
          // this.router.navigate(['quote/quote-travel'], { queryParams: { quoteId: this.quoteId } });
          this.router.navigate(['/quote/quote-travel', this.quoteId]);
          // this.quoteService.getHealthQuote(quote['quoteId']).subscribe(finalQuote => {
          // });
        }
        else if (quote['numQuotesExpected'] === 0) {
          this.addedMemberArr.pop();
          this.isNoPolicyError = true;
          this.MyProp.nativeElement.scrollIntoView({ behavior: 'smooth' });

        }
      }, error => {
        this.loaderService.showSpinner(false);
        this.isErrorMsg = true;
        this.errorDetail = 'Sorry! Error loading application. Please try after sometime.';
        this.MyProp.nativeElement.scrollIntoView({ behavior: 'smooth' });
      });
    }

  }

  disableGenerateBtn() {
    if (this.healthHospForm.valid) {
      return true;
    } else {
      return false;
    }
  }
}

