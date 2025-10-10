import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { QuoteService } from '../quote.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { LoaderService } from '@app/_services/loader.service';
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};
@Component({
  selector: 'app-child-plan',
  templateUrl: './child-plan.component.html',
  styleUrls: ['./child-plan.component.css'],
})
export class ChildPlanComponent implements OnInit {
  @ViewChild('noQuoteGenerated') MyProp: ElementRef;

  investments = [{ value: 'education', viewValue: 'Education' }];

  years = [
    { value: '5-9', viewValue: '5-9' },
    { value: '10-15', viewValue: '10-15' },
    { value: '16-20', viewValue: '16-20' },
    { value: '20-25', viewValue: '20-25' },
    { value: '26-90', viewValue: ' > 25' },
  ];

  eighteenYearsProposer = new Date();

  eighteenYearsInsure = new Date();

  thirtyDayOnwords = new Date();

  eighteenYearsChild = new Date();

  thirtyDayChild = new Date();

  searchCtrl;

  childPlanForm: FormGroup;

  isShownPolicyDescription = false;

  isShownPolicyFor = false;

  isShownpraposerGen = false;

  isShownsamePerson = false;

  isShownPremium = false;

  isShownCoverage = false;

  isShownDob = false;

  isShownIdentityFor = false;

  isShownpaymentFor = false;

  helpTextWord = false;

  isShownChildDob = false;

  isShownChildGender = false;

  needHideCritical = 'Need help?';

  needHidePolicyFor = 'Need help?';

  needHideSamePerson = 'Need help?';

  needHideRelationship = 'Need help?';

  needHideDob = 'Need help?';

  needHidePincode = 'Need help?';

  needHideCoverage = 'Need help?';

  needHideidentity = 'Need help?';

  needHidepayment = 'Need help?';

  needHidechildDob = 'Need help?';

  needHidechildGender = 'Need help?';

  proposerRelList = [
    { id: '2', value: 'Son' },
    { id: '3', value: 'Daughter' },
  ];

  payoutType;

  quoteId;

  quoteInput;

  errorDataFound = false;

  errorDetail;

  proInsuredCover = false;

  isGuaranteed: true;

  isNonGuaranteed: false;

  formValue;

  isLoading;

  isquoteLoading;

  insuredValue;

  customerId;

  customerDetails;

  isProInsured = false;

  isDependentList;

  filterDependent;

  startTypeCover;

  sumInsuredValue;

  isSon = false;

  isDaughter = false;

  constructor(
    private QuoteServiceobj: QuoteService,
    private router: Router,
    private route: ActivatedRoute,
    private currencypipe: CurrencyPipe,
    private loaderService: LoaderService,
  ) {
    this.eighteenYearsInsure.setFullYear(this.eighteenYearsInsure.getFullYear() - 18);
    this.eighteenYearsProposer.setFullYear(this.eighteenYearsProposer.getFullYear() - 18);
    this.thirtyDayOnwords.setDate(this.thirtyDayOnwords.getDate() - 30);
    this.eighteenYearsChild.setFullYear(this.eighteenYearsChild.getFullYear() - 18);
    this.thirtyDayChild.setDate(this.thirtyDayChild.getDate() - 30);
  }

  startTypeInsured() {
    if (this.childPlanForm.get('startType').value === 'sa') {
      this.startTypeCover = true;
      this.childPlanForm.controls['sumInsured'].valueChanges.subscribe((form) => {
        const sumAsuuredPremium = form.toString().replace(/\D/g, '').replace(/^0+/, '');
        if (form) {
          this.childPlanForm.patchValue(
            {
              sumInsured: this.currencypipe.transform(sumAsuuredPremium, 'INR', 'symbol', '1.0-0'),
            },
            { emitEvent: false },
          );
        }
      });
    } else if (this.childPlanForm.get('startType').value === 'ap') {
      this.startTypeCover = false;
      this.childPlanForm.controls['investrate'].valueChanges.subscribe((form) => {
        const sumAssuredVal = form.toString().replace(/\D/g, '').replace(/^0+/, '');
        if (form) {
          this.childPlanForm.patchValue(
            {
              investrate: this.currencypipe.transform(sumAssuredVal, 'INR', 'symbol', '1.0-0'),
            },
            { emitEvent: false },
          );
        }
      });
    }
  }

