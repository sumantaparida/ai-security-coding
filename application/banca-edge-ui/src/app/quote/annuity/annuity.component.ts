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
  selector: 'app-annuity',
  templateUrl: './annuity.component.html',
  styleUrls: ['./annuity.component.css'],
})
export class AnnuityComponent implements OnInit {
  @ViewChild('noQuoteGenerated') MyProp: ElementRef;

  eighteenYearsProposer = new Date();

  eighteenYearsInsure = new Date();

  thirtyDayOnwords = new Date();

  greaterThanHundred = new Date();

  searchCtrl;

  annuityForm: FormGroup;

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

  needHideCritical = 'Need help?';

  needHidePolicyFor = 'Need help?';

  needHideSamePerson = 'Need help?';

  needHideRelationship = 'Need help?';

  needHideDob = 'Need help?';

  needHidePincode = 'Need help?';

  needHideCoverage = 'Need help?';

  needHideidentity = 'Need help?';

  needHidepayment = 'Need help?';

  proposerRelList;

  payoutType;

  quoteId;

  leadId;

  quoteInput;

  errorDataFound = false;

  errorDetail;

  proinsuredCover = false;

  isGuaranteed: true;

  isNonGuaranteed: false;

  formValue;

  isLoading;

  isquoteLoading;

  insuredValue;

  customerId;

  customerDetails;

  suminsuredValue;

  isProInsured = false;

  isAgeErro = false;

  isDependentList;

  filterDependent;

  isSonDaughter;

  numExpected;

  disabled = false;

  spouseCover = false;

  isJointlife = false;

  isShownDOBSpouseFor = false;

  needHideDOBSpouse = 'Need help?';

  isShownSpouseFor = false;

  eighteenYearsSpouse = new Date();

  eightyFiveYears = new Date();

  needHideSpouse = 'Need help?';

  annutityPeriod = [
    { value: '1', viewValue: '1 Years' },
    { value: '2', viewValue: '2 Years' },
    { value: '3', viewValue: '3 Years' },
    { value: '4', viewValue: '4 Years' },
    { value: '5', viewValue: '5 Years' },
    { value: '6', viewValue: '6 Years' },
    { value: '7', viewValue: '7 Years' },
    { value: '8', viewValue: '8 Years' },
    { value: '9', viewValue: '9 Years' },
    { value: '10', viewValue: '10 Years' },

    // { value: '11', viewValue: '11 Years' },
    // { value: '12', viewValue: '12 Years' },
    // { value: '13', viewValue: '13 Years' },
    // { value: '14', viewValue: '14 Years' },
    // { value: '15', viewValue: '15 Years' },
  ];

  isDeferredAnnuity = false;

  constructor(
    private QuoteServiceobj: QuoteService,
    private router: Router,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private currencypipe: CurrencyPipe,
  ) {
    this.eighteenYearsInsure.setFullYear(this.eighteenYearsInsure.getFullYear() - 18);
    this.eighteenYearsProposer.setFullYear(this.eighteenYearsProposer.getFullYear() - 18);
    this.thirtyDayOnwords.setDate(this.thirtyDayOnwords.getDate() - 30);
    this.greaterThanHundred.setFullYear(this.greaterThanHundred.getFullYear() - 100);
    this.eighteenYearsSpouse.setFullYear(this.eighteenYearsSpouse.getFullYear() - 18);
    this.eightyFiveYears.setFullYear(this.eighteenYearsSpouse.getFullYear() - 67);
  }

