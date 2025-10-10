import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { HealthAddInsurerComponent } from '../health-add-insurer/health-add-insurer.component';
import { QuoteService } from '../quote.service';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MY_FORMATS } from '@app/shared/utils/moment';
import { LoaderService } from '@app/_services/loader.service';
import { CurrencyPipe } from '@angular/common';

export interface DialogData {
  name: string;
}

@Component({
  selector: 'app-critical-illness',
  templateUrl: './critical-illness.component.html',
  styleUrls: ['./critical-illness.component.css'],

  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class CriticalIllnessComponent implements OnInit {
  @ViewChild('noQuoteGenerated') MyProp: ElementRef;

  searchCtrl;

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

  needHidePolicyType = 'Need help?'; // 1

  needHidePolicyCover = 'Need help?'; // 2

  needHidePolicyExistingCover = 'Need help?'; // 2a

  needHidePrimaryMember = 'Need help?';

  enhanceExistingCover = false;

  needHideDob = 'Need help?';

  needHidePincode = 'Need help?';

  needHideDeductible = 'Need help?';

  isDialogOpened = false;

  isErrorMsg = false;

  numExpected;

  existingCoverAmount = [
    { value: '100000', viewValue: '100000' },
    { value: '200000', viewValue: '200000' },
    { value: '300000', viewValue: '300000' },
    { value: '400000', viewValue: '400000' },
    { value: '500000', viewValue: '500000' },
  ];

  tenureYearList = [
    { value: '1', viewValue: '1' },
    { value: '2', viewValue: '2' },
    { value: '3', viewValue: '3' },
  ];

  policyCoverOption = [
    { value: 1, viewValue: 'Buy a New Policy with Hospitalization Cover' },
    // { value: 2, viewValue: 'Buy a Corona Kavach Policy' },
    { value: 3, viewValue: 'Enhance Existing Cover' },
  ];

  optionCover;

  primaryMemberList;

  secondaryMemberList;

  productType;

  criticalIllnessForm: FormGroup;

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

  customerDetails;

  addressPinCode;

  isPersonalAccident = false;

  occupationOption;

  numQuoteExpected;

  allcustomerData;

  customerDetailsCopy;

  constructor(
    public dialog: MatDialog,
    private quoteService: QuoteService,
    private router: Router,
    public myElement: ElementRef,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private currencypipe: CurrencyPipe,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      // console.log('cid', params.customerId);
      this.customerId = params.customerId;
      // console.log('cid d', this.customerId);

      this.leadId = params.leadId;
    });

    this.criticalIllnessForm = new FormGroup({
      // policyType: new FormControl('', Validators.required),
      // policyKind: new FormControl('', Validators.required),
      dob: new FormControl('', Validators.required),
      primaryMember: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      dogh: new FormControl('', Validators.required),
      // pincode: new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern(this.pattern1)]),
      tenure: new FormControl('1', Validators.required),
      sumAssured: new FormControl('500000', Validators.required),
      searchCtrl: new FormControl(''),
    });
    this.selectPolicyType(1);

    this.criticalIllnessForm.addControl(
      'pincode',
      new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(this.pattern1),
      ]),
    );

    this.route.params.subscribe((params) => {
      this.leadId = params['leadId'];
      this.customerId = params['customerId'];
      // console.log('testing11', this.customerId);
      if (params.customerId) {
        this.customerId = params.customerId;
        this.quoteService.getCustomerById(this.customerId).subscribe((customerData) => {
          this.allcustomerData = JSON.parse(JSON.stringify(customerData));
          this.customerDetails = customerData;
          if (this.customerDetails?.addressList?.length > 0) {
            this.customerDetails.addressList.map((address) => {
              if (
                address.addressType === 'PERMANENT' ||
                address.addressType === 'CORRESPONDENCE' ||
                address.addressType === 'OFFICE'
              ) {
                this.criticalIllnessForm.get('pincode').setValue(address.postalcode);
              }
            });
          }
          this.selfPrimaryDob = customerData['dob'];
          this.selfPrimaryGender = customerData['gender'];
          this.criticalIllnessForm.get('dob').setValue(this.selfPrimaryDob);
          this.criticalIllnessForm.get('gender').setValue(this.selfPrimaryGender);
        });
      }
    });

    this.route.params.subscribe((params) => {
      if (params.quoteId) {
        // this.isLoadingQuoteValue = true;
        this.loaderService.showSpinner(true);
        this.existingQuoteId = params.quoteId;
        // this.isLoading = true;
        this.callQuoteApi();
      }
    });
  }

  get formError() {
    return this.criticalIllnessForm.controls;
  }

  callQuoteApi() {
    this.quoteService.backToQuote(this.existingQuoteId).subscribe((finalQuoteRes) => {
      this.finalQuote = finalQuoteRes;
      this.quoteInput = this.finalQuote?.quoteInput;
      // if route is from quote page
      this.setFormValue();
    });
  }

  setFormValue() {
    this.customerId = this.quoteInput?.customerId;
    if (this.customerId !== 0) {
      this.quoteService.getCustomerById(this.customerId).subscribe((customerData) => {
        this.allcustomerData = JSON.parse(JSON.stringify(customerData));
        this.customerDetails = customerData;
        console.log('detail cus jfj', this.allcustomerData);
        if (this.allcustomerData?.dependentList) {
          this.customerDetails.dependentList = this.customerDetails?.dependentList.filter(
            (item1) => !this.quoteInput?.members.some((item2) => item2.dob === item1.dob),
          );
        }
        // console.log('detail cus', this.customerDetails);
      });
    }

    // const enteredQuoteInput = this.quoteService.getQuoteInput();
    // if (this.quoteInput?.productType === 'INDV') {
    // this.criticalIllnessForm.get('policyType').setValue('1');
    this.selectPolicyType('1');
    // } else if (this.quoteInput?.productType === 'FF') {
    //   this.criticalIllnessForm.get('policyType').setValue('2');
    //   this.selectPolicyType('2');
    // }
    //arr
    // const primaryElement = this.quoteInput.members.pop();
    this.criticalIllnessForm.get('dob').setValue(this.quoteInput.members[0].dob);
    this.criticalIllnessForm.get('gender').setValue(this.quoteInput.members[0].gender);
    this.criticalIllnessForm.get('dogh').setValue(this.quoteInput.dogh);
    // this.criticalIllnessForm.get('smoker').setValue(this.quoteInput.members[0].rating);
    // if (this.quoteInput?.deductible === 0) {
    //   this.criticalIllnessForm.get('policyKind').setValue(1);
    // } else {
    //   this.criticalIllnessForm.get('policyKind').setValue(3);
    // }
    this.addedMemberArr = this.quoteInput.members.slice(1);
    this.membersArr = this.quoteInput.members.slice(1);
    this.membersArr.some((arr) => {
      if (arr.rating === 'S') {
        arr['smoking'] = 'Smoker';
      } else {
        arr['smoking'] = 'Non-Smoker';
      }
    });
    this.membersArr.some((arr) => {
      arr['relation'] = this.checkRelationship(arr.relationshipId);
    });
    //deductible
    if (
      this.quoteInput?.deductible === 0 ||
      this.router.url.indexOf('/quote/personal-accident') > -1 ||
      this.router.url.indexOf('/quote/pa-insurance') > -1
    ) {
      // this.criticalIllnessForm.get('policyKind').setValue(1);
      this.criticalIllnessForm.removeControl('deductible');
    } else {
      // this.criticalIllnessForm.get('policyKind').setValue(3);
      this.enhanceExistingCover = true;
      this.existingCoverAmount.filter((amount) => {
        amount.value = this.quoteInput?.deductible;
        this.criticalIllnessForm.addControl(
          'deductible',
          new FormControl(amount.value, Validators.required),
        );
      });
      // this.criticalIllnessForm.addControl('deductible', new FormControl('', Validators.required));
      // this.criticalIllnessForm.get('deductible').setValue(this.quoteInput?.deductible);
    }
    this.criticalIllnessForm.get('pincode').setValue(this.quoteInput?.pincode);
    //tenure
    if (this.quoteInput?.tenure == 1) {
      this.criticalIllnessForm.get('tenure').setValue('1');
    } else if (this.quoteInput?.tenure == 2) {
      this.criticalIllnessForm.get('tenure').setValue('2');
    } else if (this.quoteInput?.tenure == 3) {
      this.criticalIllnessForm.get('tenure').setValue('3');
    }

    // this.isLoadingQuoteValue = false;
    this.loaderService.showSpinner(false);
  }

  filterSearch() {
    const val = this.criticalIllnessForm.get('searchFilt').value;
    const arrVal = this.primaryMemberList.map((arr) => {
      if (arr.value == val) {
        return arr.value;
      }
    });
  }

  inputEvent(date) {
    const moment = require('moment');
    const newDate = new Date(date.value);
    this.criticalIllnessForm.get('dob').setValue(moment(newDate).format('YYYY-MM-DD'));
    this.ageCheck();
  }

  ageCheck() {
    const timeDiff = Math.abs(
      Date.now() - new Date(this.criticalIllnessForm.get('dob').value).getTime(),
    );
    const age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
    const id = this.criticalIllnessForm.get('primaryMember').value;
    if (
      id == 1 ||
      id == 2 ||
      id == 3 ||
      id == 6 ||
      id == 7 ||
      id == 8 ||
      id == 10 ||
      id == 11 ||
      id == 13 ||
      id == 14 ||
      id == 15
    ) {
      if (age < 18) {
        this.criticalIllnessForm.get('dob').markAsPending();
        this.isAgeErro = true;
      } else {
        this.isAgeErro = false;
      }
    } else {
      this.isAgeErro = false;
    }
  }

  selectPolicyType(event) {
    if (event == 1) {
      this.quoteService.getInsuredRelationship('Health', 'INDV').subscribe((relationshipList) => {
        this.productType = 'INDV';
        this.quoteService.getEnhanceCoverAmount('Health', 'CI').subscribe((assuredSum) => {
          this.sumAssuredAmount = assuredSum;
          if (this.existingQuoteId) {
            this.sumAssuredAmount.filter((sumAssured) => {
              if (sumAssured.id == this.quoteInput.sa) {
                this.criticalIllnessForm.get('sumAssured').setValue(sumAssured.id);
              }
            });
          }
        });
        this.primaryMemberList = relationshipList;
        this.secondaryMemberList = this.primaryMemberList;
        this.criticalIllnessForm.get('primaryMember').setValue(this.primaryMemberList[0].id);
      });
    }
    // else if (event == 2) {
    //   this.quoteService.getInsuredRelationship('CI', 'FF').subscribe((relationshipList) => {
    //     this.primaryMemberList = relationshipList;
    //     this.criticalIllnessForm.get('primaryMember').setValue(this.primaryMemberList[0].id);
    //     this.productType = 'FF';
    //     this.secondaryMemberList = this.primaryMemberList.filter((member) => {
    //       if (
    //         member.id === '2' ||
    //         member.id === '3' ||
    //         member.id === '4' ||
    //         member.id === '5' ||
    //         member.id === '7' ||
    //         member.id === '14'
    //       ) {
    //         return member;
    //       }
    //     });
    //     this.quoteService
    //       .getEnhanceCoverAmount('Health', this.productType)
    //       .subscribe((assuredSum) => {
    //         this.sumAssuredAmount = assuredSum;
    //         if (this.existingQuoteId) {
    //           this.sumAssuredAmount.filter((sumAssured) => {
    //             if (sumAssured.id == this.quoteInput.sa) {
    //               this.criticalIllnessForm.get('sumAssured').setValue(sumAssured.id);
    //             }
    //           });
    //         }
    //       });
    //   });
    // }
  }

  toggleShow(event) {
    if (event === 'policyDescription') {
      this.isShownPolicyDescription = !this.isShownPolicyDescription;
      if (this.isShownPolicyDescription) {
        this.needHideHealthDetails = 'Hide help';
      } else {
        this.needHideHealthDetails = 'Need help?';
      }
      //1
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

  // enhanceExisting(event) {
  //   if (this.criticalIllnessForm.get('policyKind').value === 3) {
  //     this.enhanceExistingCover = true;
  //     this.criticalIllnessForm.addControl('deductible', new FormControl('', Validators.required));
  //   } else {
  //     this.enhanceExistingCover = false;
  //     this.criticalIllnessForm.removeControl('deductible');
  //   }
  // }

  onPrimaryMemberChange() {
    if (this.productType === 'FF') {
      const selectionValue = this.criticalIllnessForm.get('primaryMember').value;
      if (selectionValue === '1') {
        this.secondaryMemberList = this.primaryMemberList.filter((member) => {
          if (
            member.id === '2' ||
            member.id === '3' ||
            member.id === '4' ||
            member.id === '5' ||
            member.id === '7' ||
            member.id === '14'
          ) {
            return member;
          }
        });
      } else if (selectionValue === '2') {
        this.secondaryMemberList = this.primaryMemberList.filter((member) => member.id === '3');
      } else if (selectionValue === '3') {
        this.secondaryMemberList = this.primaryMemberList.filter((member) => member.id === '2');
      } else if (selectionValue === '7') {
        this.secondaryMemberList = this.primaryMemberList.filter((member) => member.id === '14');
      } else if (selectionValue === '14') {
        this.secondaryMemberList = this.primaryMemberList.filter((member) => member.id === '7');
      } else if (selectionValue === '8') {
        this.secondaryMemberList = this.primaryMemberList.filter((member) => member.id === '13');
      } else if (selectionValue === '13') {
        this.secondaryMemberList = this.primaryMemberList.filter((member) => member.id === '8');
      } else if (selectionValue === '11') {
        this.secondaryMemberList = this.primaryMemberList.filter((member) => member.id === '10');
      } else if (selectionValue === '10') {
        this.secondaryMemberList = this.primaryMemberList.filter((member) => member.id === '11');
      }
    }
  }

  addInsurer() {
    if (!this.isDialogOpened) {
      const dialogRef = this.dialog.open(HealthAddInsurerComponent, {
        data: {
          name: this.productType,
          primaryMemberList: this.secondaryMemberList,
          removedMemberList: this.removedData,
          customerDetails: this.customerDetails,
          customerId: this.customerId,
        },
        panelClass: 'dialog-width2',
      });
      dialogRef.afterOpened().subscribe(() => {
        this.isDialogOpened = true;
      });
      dialogRef.afterClosed().subscribe((res) => {
        this.isDialogOpened = false;
        if (res === undefined) {
          this.isDialogOpened = false;
        } else if (res !== undefined) {
          // if (res.relationshipId === '14' || res.relationshipId === '7' || res.relationshipId === '3'
          //   || res.relationshipId === '2' || res.relationshipId === '13' || res.relationshipId === '8'
          //   || res.relationshipId === '10' || res.relationshipId === '11') {
          //   this.secondaryMemberList = this.primaryMemberList.filter(member => {
          //     if (member.id === '2' || member.id === '3' || member.id === '4' || member.id === '5'
          //     ) {
          //       return member;
          //     }
          //   });
          // }
          this.addedMemberArr.push(res);
          this.membersArr.push(res);
          if (this.customerDetails?.dependentList) {
            this.customerDetails.dependentList = this.customerDetails?.dependentList.filter(
              (arr) => {
                // console.log('INSIDE CustomerDetails DepentList', arr);
                if (arr.id !== res.id) {
                  // console.log('inside if');
                  return arr;
                }
              },
            );
          }

          // this.membersArr = this.addedMemberArr;
          this.route.params.subscribe((params) => {
            if (params.customerId) {
              this.customerId = params.customerId;
              // console.log('this customer', this.customerId);

              this.membersArr.forEach((arr, index) => {
                // console.log('PRINTING MENBERS ARRAY', arr);
                this.secondaryMemberList.forEach((addArray) => {
                  // console.log('Printing Secondary Member List', this.secondaryMemberList);

                  if (
                    this.membersArr[index].relationshipId === '4' ||
                    this.membersArr[index].relationshipId === '5' ||
                    this.membersArr[index].relationshipId === '6' ||
                    this.membersArr[index].relationshipId === '15'
                  ) {
                  } else if (addArray.id === this.membersArr[index].relationshipId) {
                    this.removeRelation.push(addArray);
                    // return this.removeRelation;
                  }
                });
                if (
                  this.membersArr[index].relationshipId === '4' ||
                  this.membersArr[index].relationshipId === '5' ||
                  this.membersArr[index].relationshipId === '6' ||
                  this.membersArr[index].relationshipId === '15'
                ) {
                } else {
                  this.secondaryMemberList = this.secondaryMemberList.filter(
                    ({ id }) => id !== this.membersArr[index].relationshipId,
                  );
                }
                // this.secondaryMemberList = this.secondaryMemberList.filter(({ id }) => id !== this.membersArr[index].relationshipId);
              });
            }
          });
          this.membersArr.forEach((arr) => {
            if (arr.rating === 'S') {
              arr['smoking'] = 'Smoker';
            } else if (arr.rating === 'NS') {
              arr['smoking'] = 'Non-Smoker';
            }
          });
          this.checkCondition();
        }
      });
    }
  }

  removeInsurer(i, memberRelationshipId, memberId, memberDOB) {
    if (this.allcustomerData?.dependentList) {
      this.allcustomerData?.dependentList.forEach((cusData) => {
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
        this.isLoading = false;
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
    if (relationId == 1) {
      return 'Self-Primary Member';
    } else if (relationId == 2) {
      return 'Wife';
    } else if (relationId == 3) {
      return 'Husband';
    } else if (relationId == 4) {
      return 'Daughter';
    } else if (relationId == 5) {
      return 'Son';
    } else if (relationId == 6) {
      return 'Sister';
    } else if (relationId == 7) {
      return 'Mother';
    } else if (relationId == 8) {
      return 'Mother in Law';
    } else if (relationId == 9) {
      return 'Grand Son';
    } else if (relationId == 10) {
      return 'Grand Mother';
    } else if (relationId == 11) {
      return 'Grand Father';
    } else if (relationId == 12) {
      return 'Grand Daughter';
    } else if (relationId == 13) {
      return 'Father in Law';
    } else if (relationId == 14) {
      return 'Father';
    } else if (relationId == 15) {
      return 'Brother';
    }
  }

  generateQuote() {
    // this.isLoading = true;
    console.log('insinde genratquote');
    this.checkCondition();
    const quoteData = {
      lob: 'Health',
      leadId: this.leadId,
      productType: 'CI',
      sa: this.criticalIllnessForm.get('sumAssured').value,
      // sa: 500000,
      pincode: this.criticalIllnessForm.get('pincode').value,
      tenure: this.criticalIllnessForm.get('tenure').value,
      // customerId: this.customerId ? this.customerId : 0,
    };
    // console.log('customer id 1111', this.customerId);

    if (this.quoteInput) {
      quoteData['customerId'] = this.quoteInput.customerId;
    } else if (this.customerId !== '') {
      // console.log('inisde 2nd conditon', this.customerId);
      quoteData['customerId'] = this.customerId;
    } else {
      quoteData['customerId'] = 0;
    }

    // quoteData['sa'] = this.criticalIllnessForm.get('sumAssured').value;
    quoteData['dogh'] = this.criticalIllnessForm.get('dogh').value;

    this.addedMemberArr.map((eachArr) => {
      eachArr['sa'] = this.criticalIllnessForm.get('sumAssured').value;
    });
    quoteData['members'] = this.addedMemberArr;

    if (this.isSatisfyAllCondition) {
      if (
        this.router.url.indexOf('/quote/personal-accident') > -1 ||
        this.router.url.indexOf('/quote/pa-insurance') > -1
      ) {
        const primaryMemberDetails = {
          dob: this.criticalIllnessForm.get('dob').value,
          gender: this.criticalIllnessForm.get('gender').value,
          relationshipId: this.criticalIllnessForm.get('primaryMember').value,
          occupation: this.criticalIllnessForm.get('occupation').value,
          maritalStatus: this.criticalIllnessForm.get('maritalStatus').value,
          // relation:'';
        };
        this.addedMemberArr.push(primaryMemberDetails);
        this.loaderService.showSpinner(true);
        this.quoteService.postSubmitHealthQuote(quoteData, 'submitPAQuote').subscribe(
          (result) => {
            const quote = result;
            this.quoteId = quote['quoteId'];
            this.loaderService.showSpinner(false);
            this.numExpected = quote['numQuotesExpected'];
            if (quote['numQuotesExpected'] > 0) {
              this.numExpected = quote['numQuotesExpected'];
              this.quoteService.setNumQuote(quote['numQuotesExpected']);
              // this.router.navigate(['quote/quote-health'], { queryParams: { quoteId: this.quoteId } });
              this.router.navigate(['/quote/quote-health', this.quoteId]);
            } else if (quote['numQuotesExpected'] == 0) {
              this.addedMemberArr.pop();
              this.isNoPolicyError = true;
              this.MyProp.nativeElement.scrollIntoView({ behavior: 'smooth' });
            }
          },
          (error) => {
            this.loaderService.showSpinner(false);
            this.isErrorMsg = true;
          },
        );
      } else {
        const primaryMemberDetails = {
          dob: this.criticalIllnessForm.get('dob').value,
          rating: 'NS',
          gender: this.criticalIllnessForm.get('gender').value,
          relationshipId: this.criticalIllnessForm.get('primaryMember').value,
          // relation:'';
        };

        this.addedMemberArr.push(primaryMemberDetails);
        this.loaderService.showSpinner(true);
        this.quoteService.postSubmitHealthQuote(quoteData, 'submitHealthQuote').subscribe(
          (result) => {
            const quote = result;
            this.quoteId = quote['quoteId'];
            this.numExpected = quote['numQuotesExpected'];
            this.loaderService.showSpinner(false);
            if (quote['numQuotesExpected'] > 0) {
              // this.router.navigate(['quote/quote-health'], { queryParams: { quoteId: this.quoteId } });
              this.router.navigate(['/quote/quote-ci', this.quoteId]);
            } else if (quote['numQuotesExpected'] === 0) {
              this.addedMemberArr.pop();
              this.isNoPolicyError = true;
              this.MyProp.nativeElement.scrollIntoView({ behavior: 'smooth' });
            }
          },
          (error) => {
            // this.isLoading = false;
            this.loaderService.showSpinner(false);

            this.isErrorMsg = true;
          },
        );
      }
    }
  }

  disableGenerateBtn() {
    if (this.criticalIllnessForm.valid) {
      return true;
    } else {
      return false;
    }
  }
}