  processMyValue() {
    let sumInsuredNum = this.childPlanForm
      .get('investrate')
      .value.toString()
      .replace(/\D/g, '')
      .replace(/^0+/, '');
    if (sumInsuredNum % 1000 !== 0) {
      sumInsuredNum -= sumInsuredNum % 1000;
      this.childPlanForm.patchValue(
        {
          investrate: this.currencypipe.transform(sumInsuredNum, 'INR', 'symbol', '1.0-0'),
        },
        { emitEvent: false },
      );
    }
  }

  processInsuredValue() {
    let premiumAsuuredNum = this.childPlanForm
      .get('sumInsured')
      .value.toString()
      .replace(/\D/g, '')
      .replace(/^0+/, '');
    if (premiumAsuuredNum % 1000 !== 0) {
      premiumAsuuredNum -= premiumAsuuredNum % 1000;
      this.childPlanForm.patchValue(
        {
          sumInsured: this.currencypipe.transform(premiumAsuuredNum, 'INR', 'symbol', '1.0-0'),
        },
        { emitEvent: false },
      );
    }
  }

  ngOnInit(): void {
    this.childPlanForm = new FormGroup({
      proInsured: new FormControl('', Validators.required),
      startType: new FormControl('', Validators.required),
      premiumPay: new FormControl('', Validators.required),
      customerDependentList: new FormControl(''),
      searchCtrl: new FormControl(''),
      investmentGoal: new FormControl('', Validators.required),
      approxYear: new FormControl('', Validators.required),
    });
    this.route.params.subscribe((params) => {
      if (params.customerId) {
        this.customerId = params.customerId;
        this.QuoteServiceobj.getCustomerById(this.customerId).subscribe((result) => {
          this.customerDetails = result;
        });
      }
      if (params.quoteId) {
        this.quoteId = params.quoteId;
        // this.isLoading = true;
        this.loaderService.showSpinner(true);
        setTimeout(() => {
          // this.isLoading = false;
          this.loaderService.showSpinner(false);
          this.QuoteServiceobj.getLifeQuoteInputValue(this.quoteId).subscribe((finalQuoteRes) => {
            this.formValue = finalQuoteRes;
            if (this.formValue.quoteInput.childDob === undefined) {
              this.childPlanForm.patchValue({
                proInsured: 'yes',
              });
              this.proInsured();
              this.childPlanForm.patchValue({
                dateOfBirth: this.formValue.quoteInput.insuredDob,
              });
            } else {
              this.childPlanForm.patchValue({
                proInsured: 'no',
              });
              this.proInsured();
              this.childPlanForm.patchValue({});
            }
            if (this.formValue.quoteInput.startType === 'sa') {
              this.childPlanForm.patchValue({
                startType: this.formValue.quoteInput.startType,
              });
              this.startTypeInsured();
              this.childPlanForm.patchValue({
                sumInsured: this.formValue.quoteInput.sa,
              });
            } else {
              this.childPlanForm.patchValue({
                startType: this.formValue.quoteInput.startType,
              });
              this.startTypeInsured();
              this.childPlanForm.patchValue({
                sumInsured: this.formValue.quoteInput.ap,
              });
            }
            this.childPlanForm.patchValue({
              gender: this.formValue.quoteInput.insuredGender,
              investrate: this.formValue.quoteInput.ap,
              proposalRelation: this.formValue.quoteInput.insuredRel,
              praposerDateOfBirth: this.formValue.quoteInput.proposerDob,
              proposerGender: this.formValue.quoteInput.proposerGender,
              childDOB: this.formValue.quoteInput.childDob,
              childGender: this.formValue.quoteInput.childGender,
              premiumPay: this.formValue.quoteInput.selectedMode
                ? this.formValue?.quoteInput?.selectedMode.toString()
                : '1',
            });
          });
        }, 3000);
      }
    });
    this.childPlanForm.controls['proInsured'].valueChanges.subscribe((checked) => {
      if (checked === 'yes') {
        this.childPlanForm.addControl('dateOfBirth', new FormControl('', Validators.required));
        this.childPlanForm.addControl('gender', new FormControl('', Validators.required));
        this.childPlanForm.removeControl('praposerDateOfBirth');
        this.childPlanForm.removeControl('proposerGender');
        this.childPlanForm.removeControl('proposalRelation');
        this.childPlanForm.removeControl('childGender');
        this.childPlanForm.removeControl('childDOB');
      } else {
        this.childPlanForm.addControl(
          'praposerDateOfBirth',
          new FormControl('', Validators.required),
        );
        this.childPlanForm.addControl('proposerGender', new FormControl('', Validators.required));
        this.childPlanForm.addControl('proposalRelation', new FormControl('', Validators.required));
        this.childPlanForm.addControl('childGender', new FormControl('', Validators.required));
        this.childPlanForm.addControl('childDOB', new FormControl('', Validators.required));
        this.childPlanForm.removeControl('dateOfBirth');
        this.childPlanForm.removeControl('gender');
      }
      this.childPlanForm.updateValueAndValidity();
    });
    this.childPlanForm.controls['startType'].valueChanges.subscribe((checked) => {
      if (checked === 'sa') {
        this.childPlanForm.addControl(
          'sumInsured',
          new FormControl('', [
            Validators.required,
            Validators.min(100000),
            Validators.max(5000000),
          ]),
        );
      } else {
        this.childPlanForm.removeControl('sumInsured');
      }
      if (checked === 'ap') {
        this.childPlanForm.addControl(
          'investrate',
          new FormControl('', [
            Validators.required,
            Validators.min(40000),
            Validators.max(100000000),
          ]),
        );
      } else {
        this.childPlanForm.removeControl('investrate');
      }
      this.childPlanForm.updateValueAndValidity();
    });
  }