  ngOnInit(): void {
    this.QuoteServiceobj.getInsuredRelationship('Life', 'ANN').subscribe((relationship) => {
      console.log('printing realtiosnhip', relationship);
      this.proposerRelList = relationship;
      this.proposerRelList = this.proposerRelList.filter((rel) => rel.id !== '1');
    });

    this.route.params.subscribe((params) => {
      this.customerId = params.customerId;
      this.leadId = params.leadId;
    });

    this.annuityForm = new FormGroup({
      proInsured: new FormControl({ value: 'yes', disabled: true }, Validators.required),
      gender: new FormControl({ value: '', disabled: true }, Validators.required),
      dateOfBirth: new FormControl('', Validators.required),
      nri: new FormControl('', Validators.required),
      premiumPay: new FormControl({ value: '0', disabled: true }, Validators.required),
      customerDependentList: new FormControl(''),
      searchCtrl: new FormControl(''),
      annuityPeriod: new FormControl('', Validators.required),
      investrate: new FormControl('', [
        Validators.required,
        Validators.min(200000),
        Validators.max(50000000),
      ]),
      startPayment: new FormControl('', Validators.required),
      spouse: new FormControl('', Validators.required),
    });

    this.route.params.subscribe((qParams) => {
      if (qParams.customerId) {
        this.customerId = qParams.customerId;
        this.QuoteServiceobj.getCustomerById(this.customerId).subscribe((result) => {
          this.customerDetails = result;
          this.proInsured();
        });
      }
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

        // this.isLoading = false;
        this.QuoteServiceobj.backToQuote(this.quoteId).subscribe((finalQuoteRes) => {
          this.loaderService.showSpinner(false);

          this.formValue = finalQuoteRes;
          // if (this.formValue.quoteInput.insuredRel === '1') {
          this.annuityForm.patchValue({
            proInsured: 'yes',
          });
          this.proInsured();
          this.annuityForm.patchValue({
            dateOfBirth: this.formValue.quoteInput.insuredDob,
          });
          // } else {
          // this.annuityForm.patchValue({
          //   proInsured: 'no',
          // });
          // this.proInsured();
          // this.annuityForm.patchValue({
          //   dateOfBirthOnwords: this.formValue.quoteInput.insuredDob,
          // });
          // }
          if (this.formValue.quoteInput.isJointLife === false) {
            this.annuityForm.patchValue({
              spouse: false,
            });
          } else {
            this.annuityForm.patchValue({
              spouse: true,
              dateofbirthspouse: this.formValue?.quoteInput?.secInsuredDob,
              spouseGender: this.formValue?.quoteInput?.secInsuredGender,
              secondaryAnnutiRelation: this.formValue?.quoteInput?.insuredRel,
            });
            this.isJointLife();
          }

          if (this.formValue?.quoteInput?.defermentPeriod === 0) {
            console.log('insinde 0 deferment');
            this.annuityForm.get('startPayment').setValue('immediate');
            this.isDeferredAnnuity = false;
            this.annuityForm.removeControl('annuityPeriod');
          } else {
            this.annuityForm.get('startPayment').setValue('deferred');
            this.isDeferredAnnuity = true;
            this.annuityForm.addControl('annuityPeriod', new FormControl('', Validators.required));
          }
          this.annuityForm.patchValue({
            gender: this.formValue.quoteInput.insuredGender,
            investrate: this.formValue.quoteInput.ap,
            proposalRelation: this.formValue.quoteInput.insuredRel,
            praposerDateOfBirth: this.formValue.quoteInput.proposerDob,
            proposerGender: this.formValue.quoteInput.proposerGender,
            premiumPay: this.formValue.quoteInput?.selectedMode.toString(),
            annuityPeriod: this.formValue?.quoteInput?.defermentPeriod.toString(),
          });
        });
      }
    });

    this.annuityForm.controls['proInsured'].valueChanges.subscribe((checked) => {
      if (checked === 'yes') {
        this.annuityForm.addControl('dateOfBirth', new FormControl('', Validators.required));
        // this.annuityForm.addControl('spouse', new FormControl('', Validators.required));
        this.annuityForm.removeControl('dateOfBirthOnwords');
        this.annuityForm.removeControl('praposerDateOfBirth');
        this.annuityForm.removeControl('proposerGender');
        this.annuityForm.removeControl('proposalRelation');
      } else {
        this.annuityForm.addControl('dateOfBirthOnwords', new FormControl('', Validators.required));
        this.annuityForm.removeControl('dateOfBirth');
        // this.annuityForm.removeControl('spouse');
        this.annuityForm.addControl(
          'praposerDateOfBirth',
          new FormControl('', Validators.required),
        );
        this.annuityForm.addControl('proposerGender', new FormControl('', Validators.required));
        this.annuityForm.addControl('proposalRelation', new FormControl('', Validators.required));
      }
      this.annuityForm.updateValueAndValidity();
    });

