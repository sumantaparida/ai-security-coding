import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { QuoteService } from '../quote.service';
import { LoaderService } from '@app/_services/loader.service';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.

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
  selector: 'app-motor-insurance',
  templateUrl: './motor-insurance.component.html',
  styleUrls: ['./motor-insurance.component.css'],
})
export class MotorInsuranceComponent implements OnInit {
  // date = new FormControl(moment([2017, 0, 1]));
  @ViewChild('noQuoteGenerated') MyProp: ElementRef;

  searchCtrl;

  past = new Date();

  past1 = new Date();

  endDate = new Date();

  renewDate = new Date();

  currentAndFutureday = new Date();

  lob: string;

  policies: string;

  isRegError;

  regMonth: string;

  regYear: string;

  criticalIllnessForm: FormGroup;

  isShownPolicyDescription = false;

  isShowndetail = false;

  isShownClaimyear = false;

  isShownPolicyType = false;

  isShownPincode = false;

  isShownPolicyCover = false;

  isShownYearManufactured = false;

  isShownRegDate = false;

  isShownRTOVehical = false;

  isShownPolicyEnd = false;

  isShownNoClaim = false;

  isShownDeductible = false;

  isShownPolicyFor = false;

  isShownExistingCover = false;

  isShownDob = false;

  helpTextWord = false;

  needHideMotorDetails = 'Need help?';

  needHidePolicyFor = 'Need help?'; // 3

  needHidePolicyType = 'Need help?'; // 1

  needHidePolicyCover = 'Need help?';

  needHideYearManufactured = 'Need help?';

  needHideRegDate = 'Need help?';

  needHideRTOVehical = 'Need help?';

  needHidePolicyEnd = 'Need help?';

  needHideNoClaim = 'Need help?';

  needHidePolicyExistingCover = 'Need help?'; // 2a

  enhanceExistingCover = true;

  renewPolicyCover;

  needHideDetails = 'Need help?';

  needHidePincode = 'Need help?';

  needHideClaimyear = 'Need help?';

  needHideDeductible = 'Need help?';

  isDialogOpened = false;

  errorDetail;

  noClaimBonus = [
    { value: '0', viewValue: '0%' },
    { value: '20', viewValue: '20%' },
    { value: '25', viewValue: '25%' },
    { value: '35', viewValue: '35%' },
    { value: '45', viewValue: '45%' },
    { value: '50', viewValue: '50%' },
  ];

  vehicalCoverOption = [
    { value: 'PC', viewValue: 'Private Car' },
    { value: 'TW', viewValue: 'Two Wheeler' },
  ];

  coverTypes = [
    {
      value: 'COMP',
      viewValue: 'Comprehensive',
    },
    {
      value: 'OD',
      viewValue: 'Own Damage',
    },
    {
      value: 'TP',
      viewValue: 'Third Party',
    },
  ];

  optionVehical;

  constructor(
    public dialog: MatDialog,
    private QuoteServiceobj: QuoteService,
    private router: Router,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
  ) {
    this.past.setDate(this.past.getDate());
    this.past1.setDate(this.past1.getDate() + 0);
    this.endDate.setDate(this.endDate.getDate() + 45);
    this.renewDate.setDate(this.renewDate.getDate() + 0);
    this.currentAndFutureday.setDate(this.currentAndFutureday.getDate() + 10);
  }

  value = '';

  allMakeVehical;

  allModelVehical;

  allvariantVehical;

  getAllRtos;

  motorInsuranceForm: FormGroup;

  quoteId;

  leadId;

  quoteInput;

  nodatafound = false;

  errordatafound = false;

  formValue;

  policyEnddate;

  showOptions = false;

  isLoading;

  errorPolicyEndDate = false;

  finalCurrentDate;

  customerId;

  regLabelNeedText;

  manufactureYear = new Date().getFullYear();

  isYearErro = false;

  isRenewYearError = false;

  vehicleManufacture;

