import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  selector: 'app-life-protection',
  templateUrl: './life-protection.component.html',
  styleUrls: ['./life-protection.component.css'],
})
export class LifeProtectionComponent implements OnInit {
  @ViewChild('noQuoteGenerated') MyProp: ElementRef;

  eighteenYearsProposer = new Date();

  eighteenYearsInsure = new Date();

  eighteenYearsSpouse = new Date();

  searchCtrl;

  lifeProtectionForm: FormGroup;

  isShownPolicyDescription = false;

  isShownPolicyFor = false;

  isShownpraposerGen = false;

  isShownsamePerson = false;

  isShownCoverage = false;

  isShownIdentityFor = false;

  helpTextWord = false;

  isShownInsuredSmokeFor = false;

  isShownSpouseFor = false;

  isShownDOBSpouseFor = false;

  isShownSmokeSpouseFor = false;

  isShownInsuredYearFor = false;

  isShownPPFor = false;

  isShownPPYearFor = false;

  isShownpinCodeLiveFor = false;

  isShownProposerGen = false;

  needHideCritical = 'Need help?';

  needHidePolicyFor = 'Need help?';

  needHideSamePerson = 'Need help?';

  needHideRelationship = 'Need help?';

  needHideDob = 'Need help?';

  needHidePincode = 'Need help?';

  needHideCoverage = 'Need help?';

  needHideidentity = 'Need help?';

  needHidepayment = 'Need help?';

  needHideInsuredSmoke = 'Need help?';

  needHideSpouse = 'Need help?';

  needHideDOBSpouse = 'Need help?';

  needHideSmokeSpouse = 'Need help?';

  needHideInsuredYear = 'Need help?';

  needHidePP = 'Need help?';

  needHidePPYear = 'Need help?';

  needHidepinCodeLive = 'Need help?';

  needHideProposerGen = 'Need help?';

  preferpayoutCover;

  policyFor = [
    { value: '', viewValue: 'Self' },
    { value: '', viewValue: 'Child' },
    { value: '', viewValue: 'Father' },
    { value: '', viewValue: 'Mother' },
    { value: '', viewValue: 'Spouse' },
  ];

  proposerRelList = [{ id: '1', value: 'Employer' }];

  payoutType;

  quoteId;

  leadId;

  quoteInput;

  nodatafound = false;

  errordatafound = false;

  errorDetail;

  proinsuredCover = false;

  spouseCover = false;

  isGuaranteed: true;

  isNonGuaranteed: false;

  formValue;

  isLoading;

  isquoteLoading;

  limitedPremiumPay = false;

  pattern1 = '^[0-9]{6,6}$';

  isJointlife = false;

  customerId;

  visible;

  assuredValue;

  customerDetails;

  isIndivisual;

  isSameProIns = true;

  addressPinCode;

  isSumAssuredErro = false;

  constructor(
    private QuoteServiceobj: QuoteService,
    private router: Router,
    private route: ActivatedRoute,
    private currencypipe: CurrencyPipe,
    public myElement: ElementRef,
    private loaderService: LoaderService,
  ) {
    this.eighteenYearsInsure.setFullYear(this.eighteenYearsInsure.getFullYear() - 18);
    this.eighteenYearsProposer.setFullYear(this.eighteenYearsProposer.getFullYear() - 18);
    this.eighteenYearsSpouse.setFullYear(this.eighteenYearsSpouse.getFullYear() - 18);
  }