    this.annuityForm.controls['spouse'].valueChanges.subscribe((checked) => {
      if (checked === true) {
        this.annuityForm.addControl('dateofbirthspouse', new FormControl('', Validators.required));
        this.annuityForm.addControl(
          'spouseGender',
          new FormControl({ value: '', disabled: true }, Validators.required),
        );
        this.annuityForm.addControl(
          'secondaryAnnutiRelation',
          new FormControl('', Validators.required),
        );
      } else {
        this.annuityForm.removeControl('dateofbirthspouse');
        this.annuityForm.removeControl('spouseGender');
        this.annuityForm.removeControl('secondaryAnnutiRelation');
      }
      this.annuityForm.updateValueAndValidity();
    });

    this.annuityForm.controls['startPayment'].valueChanges.subscribe((value) => {
      if (value === 'immediate') {
        this.isDeferredAnnuity = false;
        this.annuityForm.removeControl('annuityPeriod');
        console.log('form=', this.annuityForm);
      } else {
        this.isDeferredAnnuity = true;
        this.annuityForm.addControl('annuityPeriod', new FormControl('', Validators.required));
      }
      this.annuityForm.updateValueAndValidity();
    });

    this.annuityForm.get('secondaryAnnutiRelation')?.valueChanges.subscribe((val) => {
      this.setGender();
    });
  }

  processMyValue() {
    let sumInsuredNum = this.annuityForm
      .get('investrate')
      .value.toString()
      .replace(/\D/g, '')
      .replace(/^0+/, '');
    if (sumInsuredNum % 1000 !== 0) {
      sumInsuredNum -= sumInsuredNum % 1000;
      this.annuityForm.patchValue(
        {
          investrate: this.currencypipe.transform(sumInsuredNum, 'INR', 'symbol', '1.0-0'),
        },
        { emitEvent: false },
      );
    }
  }

  processInsuredValue() {
    let premiumAsuuredNum = this.annuityForm
      .get('sumInsured')
      .value.toString()
      .replace(/\D/g, '')
      .replace(/^0+/, '');
    if (premiumAsuuredNum % 1000 !== 0) {
      premiumAsuuredNum -= premiumAsuuredNum % 1000;
      this.annuityForm.patchValue(
        {
          sumInsured: this.currencypipe.transform(premiumAsuuredNum, 'INR', 'symbol', '1.0-0'),
        },
        { emitEvent: false },
      );
    }
  }

  isJointLife() {
    if (this.annuityForm.get('spouse').value === true) {
      this.isJointlife = true;
    } else {
      this.isJointlife = false;
    }
  }

  proInsured() {
    // console.log(this.annuityForm.get('proInsured').value, '= value of proInsured');
    if (this.annuityForm.get('proInsured').value === 'no') {
      if (this.quoteId) {
        if (this.formValue.quoteInput.insuredRel === '1') {
          this.annuityForm
            .get('praposerDateOfBirth')
            .setValue(this.formValue.quoteInput.insuredDob);
          this.annuityForm.get('proposerGender').setValue(this.formValue.quoteInput.insuredGender);
        } else {
          this.annuityForm
            .get('praposerDateOfBirth')
            .setValue(this.formValue.quoteInput.proposerDob);
          this.annuityForm.get('proposerGender').setValue(this.formValue.quoteInput.proposerGender);
          this.annuityForm.get('proposalRelation').setValue(this.formValue.quoteInput.insuredRel);
        }
        this.annuityForm.get('dateOfBirthOnwords').setValue(this.formValue.quoteInput.insuredDob);
      }
      this.proinsuredCover = true;
      this.spouseCover = false;
      if (this.customerId) {
        if (this.customerDetails.gender === 'M') {
          this.proposerRelList = this.proposerRelList.filter((rel) => rel.id !== '3');
        } else if (this.customerDetails.gender === 'F') {
          this.proposerRelList = this.proposerRelList.filter((rel) => rel.id !== '2');
        }
        if (this.customerDetails.dependentList) {
          this.isDependentList = true;
          this.annuityForm.valueChanges.subscribe((checked) => {
            if (checked.proposalRelation === '2' || checked.proposalRelation === '3') {
              this.filterDependent = this.customerDetails.dependentList.filter((arr) => {
                if (arr.relationshipType === checked.proposalRelation) {
                  return arr;
                }
              });
              if (
                checked.proposalRelation === '2' &&
                checked.customerDependentList.relationshipType === checked.proposalRelation
              ) {
                this.annuityForm
                  .get('dateOfBirthOnwords')
                  .patchValue(checked.customerDependentList.dob, { emitEvent: false });
                this.annuityForm.get('gender').patchValue('F', { emitEvent: false });
                this.annuityForm.updateValueAndValidity({ emitEvent: false });
              } else if (
                checked.proposalRelation === '3' &&
                checked.customerDependentList.relationshipType === checked.proposalRelation
              ) {
                this.annuityForm
                  .get('dateOfBirthOnwords')
                  .patchValue(checked.customerDependentList.dob, { emitEvent: false });
                this.annuityForm.get('gender').patchValue('M', { emitEvent: false });
                this.annuityForm.updateValueAndValidity({ emitEvent: false });
              }
            } else if (checked.proposalRelation === '4') {
              this.filterDependent = this.customerDetails.dependentList.filter((arr) => {
                if (arr.relationshipType === '5' || arr.relationshipType === '4') {
                  return arr;
                }
              });
              if (checked.customerDependentList.relationshipType === '5') {
                this.annuityForm
                  .get('dateOfBirthOnwords')
                  .patchValue(checked.customerDependentList.dob, { emitEvent: false });
                this.annuityForm.get('gender').patchValue('M', { emitEvent: false });
                this.annuityForm.updateValueAndValidity({ emitEvent: false });
              } else if (checked.customerDependentList.relationshipType === '4') {
                this.annuityForm
                  .get('dateOfBirthOnwords')
                  .patchValue(checked.customerDependentList.dob, { emitEvent: false });
                this.annuityForm.get('gender').patchValue('F', { emitEvent: false });
                this.annuityForm.updateValueAndValidity({ emitEvent: false });
              }
            }
          });
        } else {
          this.isDependentList = false;
        }
        this.annuityForm.patchValue({
          praposerDateOfBirth: this.customerDetails.dob,
          proposerGender: this.customerDetails.gender,
        });
        this.disabled = false;
      }
      // this.annuityForm.removeControl('dateofbirthspouse');
      // this.annuityForm.removeControl('spouseGender');
    } else if (this.annuityForm.get('proInsured').value === 'yes') {
      if (this.quoteId) {
        this.annuityForm.get('dateOfBirth').setValue(this.formValue.quoteInput.insuredDob);
      }
      this.isProInsured = true;
      this.proinsuredCover = false;
      this.isDependentList = false;
      this.spouseCover = true;
      if (this.customerId) {
        this.annuityForm.patchValue({
          dateOfBirth: this.customerDetails.dob,
          gender: this.customerDetails.gender,
        });
        this.disabled = true;
        console.log(this.annuityForm.get('gender').value, 'vLUE gender');
      }
    } else {
      this.proinsuredCover = false;
      this.spouseCover = false;
      this.isJointlife = false;
    }
  }

  submitLifeQuote() {
    // this.isquoteLoading = true;
    this.loaderService.showSpinner(true);
    const lifeInsurance = {
      lob: 'Life',
      productType: 'ANN',
      pt: '0',
      ppt: '1',
      nri: this.annuityForm.get('nri').value,
      insuredGender: this.annuityForm.get('gender').value,
      mode: this.annuityForm.get('premiumPay').value,
      selectedMode: this.annuityForm.get('premiumPay').value,
      proposerDob:
        this.annuityForm.get('proInsured').value === 'no'
          ? this.annuityForm.get('praposerDateOfBirth').value
          : this.annuityForm.get('dateOfBirth').value,
      proposerGender:
        this.annuityForm.get('proInsured').value === 'no'
          ? this.annuityForm.get('proposerGender').value
          : this.annuityForm.get('gender').value,
      insuredDob:
        this.annuityForm.get('proInsured').value === 'no'
          ? this.annuityForm.get('dateOfBirthOnwords').value
          : this.annuityForm.get('dateOfBirth').value,
      insuredRel:
        this.annuityForm.get('spouse').value === true
          ? this.annuityForm.get('secondaryAnnutiRelation').value
          : '1',
      insuredRating: 'NS',
      pincode: 560030,
      payoutOption: 1,
      isJointLife: this.annuityForm.value.spouse,
      goal: 'Retirement',
      leadId: this.leadId,
      startType: 'ap',
      ap: this.annuityForm.get('investrate').value.toString().replace(/\D/g, '').replace(/^0+/, ''),
      // sa: this.annuityForm.get('investrate').value.toString().replace(/\D/g, '').replace(/^0+/, ''),
      // secInsuredDob: this.annuityForm.value.dateofbirthspouse,
      // secInsuredRel: this.annuityForm.value.secondaryAnnutiRelation,
      // secInsuredGender: this.annuityForm.get('spouseGender').value,
      // secInsuredRating: 'NS',
      defermentPeriod: this.annuityForm.value.annuityPeriod
        ? this.annuityForm.value.annuityPeriod
        : 0,
      // customerId: this.customerId ? this.customerId : 0,
    };

    if (this.annuityForm.value.spouse) {
      lifeInsurance['secInsuredDob'] = this.annuityForm.value.dateofbirthspouse;
      lifeInsurance['secInsuredRel'] = this.annuityForm.value.secondaryAnnutiRelation;
      lifeInsurance['secInsuredGender'] = this.annuityForm.get('spouseGender').value;
      lifeInsurance['secInsuredRating'] = 'NS';
    }
    if (this.formValue) {
      lifeInsurance['customerId'] = this.formValue?.quoteInput?.customerId;
    } else if (this.customerId) {
      lifeInsurance['customerId'] = +this.customerId;
    } else {
      lifeInsurance['customerId'] = 0;
    }
    this.QuoteServiceobj.submitLifeQuote(lifeInsurance).subscribe(
      (result) => {
        // this.isquoteLoading = false;
        this.loaderService.showSpinner(false);
        const quote = result;
        this.quoteId = quote['quoteId'];
        if (quote['numQuotesExpected'] > 0) {
          this.router.navigate(['/quote/quote-annuity', this.quoteId]);
          // this.router.navigate(['quote/quote-life-insurance'], { queryParams: { quoteId: this.quoteId } });
        } else {
          this.errorDataFound = true;
          // this.isquoteLoading = false;
          this.loaderService.showSpinner(false);
          this.errorDetail =
            'Oops.. We could not find any policies for you. you may have to adjust your search criteria.';
          this.MyProp.nativeElement.scrollIntoView({ behavior: 'smooth' });
        }
      },
      (error) => {
        this.errorDataFound = true;
        // this.isquoteLoading = false;
        this.loaderService.showSpinner(false);
        if (error.error.message !== '') {
          console.log('test');
          this.errorDetail = error.error.message;
        } else if (error.error.details !== undefined) {
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
    } else if (event === 'Spouse') {
      this.isShownSpouseFor = !this.isShownSpouseFor;
      if (this.isShownSpouseFor) {
        this.needHideSpouse = 'Hide help';
      } else {
        this.needHideSpouse = 'Need help?';
      }
    } else if (event === 'dobSpouse') {
      this.isShownDOBSpouseFor = !this.isShownDOBSpouseFor;
      if (this.isShownDOBSpouseFor) {
        this.needHideDOBSpouse = 'Hide help';
      } else {
        this.needHideDOBSpouse = 'Need help?';
      }
    }
  }

  get formError() {
    return this.annuityForm.controls;
  }

  inputEvent(date, control) {
    const moment = require('moment');
    const newDate = new Date(date.value);
    this.annuityForm.get(control).setValue(moment(newDate).format('YYYY-MM-DD'));
    if (control === 'dateOfBirthOnwords') {
      this.proposalChange();
    }
  }

  proposalChange() {
    this.annuityForm.valueChanges.subscribe((form) => {
      if (form.proposalRelation === '2' || form.proposalRelation === '3') {
        const timeDiff = Math.abs(
          Date.now() - new Date(this.annuityForm.get('dateOfBirthOnwords').value).getTime(),
        );
        const age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
        if (age < 18) {
          this.annuityForm.get('dateOfBirthOnwords').markAsPending();
          this.isAgeErro = true;
        } else {
          this.isAgeErro = false;
        }
      } else {
        this.annuityForm.get('dateOfBirthOnwords').markAsUntouched();
        this.isAgeErro = false;
      }
    });
  }

  setGender(event?) {
    const relId = this.annuityForm.get('secondaryAnnutiRelation').value;

    this.annuityForm
      .get('spouseGender')
      .setValue(this.proposerRelList.find((arr) => arr.id === relId).gender);

    // console.log('gender== ');
  }
}