  proInsured() {
    if (this.childPlanForm.get('proInsured').value === 'no') {
      if (this.quoteId) {
        if (this.formValue.quoteInput.insuredRel === '1') {
          this.childPlanForm
            .get('praposerDateOfBirth')
            .setValue(this.formValue.quoteInput.insuredDob);
          this.childPlanForm
            .get('proposerGender')
            .setValue(this.formValue.quoteInput.insuredGender);
        } else {
          this.childPlanForm
            .get('praposerDateOfBirth')
            .setValue(this.formValue.quoteInput.proposerDob);
          this.childPlanForm
            .get('proposerGender')
            .setValue(this.formValue.quoteInput.proposerGender);
          this.childPlanForm.get('proposalRelation').setValue(this.formValue.quoteInput.insuredRel);
        }
        // this.childPlanForm.get('dateOfBirthOnwords').setValue(this.formValue.quoteInput.insuredDob);
      }
      this.proInsuredCover = true;
      this.childPlanForm.controls['proposalRelation'].valueChanges.subscribe((relation) => {
        if (relation === '2') {
          this.childPlanForm.get('childGender').patchValue('M', { emitEvent: false });
          this.isDaughter = true;
        } else if (relation === '3') {
          this.childPlanForm.get('childGender').patchValue('F', { emitEvent: false });
          this.isSon = true;
        }
      });
      if (this.customerId) {
        if (this.customerDetails.dependentList) {
          this.isDependentList = true;
          this.childPlanForm.valueChanges.subscribe((checked) => {
            if (checked.proposalRelation === '2') {
              this.filterDependent = this.customerDetails.dependentList.filter((arr) => {
                if (arr.relationshipType === '5') {
                  return arr;
                }
              });
              if (checked.customerDependentList.relationshipType === '5') {
                this.childPlanForm
                  .get('childDOB')
                  .patchValue(checked.customerDependentList.dob, { emitEvent: false });
                this.childPlanForm.updateValueAndValidity({ emitEvent: false });
              }
            } else if (checked.proposalRelation === '3') {
              this.filterDependent = this.customerDetails.dependentList.filter((arr) => {
                if (arr.relationshipType === '4') {
                  return arr;
                }
              });
              if (checked.customerDependentList.relationshipType === '4') {
                this.childPlanForm
                  .get('childDOB')
                  .patchValue(checked.customerDependentList.dob, { emitEvent: false });
                this.childPlanForm.updateValueAndValidity({ emitEvent: false });
              }
            }
          });
        } else {
          this.isDependentList = false;
          this.childPlanForm.removeControl('customerDependentList');
        }
        this.childPlanForm.patchValue({
          praposerDateOfBirth: this.customerDetails.dob,
          proposerGender: this.customerDetails.gender,
        });
      }
    } else if (this.childPlanForm.get('proInsured').value === 'yes') {
      if (this.quoteId) {
        this.childPlanForm.get('dateOfBirth').setValue(this.formValue.quoteInput.insuredDob);
      }
      this.isProInsured = true;
      this.proInsuredCover = false;
      this.isDependentList = false;
      if (this.customerId) {
        this.childPlanForm.patchValue({
          dateOfBirth: this.customerDetails.dob,
          gender: this.customerDetails.gender,
        });
      }
    } else {
      this.proInsuredCover = false;
    }
  }

