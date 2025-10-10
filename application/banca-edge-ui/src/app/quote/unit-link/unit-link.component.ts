import { CurrencyPipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '@app/_services/loader.service';
import { QuoteService } from '../quote.service';

@Component({
  selector: 'app-unit-link',
  templateUrl: './unit-link.component.html',
  styleUrls: ['./unit-link.component.css'],
})
export class UnitLinkComponent implements OnInit {
  investments = [
    { value: 'savings', viewValue: 'Savings' },
    { value: 'retirement', viewValue: 'Retirement' },
    { value: 'income', viewValue: 'Income' },
  ];

  years = [
    { value: '5-9', viewValue: '5-9' },
    { value: '10-15', viewValue: '10-15' },
    { value: '16-20', viewValue: '16-20' },
    { value: '20-25', viewValue: '20-25' },
    { value: '26-90', viewValue: '> 25' },
  ];

  premiumYears = [
    { value: '5-9', viewValue: '5-9' },
    { value: '10-15', viewValue: '10-15' },
    { value: '16-20', viewValue: '16-20' },
    { value: '20-25', viewValue: '20-25' },
    { value: '26-90', viewValue: '> 25' },
  ];

  @ViewChild('noQuoteGenerated') MyProp: ElementRef;

  eighteenYearsProposer = new Date();

  eighteenYearsInsure = new Date();

  thirtyDayOnwords = new Date();

  greaterThanHundred = new Date();

  searchCtrl;

  savingstraditionalForm: FormGroup;

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
  // = [
  //   { id: '2', value: 'Husband' },
  //   { id: '3', value: 'Wife' },
  //   { id: '4', value: 'Parent' },
  // ];

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

  startTypeCover;

  suminsuredValue;

  isProInsured = false;

  isAgeErro = false;

  isDependentList;

  filterDependent;

  isSonDaughter;

  numExpected;

  disabled = false;

  ispayPremiumFor = false;

  premiumYearsCopy;

  minPPT;

  maxPPT;

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
  }

  ngOnInit(): void {
    this.QuoteServiceobj.getInsuredRelationship('Life', 'ULIP').subscribe((relationship) => {
      console.log('printing realtiosnhip', relationship);
      this.proposerRelList = relationship;
    });
    this.route.params.subscribe((params) => {
      this.customerId = params.customerId;
      this.leadId = params.leadId;
    });
    this.premiumYearsCopy = this.premiumYears;
    this.savingstraditionalForm = new FormGroup({
      proInsured: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      nri: new FormControl('', Validators.required),
      premiumPay: new FormControl('', Validators.required),
      startType: new FormControl('', Validators.required),
      customerDependentList: new FormControl(''),
      searchCtrl: new FormControl(''),
      investmentGoal: new FormControl('', Validators.required),
      approxYear: new FormControl('', Validators.required),
      // payoutType: new FormControl('', Validators.required),
    });
    this.route.params.subscribe((qParams) => {
      if (qParams.customerId) {
        this.customerId = qParams.customerId;
        this.QuoteServiceobj.getCustomerById(this.customerId).subscribe((result) => {
          this.customerDetails = result;
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
          if (this.formValue.quoteInput.insuredRel === '1') {
            this.savingstraditionalForm.patchValue({
              proInsured: 'yes',
            });
            this.proInsured();
            this.savingstraditionalForm.patchValue({
              dateOfBirth: this.formValue.quoteInput.insuredDob,
            });
          } else {
            this.savingstraditionalForm.patchValue({
              proInsured: 'no',
            });
            this.proInsured();
            this.savingstraditionalForm.patchValue({
              dateOfBirthOnwords: this.formValue.quoteInput.insuredDob,
            });
          }
          if (this.formValue.quoteInput.startType === 'sa') {
            this.savingstraditionalForm.patchValue({
              startType: this.formValue.quoteInput.startType,
            });
            this.startTypeInsured();
            this.savingstraditionalForm.patchValue({
              sumInsured: this.formValue.quoteInput.sa,
            });
          } else {
            this.savingstraditionalForm.patchValue({
              startType: this.formValue.quoteInput.startType,
            });
            this.startTypeInsured();
            this.savingstraditionalForm.patchValue({
              sumInsured: this.formValue.quoteInput.ap,
            });
          }
          if (this.formValue.quoteInput.minPT === 5) {
            this.savingstraditionalForm.get('approxYear').setValue('5-9');
          } else if (this.formValue.quoteInput.minPT === 10) {
            this.savingstraditionalForm.get('approxYear').setValue('10-15');
          } else if (this.formValue.quoteInput.minPT === 16) {
            this.savingstraditionalForm.get('approxYear').setValue('16-20');
          } else if (this.formValue.quoteInput.minPT === 20) {
            this.savingstraditionalForm.get('approxYear').setValue('20-25');
          } else if (this.formValue.quoteInput.minPT == 26) {
            this.savingstraditionalForm.get('approxYear').setValue('26-90');
          }
          this.checkPayPremiumFor();

          this.savingstraditionalForm.patchValue({
            gender: this.formValue.quoteInput.insuredGender,
            investrate: this.formValue.quoteInput.ap,
            proposalRelation: this.formValue.quoteInput.insuredRel,
            praposerDateOfBirth: this.formValue.quoteInput.proposerDob,
            proposerGender: this.formValue.quoteInput.proposerGender,
            premiumPay: this.formValue.quoteInput.selectedMode
              ? this.formValue?.quoteInput?.selectedMode.toString()
              : '1',
            investmentGoal: this.formValue?.quoteInput?.goal,
            nri: this.formValue?.quoteInput?.nri,
            // payoutType: this.formValue?.quoteInput?.payoutType.toString(),
          });

          if (this.formValue?.quoteInput?.selectedMode !== 0) {
            this.ispayPremiumFor = true;
            this.savingstraditionalForm.addControl(
              'payPremiumFor',
              new FormControl('', Validators.required),
            );
            if (this.formValue.quoteInput.minPPT === 5) {
              this.savingstraditionalForm.get('payPremiumFor').setValue('5-9');
            } else if (this.formValue.quoteInput.minPPT === 10) {
              this.savingstraditionalForm.get('payPremiumFor').setValue('10-15');
            } else if (this.formValue.quoteInput.minPPT === 16) {
              this.savingstraditionalForm.get('payPremiumFor').setValue('16-20');
            } else if (this.formValue.quoteInput.minPPT === 20) {
              this.savingstraditionalForm.get('payPremiumFor').setValue('20-25');
            } else if (this.formValue.quoteInput.minPPT == 26) {
              this.savingstraditionalForm.get('payPremiumFor').setValue('26-90');
            }
          }
        });
        this.savingstraditionalForm.controls['gender'].disable();
      }
    });

    this.savingstraditionalForm.controls['proInsured'].valueChanges.subscribe((checked) => {
      if (checked === 'yes') {
        this.savingstraditionalForm.addControl(
          'dateOfBirth',
          new FormControl('', Validators.required),
        );
        this.savingstraditionalForm.removeControl('dateOfBirthOnwords');
        this.savingstraditionalForm.removeControl('praposerDateOfBirth');
        this.savingstraditionalForm.removeControl('proposerGender');
        this.savingstraditionalForm.removeControl('proposalRelation');
        if (this.proposerRelList?.findIndex((rel) => rel.id === '1') === -1) {
          this.proposerRelList.splice(0, { id: '1', value: 'Self' });
        }
      } else {
        this.savingstraditionalForm.addControl(
          'dateOfBirthOnwords',
          new FormControl('', Validators.required),
        );
        this.savingstraditionalForm.removeControl('dateOfBirth');
        this.savingstraditionalForm.addControl(
          'praposerDateOfBirth',
          new FormControl('', Validators.required),
        );
        this.savingstraditionalForm.addControl(
          'proposerGender',
          new FormControl('', Validators.required),
        );
        this.savingstraditionalForm.addControl(
          'proposalRelation',
          new FormControl('', Validators.required),
        );
        if (this.proposerRelList.findIndex((rel) => rel.id === '1') > -1) {
          const selfIndex = this.proposerRelList.findIndex((rel) => rel.id === '1');
          this.proposerRelList.splice(selfIndex, 1);
        }
      }

      this.savingstraditionalForm.updateValueAndValidity();
    });
    this.savingstraditionalForm.controls['startType'].valueChanges.subscribe((checked) => {
      if (checked === 'sa') {
        this.savingstraditionalForm.addControl(
          'sumInsured',
          new FormControl('', [
            Validators.required,
            Validators.min(100000),
            Validators.max(5000000),
          ]),
        );
      } else {
        this.savingstraditionalForm.removeControl('sumInsured');
      }
      if (checked === 'ap') {
        this.savingstraditionalForm.addControl(
          'investrate',
          new FormControl('', [
            Validators.required,
            Validators.min(40000),
            Validators.max(100000000),
          ]),
        );
      } else {
        this.savingstraditionalForm.removeControl('investrate');
      }
      this.savingstraditionalForm.updateValueAndValidity();
    });
  }

  showGolaYears(event) {
    console.log('event', event, this.savingstraditionalForm.value);
    if (event.value == 0) {
      this.ispayPremiumFor = false;
      this.savingstraditionalForm.removeControl('payPremiumFor');
    } else {
      this.ispayPremiumFor = true;
      this.savingstraditionalForm.addControl(
        'payPremiumFor',
        new FormControl('', Validators.required),
      );
    }
  }

  startTypeInsured() {
    if (this.savingstraditionalForm.get('startType').value === 'sa') {
      this.startTypeCover = true;
      this.savingstraditionalForm.controls['sumInsured'].valueChanges.subscribe((form) => {
        const sumAsuuredPremium = form.toString().replace(/\D/g, '').replace(/^0+/, '');
        if (form) {
          this.savingstraditionalForm.patchValue(
            {
              sumInsured: this.currencypipe.transform(sumAsuuredPremium, 'INR', 'symbol', '1.0-0'),
            },
            { emitEvent: false },
          );
        }
      });
    } else if (this.savingstraditionalForm.get('startType').value === 'ap') {
      this.startTypeCover = false;
      this.savingstraditionalForm.controls['investrate'].valueChanges.subscribe((form) => {
        const sumAssuredVal = form.toString().replace(/\D/g, '').replace(/^0+/, '');
        if (form) {
          this.savingstraditionalForm.patchValue(
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
    let sumInsuredNum = this.savingstraditionalForm
      .get('investrate')
      .value.toString()
      .replace(/\D/g, '')
      .replace(/^0+/, '');
    if (sumInsuredNum % 100 !== 0) {
      sumInsuredNum -= sumInsuredNum % 100;
      this.savingstraditionalForm.patchValue(
        {
          investrate: this.currencypipe.transform(sumInsuredNum, 'INR', 'symbol', '1.0-0'),
        },
        { emitEvent: false },
      );
    }
  }

  processInsuredValue() {
    let premiumAsuuredNum = this.savingstraditionalForm
      .get('sumInsured')
      .value.toString()
      .replace(/\D/g, '')
      .replace(/^0+/, '');
    if (premiumAsuuredNum % 1000 !== 0) {
      premiumAsuuredNum -= premiumAsuuredNum % 1000;
      this.savingstraditionalForm.patchValue(
        {
          sumInsured: this.currencypipe.transform(premiumAsuuredNum, 'INR', 'symbol', '1.0-0'),
        },
        { emitEvent: false },
      );
    }
  }

  proInsured() {
    if (this.savingstraditionalForm.get('proInsured').value === 'no') {
      if (this.quoteId) {
        if (this.formValue.quoteInput.insuredRel === '1') {
          this.savingstraditionalForm
            .get('praposerDateOfBirth')
            .setValue(this.formValue.quoteInput.insuredDob);
          this.savingstraditionalForm
            .get('proposerGender')
            .setValue(this.formValue.quoteInput.insuredGender);
        } else {
          this.savingstraditionalForm
            .get('praposerDateOfBirth')
            .setValue(this.formValue.quoteInput.proposerDob);
          this.savingstraditionalForm
            .get('proposerGender')
            .setValue(this.formValue.quoteInput.proposerGender);
          this.savingstraditionalForm
            .get('proposalRelation')
            .setValue(this.formValue.quoteInput.insuredRel);
        }
        this.savingstraditionalForm
          .get('dateOfBirthOnwords')
          .setValue(this.formValue.quoteInput.insuredDob);
      }
      this.proinsuredCover = true;
      if (this.customerId) {
        if (this.customerDetails.gender === 'M') {
          this.proposerRelList = this.proposerRelList.filter((rel) => rel.id !== '3');
        } else if (this.customerDetails.gender === 'F') {
          this.proposerRelList = this.proposerRelList.filter((rel) => rel.id !== '2');
        }
        if (this.customerDetails.dependentList) {
          this.isDependentList = true;
          this.savingstraditionalForm.valueChanges.subscribe((checked) => {
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
                this.savingstraditionalForm
                  .get('dateOfBirthOnwords')
                  .patchValue(checked.customerDependentList.dob, { emitEvent: false });
                this.savingstraditionalForm.get('gender').patchValue('F', { emitEvent: false });
                this.savingstraditionalForm.updateValueAndValidity({ emitEvent: false });
              } else if (
                checked.proposalRelation === '3' &&
                checked.customerDependentList.relationshipType === checked.proposalRelation
              ) {
                this.savingstraditionalForm
                  .get('dateOfBirthOnwords')
                  .patchValue(checked.customerDependentList.dob, { emitEvent: false });
                this.savingstraditionalForm.get('gender').patchValue('M', { emitEvent: false });
                this.savingstraditionalForm.updateValueAndValidity({ emitEvent: false });
              }
            } else if (checked.proposalRelation === '4') {
              this.filterDependent = this.customerDetails.dependentList.filter((arr) => {
                if (arr.relationshipType === '5' || arr.relationshipType === '4') {
                  return arr;
                }
              });
              if (checked.customerDependentList.relationshipType === '5') {
                this.savingstraditionalForm
                  .get('dateOfBirthOnwords')
                  .patchValue(checked.customerDependentList.dob, { emitEvent: false });
                this.savingstraditionalForm.get('gender').patchValue('M', { emitEvent: false });
                this.savingstraditionalForm.updateValueAndValidity({ emitEvent: false });
              } else if (checked.customerDependentList.relationshipType === '4') {
                this.savingstraditionalForm
                  .get('dateOfBirthOnwords')
                  .patchValue(checked.customerDependentList.dob, { emitEvent: false });
                this.savingstraditionalForm.get('gender').patchValue('F', { emitEvent: false });
                this.savingstraditionalForm.updateValueAndValidity({ emitEvent: false });
              }
            }
          });
        } else {
          this.isDependentList = false;
        }
        this.savingstraditionalForm.patchValue({
          praposerDateOfBirth: this.customerDetails.dob,
          proposerGender: this.customerDetails.gender,
        });
        this.disabled = false;
      }
    } else if (this.savingstraditionalForm.get('proInsured').value === 'yes') {
      if (this.quoteId) {
        this.savingstraditionalForm
          .get('dateOfBirth')
          .setValue(this.formValue.quoteInput.insuredDob);
      }
      this.isProInsured = true;
      this.proinsuredCover = false;
      this.isDependentList = false;
      if (this.customerId) {
        this.savingstraditionalForm.patchValue({
          dateOfBirth: this.customerDetails.dob,
          gender: this.customerDetails.gender,
        });
        this.disabled = true;
      }
    } else {
      this.proinsuredCover = false;
    }
  }

  checkPayPremiumFor() {
    let approxYear = this.savingstraditionalForm.get('approxYear').value;
    switch (approxYear) {
      case '5-9':
        this.premiumYearsCopy = this.premiumYears.slice(0, 1);
        break;
      case '10-15':
        this.premiumYearsCopy = this.premiumYears.slice(0, 2);
        break;
      case '16-20':
        this.premiumYearsCopy = this.premiumYears.slice(0, 3);
        break;
      case '20-25':
        this.premiumYearsCopy = this.premiumYears.slice(0, 4);
        break;
      case '26-90':
        this.premiumYearsCopy = this.premiumYears.slice(0, 5);
        break;
    }
    console.log('checking', approxYear, this.premiumYears);
  }

  submitLifeQuote() {
    if (this.savingstraditionalForm.get('payPremiumFor')?.value) {
      const minValuePayPremiumFor = this.savingstraditionalForm.get('payPremiumFor')?.value;
      const payPremiumArray = minValuePayPremiumFor.split('-');
      this.minPPT = payPremiumArray[0];
      this.maxPPT = payPremiumArray[1];
    }
    const minValueApproxYear = this.savingstraditionalForm.get('approxYear').value;
    const approxYearArray = minValueApproxYear.split('-');
    const minPT = approxYearArray[0];
    const maxPT = approxYearArray[1];

    const disaledFormvalue = this.savingstraditionalForm.getRawValue();
    // this.isquoteLoading = true;
    this.loaderService.showSpinner(true);
    const lifeInsurance = {
      lob: 'Life',
      productType: 'ULIP',
      startType: this.savingstraditionalForm.value.startType,
      insuredGender: disaledFormvalue.gender,
      mode: this.savingstraditionalForm.value.premiumPay,
      nri: this.savingstraditionalForm.get('nri').value,
      selectedMode: this.savingstraditionalForm.value.premiumPay,
      proposerDob:
        this.savingstraditionalForm.get('proInsured').value === 'no'
          ? this.savingstraditionalForm.get('praposerDateOfBirth').value
          : this.savingstraditionalForm.get('dateOfBirth').value,
      proposerGender:
        this.savingstraditionalForm.get('proInsured').value === 'no'
          ? this.savingstraditionalForm.get('proposerGender').value
          : this.savingstraditionalForm.get('gender').value,
      insuredDob:
        this.savingstraditionalForm.get('proInsured').value === 'no'
          ? this.savingstraditionalForm.get('dateOfBirthOnwords').value
          : this.savingstraditionalForm.get('dateOfBirth').value,
      insuredRel:
        this.savingstraditionalForm.get('proInsured').value === 'no'
          ? this.savingstraditionalForm.get('proposalRelation').value
          : '1',
      insuredRating: 'NS',
      pincode: 560030,
      isJointLife: false,
      leadId: this.leadId,
      goal: this.savingstraditionalForm.value.investmentGoal,
      minPT: minPT,
      maxPT: maxPT,
      minPPT: this.minPPT ? this.minPPT : '1',
      maxPPT: this.maxPPT ? this.maxPPT : '1',
      // payoutType: +this.savingstraditionalForm.value.payoutType,
      // customerId: this.customerId ? this.customerId : 0,
    };
    if (this.formValue) {
      lifeInsurance['customerId'] = this.formValue?.quoteInput?.customerId;
    } else if (this.customerId) {
      lifeInsurance['customerId'] = this.customerId;
    } else {
      lifeInsurance['customerId'] = 0;
    }
    if (this.savingstraditionalForm.get('startType').value === 'sa') {
      this.suminsuredValue = this.savingstraditionalForm
        .get('sumInsured')
        .value.toString()
        .replace(/\D/g, '')
        .replace(/^0+/, '');
      lifeInsurance['ap'] = this.suminsuredValue;
    } else {
      this.insuredValue = this.savingstraditionalForm
        .get('investrate')
        .value.toString()
        .replace(/\D/g, '')
        .replace(/^0+/, '');
      lifeInsurance['ap'] = this.insuredValue;
    }

    this.QuoteServiceobj.submitLifeQuote(lifeInsurance).subscribe(
      (result) => {
        // this.isquoteLoading = false;
        this.loaderService.showSpinner(false);
        const quote = result;
        this.quoteId = quote['quoteId'];
        if (quote['numQuotesExpected'] > 0) {
          this.router.navigate(['/quote/quote-unit-link', this.quoteId]);
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
    }
  }

  get formError() {
    return this.savingstraditionalForm.controls;
  }

  inputEvent(date, control) {
    const moment = require('moment');
    const newDate = new Date(date.value);
    this.savingstraditionalForm.get(control).setValue(moment(newDate).format('YYYY-MM-DD'));
    if (control === 'dateOfBirthOnwords') {
      this.proposalChange();
    }
  }

  proposalChange(event?) {
    this.savingstraditionalForm.valueChanges.subscribe((form) => {
      if (form.proposalRelation === '2' || form.proposalRelation === '3') {
        const timeDiff = Math.abs(
          Date.now() -
            new Date(this.savingstraditionalForm.get('dateOfBirthOnwords').value).getTime(),
        );
        const age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
        if (age < 18) {
          this.savingstraditionalForm.get('dateOfBirthOnwords').markAsPending();
          this.isAgeErro = true;
        } else {
          this.isAgeErro = false;
        }
      } else {
        this.savingstraditionalForm.get('dateOfBirthOnwords').markAsUntouched();
        this.isAgeErro = false;
      }
    });
    const gender = this.proposerRelList.find((rel) => rel.id === event.value).gender;
    this.savingstraditionalForm.get('gender').setValue(gender);
    this.savingstraditionalForm.updateValueAndValidity();
    this.savingstraditionalForm.controls['gender'].disable();
  }
}