  processMyValue() {
    console.log('this balie sum sassueed', this.lifeProtectionForm.get('sumassured').value);
    this.lifeProtectionForm
      .get('sumassured')
      .setValue(this.lifeProtectionForm.get('annualIncome').value * 15);
    // let sumInsuredNum = this.lifeProtectionForm
    //   .get('sumassured')
    //   .value.toString()
    //   .replace(/\D/g, '')
    //   .replace(/^0+/, '');
    // if (sumInsuredNum % 1000 !== 0) {
    //   sumInsuredNum -= sumInsuredNum % 1000;
    //   this.lifeProtectionForm.patchValue(
    //     {
    //       sumassured: this.currencypipe.transform(sumInsuredNum, 'INR', 'symbol', '1.0-0'),
    //     },
    //     { emitEvent: false },
    //   );
    // }
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.customerId = params.customerId;
      this.leadId = params.leadId;
    });

    this.lifeProtectionForm = new FormGroup({
      proInsured: new FormControl('', Validators.required),
      dateofbirth: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      sumassured: new FormControl(''),
      nri: new FormControl('', Validators.required),
      insuredSmoker: new FormControl('', Validators.required),
      annualIncome: new FormControl('', [
        Validators.required,
        Validators.min(180000),
        Validators.pattern('^[0-9]*$'),
        Validators.maxLength(9),
      ]),
      premiumYear: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.max(82),
      ]),
      policyTerm: new FormControl('RP', Validators.required),
      // payout: new FormControl(1, Validators.required),
      pincode: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(this.pattern1),
      ]),
      searchCtrl: new FormControl(''),
      premiumPay: new FormControl(''),
    });
    this.route.params.subscribe((params) => {
      console.log('life pro', params.customerId);
      if (params.customerId) {
        this.customerId = params.customerId;
        this.isSameProIns = false;
        this.QuoteServiceobj.getCustomerById(this.customerId).subscribe((result) => {
          this.customerDetails = result;
          if (this.customerDetails.individual === true) {
            this.lifeProtectionForm.get('proInsured').setValue('yes');
          } else {
            this.lifeProtectionForm.get('proInsured').setValue('no');
            this.lifeProtectionForm.get('proposalRelation').setValue('1');
          }
          this.proInsured();
          if (this.customerDetails?.addressList?.length > 0) {
            this.customerDetails.addressList.map((address) => {
              if (
                address.addressType === 'PERMANENT' ||
                address.addressType === 'CORRESPONDENCE' ||
                address.addressType === 'OFFICE'
              ) {
                this.lifeProtectionForm.get('pincode').setValue(address.postalcode);
              }
            });
          }
        });
      }
      if (params.quoteId) {
        this.quoteId = params.quoteId;
        // this.isLoading = true;
        this.loaderService.showSpinner(true);
        this.QuoteServiceobj.getLifeQuoteInputValue(this.quoteId).subscribe((finalQuoteRes) => {
          // this.isLoading = false;
          this.loaderService.showSpinner(false);
          this.formValue = finalQuoteRes;
          if (this.formValue.quoteInput.insuredRel === '1') {
            this.lifeProtectionForm.patchValue({
              proInsured: 'yes',
            });
            this.proInsured();
            if (this.formValue.quoteInput.isJointLife === false) {
              this.lifeProtectionForm.patchValue({
                spouse: false,
              });
            } else {
              this.lifeProtectionForm.patchValue({
                spouse: true,
                dateofbirthspouse: this.formValue?.quoteInput?.secInsuredDob,
                spouseSmoke: this.formValue?.quoteInput?.secInsuredRating,
              });
              this.isJointLife();
            }
          } else {
            this.lifeProtectionForm.patchValue({
              proInsured: 'no',
            });
            this.proInsured();
            this.lifeProtectionForm.patchValue({
              // praposerdateofbirth: this.formValue.quoteInput.proposerDob,
              // proposergender: this.formValue.quoteInput.proposerGender,
              proposalRelation: this.formValue.quoteInput.insuredRel,
            });
          }
          this.lifeProtectionForm.patchValue({
            dateofbirth: this.formValue.quoteInput.insuredDob,
            gender: this.formValue.quoteInput.insuredGender,
            investrate: this.formValue.quoteInput.ap,
            insuredSmoker: this.formValue.quoteInput.insuredRating,
            sumassured: this.formValue.quoteInput?.sa,
            annualIncome: this.formValue?.quoteInput?.annualIncome,
            premiumYear: this.formValue.quoteInput.pt,
            pincode: this.formValue.quoteInput.pincode,
            nri: this.formValue.quoteInput.nri,
            premiumPay: this.formValue?.quoteInput?.selectedMode.toString(),
          });
        });
      }
    });
    // this.proInsured(event);
    this.lifeProtectionForm.controls['sumassured'].valueChanges.subscribe((form) => {
      const sumAssuredVal = form.toString().replace(/\D/g, '').replace(/^0+/, '');
      if (form) {
        this.lifeProtectionForm.patchValue(
          {
            sumassured: this.currencypipe.transform(sumAssuredVal, 'INR', 'symbol', '1.0-0'),
          },
          { emitEvent: false },
        );
      }
    });
    this.lifeProtectionForm.controls['policyTerm'].valueChanges.subscribe((checked) => {
      if (checked === 'LP') {
        this.lifeProtectionForm.addControl(
          'paypremiumYear',
          new FormControl('', [
            Validators.required,
            Validators.pattern('^[0-9]*$'),
            Validators.min(5),
            Validators.max(50),
          ]),
        );
      } else {
        this.lifeProtectionForm.removeControl('paypremiumYear');
      }
      this.lifeProtectionForm.updateValueAndValidity();
    });

    this.lifeProtectionForm.controls['proInsured'].valueChanges.subscribe((checked) => {
      if (checked === 'yes') {
        this.lifeProtectionForm.addControl('spouse', new FormControl('', Validators.required));
        this.lifeProtectionForm.removeControl('proposalRelation');
      } else {
        this.lifeProtectionForm.removeControl('spouse');
        this.lifeProtectionForm.addControl(
          'proposalRelation',
          new FormControl('', Validators.required),
        );
      }
      this.lifeProtectionForm.updateValueAndValidity();
    });
    this.lifeProtectionForm.controls['dateofbirth'].valueChanges.subscribe((checked) => {
      if (checked) {
        // const moment = require('moment');
        console.log('ckehcled', checked, this.lifeProtectionForm.value.dateofbirth);

        // const newDate = this.lifeProtectionForm.value.dateofbirth;
        // moment(newDate).format('YYYY-MM-DD')
        // const ageDiff = Date.now() - newDate;
        // console.log('age diff', ageDiff);
        const timeDiff = Math.abs(
          Date.now() - new Date(this.lifeProtectionForm.value.dateofbirth).getTime(),
        );
        const age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
        console.log('age diff', timeDiff, age);

        if (timeDiff) {
          // const ageDate = new Date(ageDiff); // miliseconds from epoch
          // const age = Math.abs(ageDate.getUTCFullYear() - 1970);
          const age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
          console.log('age =', age, this.lifeProtectionForm.value);

          this.lifeProtectionForm.get('premiumYear').setValue(60 - age);
        }
      }
    });
    this.lifeProtectionForm.controls['sumassured'].valueChanges.subscribe((checked) => {
      const sumAssu = checked.toString().replace(/\D/g, '').replace(/^0+/, '');
      if (sumAssu === '' || sumAssu % 500000 !== 0) {
        this.lifeProtectionForm.get('sumassured').markAsPending();
        this.isSumAssuredErro = true;
      } else {
        this.isSumAssuredErro = false;
      }
    });

    // for Single

    // this.lifeProtectionForm.controls['policyTerm'].valueChanges.subscribe((checked) => {
    //   if (checked === 'RP' || 'LP') {
    //     this.lifeProtectionForm.addControl('premiumPay', new FormControl(Validators.required));
    //   } else {
    //     this.lifeProtectionForm.removeControl('premiumPay');
    //   }
    // });
  }

  // age() {
  //   const ageDiff = Date.now() - this.lifeProtectionForm.get('dateofbirth').value;
  //   console.log('age diiff', ageDiff)
  //   const ageDate = new Date(ageDiff); // miliseconds from epoch
  //   const age = Math.abs(ageDate.getUTCFullYear() - 1970);
  //   this.lifeProtectionForm.get('premiumYear').setValue(60 - age);
  //   console.log('form = ', this.lifeProtectionForm.value);
  // }

  proInsured() {
    if (this.lifeProtectionForm.get('proInsured').value === 'no') {
      this.proinsuredCover = true;
      this.spouseCover = false;
      if (this.customerId) {
        this.lifeProtectionForm.patchValue({
          gender: '',
          dateofbirth: '',
        });
      }
    } else {
      this.isJointlife = false;
      this.proinsuredCover = false;
      this.spouseCover = false;
      if (this.customerId) {
        // this.lifeProtectionForm.get('dateofbirth').setValue(this.customerDetails.dob);
        this.lifeProtectionForm.patchValue({
          dateofbirth: this.customerDetails.dob,
          gender: this.customerDetails.gender,
        });
        const timeDiff = Math.abs(
          Date.now() - new Date(this.lifeProtectionForm.value.dateofbirth).getTime(),
        );
        const age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
        console.log('age =', age, this.lifeProtectionForm.value);

        this.lifeProtectionForm.get('premiumYear').setValue(60 - age);
      }
    }
    if (this.lifeProtectionForm.get('proInsured').value === 'yes') {
      this.spouseCover = true;
      this.lifeProtectionForm.controls['spouse'].valueChanges.subscribe((checked) => {
        if (checked === true) {
          this.lifeProtectionForm.addControl(
            'dateofbirthspouse',
            new FormControl('', Validators.required),
          );
          this.lifeProtectionForm.addControl(
            'spouseSmoke',
            new FormControl('', Validators.required),
          );
        } else {
          this.lifeProtectionForm.removeControl('dateofbirthspouse');
          this.lifeProtectionForm.removeControl('spouseSmoke');
        }
        this.lifeProtectionForm.updateValueAndValidity();
      });
    } else {
      this.lifeProtectionForm.removeControl('dateofbirthspouse');
      this.lifeProtectionForm.removeControl('spouseSmoke');
      this.lifeProtectionForm.updateValueAndValidity();
    }
  }

  limitedPay() {
    console.log('this is form', this.lifeProtectionForm);

    if (this.lifeProtectionForm.get('policyTerm').value === 'LP') {
      this.limitedPremiumPay = true;
    } else {
      this.limitedPremiumPay = false;
    }

    if (this.lifeProtectionForm.get('policyTerm').value === 'RP' || 'LP') {
      this.lifeProtectionForm.addControl('premiumPay', new FormControl(Validators.required));
    } else {
      this.lifeProtectionForm.removeControl('premiumPay');
    }
  }

  isJointLife() {
    if (this.lifeProtectionForm.get('spouse').value === true) {
      this.isJointlife = true;
    } else {
      this.isJointlife = false;
    }
  }

  submitLifeQuote() {
    console.log('this is form', this.lifeProtectionForm.value);
    // this.isquoteLoading = true;
    this.loaderService.showSpinner(true);
    this.assuredValue = this.lifeProtectionForm
      .get('sumassured')
      .value.toString()
      .replace(/\D/g, '')
      .replace(/^0+/, '');
    const lifeProtection = {
      lob: 'Life',
      productType: 'TERM',
      insuredDob: this.lifeProtectionForm.value.dateofbirth,
      pincode: this.lifeProtectionForm.value.pincode,
      pt: this.lifeProtectionForm.value.premiumYear,
      goal: 'Protection',
      nri: this.lifeProtectionForm.get('nri').value,
      insuredRating: this.lifeProtectionForm.value.insuredSmoker,
      insuredGender: this.lifeProtectionForm.value.gender,
      // sa: this.lifeProtectionForm.value.annualIncome * 15,
      annualIncome: this.lifeProtectionForm.value.annualIncome,
      // sa: 10000000,
      selectedMode:
        this.lifeProtectionForm.get('policyTerm').value !== 'SP'
          ? this.lifeProtectionForm.get('premiumPay').value
          : 0,
      mode:
        this.lifeProtectionForm.get('policyTerm').value !== 'SP'
          ? this.lifeProtectionForm.get('premiumPay').value
          : 0,

      secInsuredRating: this.lifeProtectionForm.value.spouseSmoke,
      secInsuredDob: this.lifeProtectionForm.value.dateofbirthspouse,
      isJointLife: this.lifeProtectionForm.value.spouse,
      proposerGender: this.lifeProtectionForm.value.gender,
      // payoutOption: this.lifeProtectionForm.value.payout,
      proposerDob: this.lifeProtectionForm.value.dateofbirth,
      insuredRel:
        this.lifeProtectionForm.get('spouse').value == false
          ? '1'
          : this.lifeProtectionForm.get('gender').value === 'F'
          ? '3'
          : '2',
      // ppt:
      //   this.lifeProtectionForm.get('policyTerm').value === 'LP'
      //     ? this.lifeProtectionForm.get('paypremiumYear').value
      //     : this.lifeProtectionForm.get('premiumYear').value,
      secInsuredGender: this.lifeProtectionForm.get('gender').value === 'M' ? 'F' : 'M',
      // customerId: this.customerId ? +this.customerId : 0,
      leadId: this.leadId,
    };
    if (this.lifeProtectionForm.get('policyTerm').value === 'LP') {
      lifeProtection['ppt'] = this.lifeProtectionForm.get('paypremiumYear').value;
    } else if (this.lifeProtectionForm.get('policyTerm').value === 'RP') {
      lifeProtection['ppt'] = this.lifeProtectionForm.get('premiumYear').value;
    } else {
      lifeProtection['ppt'] = 1;
    }
    if (this.formValue) {
      lifeProtection['customerId'] = this.formValue?.quoteInput?.customerId;
    } else if (this.customerId) {
      lifeProtection['customerId'] = +this.customerId;
    } else {
      lifeProtection['customerId'] = 0;
    }
    if (this.lifeProtectionForm.get('sumassured').value !== '') {
      lifeProtection['sa'] = this.assuredValue;
    } else {
      console.log('im here');
      lifeProtection['sa'] = this.lifeProtectionForm.get('annualIncome').value * 15;
    }
    this.QuoteServiceobj.LifeProtectionQuote(lifeProtection).subscribe(
      (result) => {
        // this.isquoteLoading = false;
        this.loaderService.showSpinner(false);
        const quote = result;
        this.quoteId = quote['quoteId'];
        if (quote['numQuotesExpected'] > 0) {
          // this.router.navigate(['quote/quote-life-protection'], { queryParams: { quoteId: this.quoteId } });
          this.router.navigate(['quote/quote-life-protection', this.quoteId]);
        } else {
          this.errordatafound = true;
          // this.isquoteLoading = false;
          this.loaderService.showSpinner(false);
          this.errorDetail =
            'Oops.. We could not find any policies for you. you may have to adjust your search criteria.';
          this.MyProp.nativeElement.scrollIntoView({ behavior: 'smooth' });
        }
      },
      (error) => {
        this.errordatafound = true;
        // this.isquoteLoading = false;
        this.loaderService.showSpinner(false);
        if (error.error.details !== undefined && error.error.details !== '') {
          this.errorDetail = error.error.details;
        } else if (error.error.message !== '') {
          this.errorDetail = error.error.message;
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
    } else if (event === 'same_person') {
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
    } else if (event === 'pro_gen') {
      this.isShownpraposerGen = !this.isShownpraposerGen;
      if (this.isShownpraposerGen) {
        this.needHideRelationship = 'Hide help';
      } else {
        this.needHideRelationship = 'Need help?';
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
    } else if (event === 'insuredSmoke') {
      this.isShownInsuredSmokeFor = !this.isShownInsuredSmokeFor;
      if (this.isShownInsuredSmokeFor) {
        this.needHideInsuredSmoke = 'Hide help';
      } else {
        this.needHideInsuredSmoke = 'Need help?';
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
    } else if (event === 'SpouseSmoke') {
      this.isShownSmokeSpouseFor = !this.isShownSmokeSpouseFor;
      if (this.isShownSmokeSpouseFor) {
        this.needHideSmokeSpouse = 'Hide help';
      } else {
        this.needHideSmokeSpouse = 'Need help?';
      }
    } else if (event === 'Insuredyear') {
      this.isShownInsuredYearFor = !this.isShownInsuredYearFor;
      if (this.isShownInsuredYearFor) {
        this.needHideInsuredYear = 'Hide help';
      } else {
        this.needHideInsuredYear = 'Need help?';
      }
    } else if (event === 'PP') {
      this.isShownPPFor = !this.isShownPPFor;
      if (this.isShownPPFor) {
        this.needHidePP = 'Hide help';
      } else {
        this.needHidePP = 'Need help?';
      }
    } else if (event === 'PPYear') {
      this.isShownPPYearFor = !this.isShownPPYearFor;
      if (this.isShownPPYearFor) {
        this.needHidePPYear = 'Hide help';
      } else {
        this.needHidePPYear = 'Need help?';
      }
    } else if (event === 'pinCodeLive') {
      this.isShownpinCodeLiveFor = !this.isShownpinCodeLiveFor;
      if (this.isShownpinCodeLiveFor) {
        this.needHidepinCodeLive = 'Hide help';
      } else {
        this.needHidepinCodeLive = 'Need help?';
      }
    } else if (event === 'proposergen') {
      this.isShownProposerGen = !this.isShownProposerGen;
      if (this.isShownProposerGen) {
        this.needHideProposerGen = 'Hide help';
      } else {
        this.needHideProposerGen = 'Need help?';
      }
    }
  }

  get formControls() {
    return this.lifeProtectionForm.controls;
  }

  inputEvent(date, control) {
    const moment = require('moment');
    const newDate = new Date(date.value);
    this.lifeProtectionForm.get(control).setValue(moment(newDate).format('YYYY-MM-DD'));
  }
}