  submitLifeQuote() {
    const minValue = this.childPlanForm.get('approxYear').value;
    const myArray = minValue.split('-');
    const minPT = myArray[0];
    const maxPT = myArray[1];
    // this.isquoteLoading = true;
    this.loaderService.showSpinner(true);
    const childEducation = {
      lob: 'Life',
      productType: 'Child',
      startType: this.childPlanForm.value.startType,
      insuredRating: 'NS',
      pincode: 560030,
      isJointLife: false,
      goal: this.childPlanForm.get('investmentGoal').value,
      minPT,
      maxPT,
      // customerId: this.customerId ? this.customerId : 0,
      mode: this.childPlanForm.value.premiumPay,
      selectedMode: this.childPlanForm.value.premiumPay,
      proposerDob:
        this.childPlanForm.get('proInsured').value === 'no'
          ? this.childPlanForm.get('praposerDateOfBirth').value
          : this.childPlanForm.get('dateOfBirth').value,
      proposerGender:
        this.childPlanForm.get('proInsured').value === 'no'
          ? this.childPlanForm.get('proposerGender').value
          : this.childPlanForm.get('gender').value,
      insuredDob:
        this.childPlanForm.get('proInsured').value === 'no'
          ? this.childPlanForm.get('praposerDateOfBirth').value
          : this.childPlanForm.get('dateOfBirth').value,
      insuredGender:
        this.childPlanForm.get('proInsured').value === 'no'
          ? this.childPlanForm.get('proposerGender').value
          : this.childPlanForm.get('gender').value,
      insuredRel:
        this.childPlanForm.get('proInsured').value === 'no'
          ? this.childPlanForm.get('proposalRelation').value
          : '1',
    };
    if (this.formValue) {
      childEducation['customerId'] = this.formValue?.quoteInput?.customerId;
    } else if (this.customerId) {
      childEducation['customerId'] = this.customerId;
    } else {
      childEducation['customerId'] = 0;
    }
    if (this.childPlanForm.get('proInsured').value === 'no') {
      childEducation['childDob'] = this.childPlanForm.get('childDOB').value;
      childEducation['childGender'] = this.childPlanForm.get('childGender').value;
    }
    if (this.childPlanForm.get('startType').value === 'sa') {
      this.sumInsuredValue = this.childPlanForm
        .get('sumInsured')
        .value.toString()
        .replace(/\D/g, '')
        .replace(/^0+/, '');
      childEducation['sa'] = this.sumInsuredValue;
    } else {
      this.insuredValue = this.childPlanForm
        .get('investrate')
        .value.toString()
        .replace(/\D/g, '')
        .replace(/^0+/, '');
      childEducation['ap'] = this.insuredValue;
    }
    this.QuoteServiceobj.ChildplanQuote(childEducation).subscribe(
      (result) => {
        // this.isquoteLoading = false;
        this.loaderService.showSpinner(false);
        const quote = result;
        this.quoteId = quote['quoteId'];
        console.log('testing', quote['numQuotesExpected']);
        if (quote['numQuotesExpected'] > 0) {
          // this.router.navigate(['quote/quote-child-plan'], { queryParams: { quoteId: this.quoteId } });
          this.router.navigate(['quote/quote-child-plan', this.quoteId]);
        } else {
          // this.isquoteLoading = false;
          this.loaderService.showSpinner(false);
          this.errorDataFound = true;
          this.errorDetail =
            'Oops.. We could not find any policies for you. you may have to adjust your search criteria.';
          this.MyProp.nativeElement.scrollIntoView({ behavior: 'smooth' });
        }
      },
      (error) => {
        // this.isquoteLoading = false;
        this.loaderService.showSpinner(false);
        this.errorDataFound = true;
        if (error.error.message !== '') {
          this.errorDetail = error.error.message;
        } else if (error.error.details) {
          this.errorDetail = error.error.details;
        } else if (error.error.error) {
          this.errorDetail = error.error.error;
        } else {
          this.errorDetail =
            'Oops.. We could not find any policies for you. you may have to adjust your search criteria.';
        }
        this.MyProp.nativeElement.scrollIntoView({ behavior: 'smooth' });
      },
    );
  }