  vehicalRegRenewYear;

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.customerId = params.customerId;
      this.leadId = params.leadId;
    });

    this.motorInsuranceForm = new FormGroup({
      hasRegsNum: new FormControl(''),
      coverType: new FormControl(''),
      policy: new FormControl('', Validators.required),
      makeVehical: new FormControl('', Validators.required),
      modelVehical: new FormControl('', Validators.required),
      vehicalVarient: new FormControl('', Validators.required),
      year: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.minLength(4),
      ]),
      vahicalRto: new FormControl('', Validators.required),
      searchCtrl: new FormControl(''),
    });
    this.motorInsuranceForm.controls['year'].valueChanges.subscribe((checked) => {
      this.vehicleManufacture = checked;
      if (checked > this.manufactureYear) {
        this.motorInsuranceForm.get('year').markAsPending();
        this.isYearErro = true;
      } else {
        this.isYearErro = false;
      }
      if (this.vehicleManufacture > this.vehicalRegRenewYear) {
        this.inputEvent(this.vehicalRegRenewYear, 'vehicalRegRenew');
        this.motorInsuranceForm.get('year').markAsPending();
        this.isRenewYearError = true;
      } else {
        this.isRenewYearError = false;
      }
    });
    this.route.params.subscribe((params) => {
      console.log('motor test', params);
      if (params.customerId) {
        this.customerId = params.customerId;
      }
    });
    this.route.params.subscribe((params) => {
      if (params.customerId) {
        this.customerId = params.customerId;
      }
      if (params.quoteId) {
        this.quoteId = params.quoteId;
        // this.isLoading = true;
        this.loaderService.showSpinner(true);
        this.QuoteServiceobj.backToQuote(this.quoteId).subscribe((finalQuoteRes) => {
          // this.isLoading = false;
          this.loaderService.showSpinner(false);
          this.formValue = finalQuoteRes;
          this.motorInsuranceForm.get('hasRegsNum').setValue('NRG');
          this.showOptions = true;
          this.getAllPCMakes();
          this.getPCModelsForMake(this.formValue.quoteInput.makeId);
          this.getPCVariantsForMakeAndModel(
            this.formValue.quoteInput.makeId,
            this.formValue.quoteInput.modelId,
          );
          const todayDate = new Date();
          const currentYear = todayDate.getFullYear();
          const currentMonth = ('0' + (todayDate.getMonth() + 1)).slice(-2);
          const currentdt = ('0' + todayDate.getDate()).slice(-2);
          this.finalCurrentDate = currentYear + '-' + currentMonth + '-' + currentdt;
          const enddatePolicy = new Date(this.formValue.quoteInput.prevPolicyEndDate);
          const policyyear = enddatePolicy.getFullYear();
          const policymonth = ('0' + (enddatePolicy.getMonth() + 1)).slice(-2);
          const policydt = ('0' + enddatePolicy.getDate()).slice(-2);
          this.policyEnddate = policyyear + '-' + policymonth + '-' + policydt;
          if (this.policyEnddate < this.finalCurrentDate) {
            this.errorPolicyEndDate = true;
          }
          if (this.formValue.quoteInput.policyType === 'RO') {
            this.motorInsuranceForm.patchValue({
              policy: this.formValue.quoteInput.policyType,
            });
            this.renewPolicy();
            this.motorInsuranceForm.patchValue({
              // vehical_insured: this.formValue.quoteInput.productType,
              coverType: this.formValue.quoteInput.coverType,
              makeVehical: this.formValue.quoteInput.makeId.toString(),
              modelVehical: this.formValue.quoteInput.modelId.toString(),
              vehicalVarient: this.formValue.quoteInput.varId.toString(),
              year: this.formValue.quoteInput.yom,
              vehicalRegRenew: this.formValue.quoteInput.dateOfRegistration,
              vahicalRto: this.formValue.quoteInput.rtoCode,
              endDate: this.policyEnddate,
              noClaim: this.formValue.quoteInput.currNcb,
              currentYear: this.formValue.quoteInput.currClaim,
            });
          } else {
            this.motorInsuranceForm.patchValue({
              policy: this.formValue.quoteInput.policyType,
            });

            this.renewPolicy();
            this.motorInsuranceForm.patchValue({
              coverType: this.formValue.quoteInput.coverType,
              makeVehical: this.formValue.quoteInput.makeId.toString(),
              modelVehical: this.formValue.quoteInput.modelId.toString(),
              vehicalVarient: this.formValue.quoteInput.varId.toString(),
              year: this.formValue.quoteInput.yom,
              vehicalRegNew: this.formValue.quoteInput.dateOfRegistration,
              vahicalRto: this.formValue.quoteInput.rtoCode,
            });
          }
          // this.QuoteServiceobj.getAllPCMakes().subscribe((res) => {
          //   // when someone want to give the data then we need to get data is called subscribe.
          //   // subscribe is a Method.
          //   this.allMakeVehical = res;
          //   // tslint:disable-next-line: forin
          //   for (const key in this.allMakeVehical) {
          //     const keyNumber = Number(key);
          //     if (keyNumber === this.formValue.quoteInput.makeId) {
          //       this.motorInsuranceForm.patchValue({
          //         makeVehical: key,
          //       });
          //     }
          //   }
          // });
          // this.QuoteServiceobj.getPCModelsForMake(this.formValue.quoteInput.makeId).subscribe((res) => {
          //   this.allModelVehical = res;
          //   // tslint:disable-next-line: forin
          //   for (const key1 in this.allModelVehical) {
          //     const keyNumber1 = Number(key1);
          //     if (keyNumber1 === this.formValue.quoteInput.modelId) {
          //       this.motorInsuranceForm.patchValue({
          //         modelVehical: key1,
          //       });
          //     }
          //   }
          // });
          // this.QuoteServiceobj.getBacktoQuestionVariant(this.formValue.quoteInput.makeId,
          //   this.formValue.quoteInput.modelId).subscribe((res) => {
          //     this.allvariantVehical = res;
          //     // tslint:disable-next-line: forin
          //     for (const key2 in this.allvariantVehical) {
          //       const keyNumber2 = Number(key2);
          //       if (keyNumber2 === this.formValue.quoteInput.varId) {
          //         this.motorInsuranceForm.get('vehicalVarient').patchValue(key2);
          //       }
          //     }
          //   });
          // this.getPCModelsForMake(this.formValue.quoteInput.makeId);
        });
      }
    });

    this.QuoteServiceobj.getAllPCMakes().subscribe((res) => {
      // when someone want to give the data then we need to get data is called subscribe.
      // subscribe is a Method.
      this.allMakeVehical = res;
    });
    this.QuoteServiceobj.getAllRtos().subscribe((res) => {
      // when someone want to give the data then we need to get data is called subscribe.
      // subscribe is a Method.
      this.getAllRtos = res;
      this.getAllRtos.map((rto) => {
        rto.value = rto.id + ' - ' + rto.value;
      });
    });

    this.policy.valueChanges.subscribe((checked) => {
      if (checked === '') {
        const vehicalRegArr = ['vehicalRegRenew', 'vehicalRegNew'];
        vehicalRegArr.forEach((control) => {
          if (this.motorInsuranceForm.get(control)) {
            this.motorInsuranceForm.removeControl('control');
          }
        });
      } else {
        if (checked === 'NB') {
          this.motorInsuranceForm.addControl(
            'vehicalRegNew',
            new FormControl('', Validators.required),
          );
        } else {
          this.motorInsuranceForm.removeControl('vehicalRegNew');
        }
        if (checked === 'RO') {
          this.motorInsuranceForm.addControl(
            'vehicalRegRenew',
            new FormControl('', Validators.required),
          );
        } else {
          this.motorInsuranceForm.removeControl('vehicalRegRenew');
        }
      }

      this.motorInsuranceForm.updateValueAndValidity();
    });
  }

  get policy() {
    return this.motorInsuranceForm.get('policy') as FormControl;
  }

  get vehicalRegNew() {
    return this.motorInsuranceForm.get('vehicalRegNew') as FormControl;
  }

  get vehicalRegRenew() {
    return this.motorInsuranceForm.get('vehicalRegRenew') as FormControl;
  }

  get formError() {
    return this.motorInsuranceForm.controls;
  }

  getAllPCMakes() {
    this.QuoteServiceobj.getAllPCMakes().subscribe((res) => {
      this.allMakeVehical = res;
    });
  }

  getPCModelsForMake(value) {
    this.QuoteServiceobj.getPCModelsForMake(value).subscribe((res) => {
      this.allModelVehical = res;
    });
  }

  getPCVariantsForMakeAndModel(makeid, modelid) {
    this.QuoteServiceobj.getBacktoQuestionVariant(makeid, modelid).subscribe((res) => {
      this.allvariantVehical = res;
    });
  }

  getPCModelsForMakeSelection(value) {
    this.QuoteServiceobj.getPCModelsForMake(value).subscribe((res) => {
      this.allModelVehical = res;
      this.motorInsuranceForm.patchValue({
        vehicalVarient: '',
        modelVehical: '',
      });
    });
  }

  getPCVariantsForMakeAndModelSelection(makeid, modelid) {
    this.QuoteServiceobj.getBacktoQuestionVariant(makeid, modelid).subscribe((res) => {
      this.allvariantVehical = res;
      this.motorInsuranceForm.patchValue({
        vehicalVarient: '',
      });
    });
  }

  submitMotorQuote() {
    this.loaderService.showSpinner(true);
    const motorInsurance = {
      lob: 'Motor',
      productType: 'PC',
      coverType: this.motorInsuranceForm.value.coverType,
      policyType: this.motorInsuranceForm.value.policy,
      makeId: this.motorInsuranceForm.value.makeVehical, // left side  parameter will be json file name
      modelId: this.motorInsuranceForm.value.modelVehical,
      varId: this.motorInsuranceForm.value.vehicalVarient,
      rtoCode: this.motorInsuranceForm.value.vahicalRto,
      yom: this.motorInsuranceForm.value.year,
      leadId: this.leadId,
    };
    if (this.motorInsuranceForm.get('policy').value === 'RO') {
      motorInsurance['dateOfRegistration'] = this.motorInsuranceForm.get('vehicalRegRenew').value;
      // const event = new Date(this.motorInsuranceForm.get('endDate').value);
      // const date = JSON.stringify(event);
      // const date1 = date.slice(1, 11);
      // const today = new Date(date1);
      // const dd = today.getDate() + 1;
      // const mm = today.getMonth() + 1;
      //const yyyy = today.getFullYear();
      // const policyenddate = yyyy + '-' + mm + '-' + dd;
      motorInsurance['prevPolicyEndDate'] = this.motorInsuranceForm.get('endDate').value;
      motorInsurance['currNcb'] = this.motorInsuranceForm.get('noClaim').value;
      motorInsurance['currClaim'] = this.motorInsuranceForm.get('currentYear').value;
    } else {
      motorInsurance['dateOfRegistration'] = this.motorInsuranceForm.get('vehicalRegNew').value;
      motorInsurance['prevPolicyEndDate'] = null;
      motorInsurance['currNcb'] = '0';
      motorInsurance['currClaim'] = 'N';
    }
    if (this.formValue) {
      motorInsurance['customerId'] = this.formValue?.quoteInput?.customerId;
    } else if (this.customerId) {
      motorInsurance['customerId'] = this.customerId;
    } else {
      motorInsurance['customerId'] = 0;
    }
    this.QuoteServiceobj.submitMotorQuote(motorInsurance).subscribe(
      (result) => {
        this.loaderService.showSpinner(false);
        const quote = result;
        this.quoteId = quote['quoteId'];
        if (quote['numQuotesExpected'] > 0) {
          this.router.navigate(['/quote/quote-motor-insurance', this.quoteId]);

          // this.router.navigate(['quote/quote-motor-insurance'], { queryParams: { quoteId: this.quoteId } });
        } else {
          this.errordatafound = true;
          this.loaderService.showSpinner(false);
          this.errorDetail =
            'Oops.. We could not find any policies for you. you may have to adjust your search criteria.';
          this.MyProp.nativeElement.scrollIntoView({ behavior: 'smooth' });
        }
      },
      (error) => {
        this.errordatafound = true;
        this.loaderService.showSpinner(false);
        // this.errorDetail = error.error.details;
        //  console.log('message', error.error.message);
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
        this.needHideMotorDetails = 'Hide help';
      } else {
        this.needHideMotorDetails = 'Need help?';
      }
      // 1
    } else if (event === 'detail') {
      this.isShowndetail = !this.isShowndetail;
      if (this.isShowndetail) {
        this.needHideDetails = 'Hide help';
      } else {
        this.needHideDetails = 'Need help?';
      }
      // 2
    } else if (event === 'claim_year') {
      this.isShownClaimyear = !this.isShownClaimyear;
      if (this.isShownClaimyear) {
        this.needHideClaimyear = 'Hide help';
      } else {
        this.needHideClaimyear = 'Need help?';
      }
      // 3
    } else if (event === 'YearManufactured') {
      this.isShownYearManufactured = !this.isShownYearManufactured;
      if (this.isShownYearManufactured) {
        this.needHideYearManufactured = 'Hide help';
      } else {
        this.needHideYearManufactured = 'Need help?';
      }
      // 2
    } else if (event === 'RegDate') {
      this.isShownRegDate = !this.isShownRegDate;
      if (this.isShownRegDate) {
        this.needHideRegDate = 'Hide help';
      } else {
        this.needHideRegDate = 'Need help?';
      }
      // 2
    } else if (event === 'RTOVehical') {
      this.isShownRTOVehical = !this.isShownRTOVehical;
      if (this.isShownRTOVehical) {
        this.needHideRTOVehical = 'Hide help';
      } else {
        this.needHideRTOVehical = 'Need help?';
      }
      // 2
    } else if (event === 'PolicyEnd') {
      this.isShownPolicyEnd = !this.isShownPolicyEnd;
      if (this.isShownPolicyEnd) {
        this.needHidePolicyEnd = 'Hide help';
      } else {
        this.needHidePolicyEnd = 'Need help?';
      }
      // 2
    } else if (event === 'NoClaim') {
      this.isShownNoClaim = !this.isShownNoClaim;
      if (this.isShownNoClaim) {
        this.needHideNoClaim = 'Hide help';
      } else {
        this.needHideNoClaim = 'Need help?';
      }
      // 2
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
    } else if (event === 'existinCover') {
      this.isShownExistingCover = !this.isShownExistingCover;
      if (this.isShownExistingCover) {
        this.needHidePolicyExistingCover = 'Hide help';
      } else {
        this.needHidePolicyExistingCover = 'Need help?';
      }
      // 3
    } else if (event === 'coverage') {
      this.isShownDeductible = !this.isShownDeductible;
      if (this.isShownDeductible) {
        this.needHideDeductible = 'Hide help';
      } else {
        this.needHideDeductible = 'Need help?';
      }
    }
  }

  renewPolicy() {
    if (this.motorInsuranceForm.get('policy').value === 'RO') {
      this.renewPolicyCover = true;
      this.regLabelNeedText = true;
      this.motorInsuranceForm.addControl('endDate', new FormControl('', Validators.required));
      this.motorInsuranceForm.addControl('noClaim', new FormControl('', Validators.required));
      this.motorInsuranceForm.addControl('currentYear', new FormControl('', Validators.required));
      if (this.coverTypes.length === 1) {
        this.coverTypes.push({
          value: 'OD',
          viewValue: 'Own Damage',
        });
        this.coverTypes.push({
          value: 'TP',
          viewValue: 'Third Party',
        });
      }
    } else {
      this.motorInsuranceForm.removeControl('endDate');
      this.motorInsuranceForm.removeControl('noClaim');
      this.motorInsuranceForm.removeControl('currentYear');
      this.coverTypes = this.coverTypes.splice(0, 1);
      this.renewPolicyCover = false;
      this.regLabelNeedText = true;
    }
  }

  inputEvent(date, control) {
    const moment = require('moment');
    const newDate = new Date(date.value);
    this.motorInsuranceForm.get(control).setValue(moment(newDate).format('YYYY-MM-DD'));
    if (control === 'vehicalRegRenew') {
      this.vehicalRegRenewYear = new Date(date.value).getFullYear();
      if (this.vehicleManufacture > this.vehicalRegRenewYear) {
        this.motorInsuranceForm.get('year').markAsPending();
        this.isRenewYearError = true;
      } else {
        this.isRenewYearError = false;
      }
    }
  }

  checkReg() {
    if (this.motorInsuranceForm.get('hasRegsNum').value === 'NRG') {
      // this.renewPolicyCover = false;
      if (this.motorInsuranceForm.get('registrationNumber')) {
        this.motorInsuranceForm.removeControl('registrationNumber');
      }
      Object.keys(this.motorInsuranceForm.controls).forEach((control) => {
        if (control !== 'hasRegsNum') {
          console.log(control);
          this.motorInsuranceForm.get(control)?.reset('');
        }
      });
      this.motorInsuranceForm.updateValueAndValidity();
      // this.regLabelNeedText = true;
      this.showOptions = true;
      this.isRegError = false;
    } else {
      Object.keys(this.motorInsuranceForm.controls).forEach((control) => {
        if (control !== 'hasRegsNum') {
          console.log(control);
          this.motorInsuranceForm.get(control)?.reset('');
        }
      });
      this.motorInsuranceForm.addControl(
        'registrationNumber',
        new FormControl('', Validators.required),
      );
      this.showOptions = false;
    }
  }

  getRegistrationDetails() {
    this.loaderService.showSpinner(false);
    this.isRegError = true;
    this.showOptions = true;
    // console.log('details');
    // this.QuoteServiceobj.getDetails.subscribe(
    //   (res) => {
    //     console.log(res);
    //     this.showOptions = true;
    //   },
    //   (error) => {
    //     this.showOptions = false;
    //     this.isRegError = true;
    // );
  }
  /*
    inputEvent1(date1) {
      const moment = require('moment');
      const newDate1 = new Date(date1.value);
      this.motorInsuranceForm.get('vehicalRegRenew').setValue(moment(newDate1).format('YYYY-MM-DD'));
    }

    inputEvent2(date2) {
      const moment = require('moment');
      const newDate2 = new Date(date2.value);
      this.motorInsuranceForm.get('endDate').setValue(moment(newDate2).format('YYYY-MM-DD'));
    }
  */
}