  toggleShow(event) {
    if (event === 'policyDescription') {
      this.isShownPolicyDescription = !this.isShownPolicyDescription;
      if (this.isShownPolicyDescription) {
        this.needHideCritical = 'Hide help';
      } else {
        this.needHideCritical = 'Need help?';
      }
    } else if (event === 'samePerson') {
      this.isShownsamePerson = !this.isShownsamePerson;
      if (this.isShownsamePerson) {
        this.needHideSamePerson = 'Hide help';
      } else {
        this.needHideSamePerson = 'Need help?';
      }
    } else if (event === 'policyFor') {
      this.isShownPolicyFor = !this.isShownPolicyFor;
      if (this.isShownPolicyFor) {
        this.needHidePolicyFor = 'Hide help';
      } else {
        this.needHidePolicyFor = 'Need help?';
      }
    } else if (event === 'proGen') {
      this.isShownpraposerGen = !this.isShownpraposerGen;
      if (this.isShownpraposerGen) {
        this.needHideRelationship = 'Hide help';
      } else {
        this.needHideRelationship = 'Need help?';
      }
    } else if (event === 'Premium') {
      this.isShownPremium = !this.isShownPremium;
      if (this.isShownPremium) {
        this.needHidePincode = 'Hide help';
      } else {
        this.needHidePincode = 'Need help?';
      }
    } else if (event === 'dob') {
      this.isShownDob = !this.isShownDob;
      if (this.isShownDob) {
        this.needHideDob = 'Hide help';
      } else {
        this.needHideDob = 'Need help?';
      }
    } else if (event === 'coverage') {
      this.isShownCoverage = !this.isShownCoverage;
      if (this.isShownCoverage) {
        this.needHideCoverage = 'Hide help';
      } else {
        this.needHideCoverage = 'Need help?';
      }
    } else if (event === 'identify') {
      this.isShownIdentityFor = !this.isShownIdentityFor;
      if (this.isShownIdentityFor) {
        this.needHideidentity = 'Hide help';
      } else {
        this.needHideidentity = 'Need help?';
      }
    } else if (event === 'payment') {
      this.isShownpaymentFor = !this.isShownpaymentFor;
      if (this.isShownpaymentFor) {
        this.needHidepayment = 'Hide help';
      } else {
        this.needHidepayment = 'Need help?';
      }
    } else if (event === 'childDob') {
      this.isShownChildDob = !this.isShownChildDob;
      if (this.isShownChildDob) {
        this.needHidechildDob = 'Hide help';
      } else {
        this.needHidechildDob = 'Need help?';
      }
    } else if (event === 'childGender') {
      this.isShownChildGender = !this.isShownChildGender;
      if (this.isShownChildGender) {
        this.needHidechildGender = 'Hide help';
      } else {
        this.needHidechildGender = 'Need help?';
      }
    }
  }

  get formError() {
    return this.childPlanForm.controls;
  }

  inputEvent(date, control) {
    const moment = require('moment');
    const newDate = new Date(date.value);
    this.childPlanForm.get(control).setValue(moment(newDate).format('YYYY-MM-DD'));
  }
}
