
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { QuoteService } from '../quote.service';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MY_FORMATS } from '@app/shared/utils/moment';
import { TranslatePipe, TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { QrCodeModalComponent } from '../qr-code-modal/qr-code-modal.component';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';
import { LoaderService } from '@app/_services/loader.service';

export interface DialogData {
  name: string;
}

@Component({
  selector: 'app-offline-purchase',
  templateUrl: './offline-purchase.component.html',
  styleUrls: ['./offline-purchase.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],

})


export class OfflinePurchaseComponent implements OnInit {

  offlinePurchaseForm: FormGroup;
  offlineProposalData;
  productType;
  customerType;
  applicationId;
  sumInsured;
  premiumAmount;
  insurerLogo;
  insurerName;
  productName;
  branchCode;
  branchLocation;
  policyType;
  newPolicy;
  deductible;
  policyTerm;
  premiumPayingTerm;
  mode;
  displayMode;
  tenure;
  members;
  additionalBenefits;
  pincode;
  relationship;
  vehicleType;
  vehicleDetails;
  RTO;
  claimCurrentYear;
  yearOfManufacture;
  registrationDate;
  currentPolicyExpiryDate;
  ncb;
  vehicleName;
  maxAdultDate: Date;
  maxTodayDate: Date;
  showForms = false;
  showThanks = false;
  public validationMessages = {};
  panNo: FormControl;
  gstin: FormControl;
  panValidatorActive = false;
  gstnValidatorActive = false;
  previousURL = '';
  isLoading = false;
  qrCodeError = false;
  showButton = false;

  constructor(
    public dialog: MatDialog,
    private quoteService: QuoteService,
    private router: Router,
    private translateService: TranslateService,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private location: Location) {

    this.route.params.subscribe(params => {
      if (params.appNo) {
        this.applicationId = params.appNo;
      } else {
        this.applicationId = null;
      }
    });

  }

  ngOnInit(): void {

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDay();
    this.maxTodayDate = new Date();
    this.maxAdultDate = new Date(currentYear - 18, currentMonth, currentDay);

    this.validationMessages = this.getValidationMsg();
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.validationMessages = this.getValidationMsg();
    });

    this.offlinePurchaseForm = new FormGroup({
      customerType: new FormControl({ value: '', disabled: true }),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      dob: new FormControl(''),
      gender: new FormControl(''),
      mobileNo: new FormControl(''),
      emailID: new FormControl(''),
      businessEntityName: new FormControl(''),
      dateOfIncorporation: new FormControl(''),
      panNo: new FormControl(''),
      gstin: new FormControl(''),
      primaryMobile: new FormControl(''),
      primaryEmail: new FormControl('')
    });

    // this.applicationId = 1605854030352; //health
    // this.applicationId = 1606121934026; //motor
    // this.applicationId = 1606316144518; //motor business

    this.loaderService.showSpinner(true);
    this.quoteService.getOfflineProposalData(this.applicationId).subscribe(result => {
      // console.log('proposal data', result);
      this.offlineProposalData = result;
      // console.log('applicationData', this.offlineProposalData.applicationData);
      this.productType = this.offlineProposalData.lob;
      this.insurerLogo = this.offlineProposalData.insurerLogo;
      this.insurerName = this.offlineProposalData.insurerName;
      this.productName = this.offlineProposalData.productName;
      this.sumInsured = this.offlineProposalData.applicationData.sumInsured;
      this.premiumAmount = this.offlineProposalData.premiumAmount;
      this.branchCode = this.offlineProposalData.branchCode;
      this.branchLocation = this.offlineProposalData.branchName;
      this.policyType = this.getDisplayPolicyType(this.offlineProposalData.productType);
      this.policyTerm = this.offlineProposalData.pt;
      this.premiumPayingTerm = this.offlineProposalData.ppt;
      this.mode = this.offlineProposalData.mode;
      this.displayMode = this.getDisplayMode(this.mode);
      // this.tenure = this.offlineProposalData.applicationData.additionaldata.tenure;
      this.additionalBenefits = this.offlineProposalData.applicationData.addonBenefits;

      if (this.productType === 'Health') {
        this.pincode = this.offlineProposalData.applicationData.additionalData.pincode;
        this.deductible = this.offlineProposalData.applicationData.additionalData.deductible;
        if (this.deductible === 0) {
          this.newPolicy = 'New Policy';
        } else {
          this.newPolicy = 'Enhance Existing Cover';
        }
        this.members = this.offlineProposalData.applicationData.additionalData.members;
        this.loaderService.showSpinner(false);
        // this.quoteService.getInsuredRelationship(this.productType, this.offlineProposalData.productType).subscribe(relationship => {
        //   this.relationship = relationship;
        //   this.isLoading = false;

        //   this.members.forEach(members => {
        //     members.relationship = '';
        //     this.relationship.forEach(relation => {
        //       if (members.relationshipId === relation.id) {
        //         members.relationship += relation.value;
        //       }
        //     });
        //   });
        // });
      } else {
        this.newPolicy = this.getDisplayPolicyType(this.offlineProposalData.applicationData.additionalData.policyType);
        this.vehicleType = this.getDisplayPolicyType(this.offlineProposalData.applicationData.additionalData.productType);
        this.vehicleName = this.offlineProposalData.applicationData.additionalData.vehicleName;
        this.RTO = this.offlineProposalData.applicationData.additionalData.rtoCode;
        this.ncb = this.offlineProposalData.applicationData.additionalData.currNcb;
        this.claimCurrentYear = this.offlineProposalData.applicationData.additionalData.currClaim;
        this.yearOfManufacture = this.offlineProposalData.applicationData.additionalData.yom;
        this.registrationDate = this.offlineProposalData.applicationData.additionalData.dateOfRegistration;
        this.currentPolicyExpiryDate = this.offlineProposalData.applicationData.additionalData.prevPolicyEndDate;
        this.loaderService.showSpinner(false);
      }

      if (this.offlineProposalData.applicationData.isIndividual) {
        this.customerType = 'INDV';
        this.offlinePurchaseForm.get('customerType').setValue('INDV');
        this.offlinePurchaseForm.get('firstName').setValidators([Validators.required, Validators.minLength(2), Validators.maxLength(45)]);
        this.offlinePurchaseForm.get('lastName').setValidators([Validators.required, Validators.minLength(2), Validators.maxLength(45)]);
        this.offlinePurchaseForm.get('dob').setValidators([Validators.required]);
        this.offlinePurchaseForm.get('gender').setValidators([Validators.required, Validators.pattern('M|F')]);
        this.offlinePurchaseForm.get('mobileNo').setValidators([Validators.required, Validators.pattern('^[6-9]\\d{9}$')]);
        this.offlinePurchaseForm.get('emailID').setValidators([Validators.required, Validators.email]);

        // set value for form input
        this.offlinePurchaseForm.get('firstName').setValue(this.offlineProposalData.applicationData.proposerFirstName);
        this.offlinePurchaseForm.get('lastName').setValue(this.offlineProposalData.applicationData.proposerLastName);
        this.offlinePurchaseForm.get('dob').setValue(this.offlineProposalData.applicationData.proposerDob);
        this.offlinePurchaseForm.get('gender').setValue(this.offlineProposalData.applicationData.proposerGender);
        this.offlinePurchaseForm.get('mobileNo').setValue(this.offlineProposalData.applicationData.proposerMobile);
        this.offlinePurchaseForm.get('emailID').setValue(this.offlineProposalData.applicationData.proposerEmail);
      } else {
        this.customerType = 'BUSI';
        this.offlinePurchaseForm.get('customerType').setValue('BUSI');
        this.offlinePurchaseForm.get('businessEntityName').setValidators([Validators.required,
        Validators.minLength(5), Validators.maxLength(45)]);
        this.offlinePurchaseForm.get('dateOfIncorporation').setValidators([Validators.required]);
        this.offlinePurchaseForm.get('panNo').setValidators([Validators.required, Validators.pattern('^[A-Z]{5}\\d{4}[A-Z]{1}$')]);
        this.offlinePurchaseForm.get('primaryMobile').setValidators([Validators.required, Validators.pattern('^[6-9]\\d{9}$')]);
        this.offlinePurchaseForm.get('primaryEmail').setValidators([Validators.required, Validators.email]);

        this.offlinePurchaseForm.get('businessEntityName').setValue(this.offlineProposalData.applicationData.orgName);
        this.offlinePurchaseForm.get('dateOfIncorporation').setValue(this.offlineProposalData.applicationData.doi);
        this.offlinePurchaseForm.get('panNo').setValue('');
        this.offlinePurchaseForm.get('primaryMobile').setValue(this.offlineProposalData.applicationData.proposerMobile);
        this.offlinePurchaseForm.get('primaryEmail').setValue(this.offlineProposalData.applicationData.proposerEmail);
      }


      this.panNo = this.offlinePurchaseForm.get('panNo') as FormControl;
      this.gstin = this.offlinePurchaseForm.get('gstin') as FormControl;


      this.panNo.valueChanges
        .subscribe((pan) => {
          // console.log('pan', pan);
          if (pan) {
            if (pan.length === 10) {
              this.panNo.setValue(pan.toString().toUpperCase(), { emitEvent: false });
            }

            // if (!this.panValidatorActive) {
            //   this.panValidatorActive = true;
            //   this.panNo.setValidators(Validators.pattern('^[A-Z]{5}\\d{4}[A-Z]{1}$'));
            //   this.panNo.updateValueAndValidity();
            // }
          }
          // else {
          //   if (this.panValidatorActive) {
          //     this.panValidatorActive = false;
          //     this.panNo.clearValidators();
          //     this.panNo.updateValueAndValidity();
          //   }
          // }
        });

      this.gstin.valueChanges
        .subscribe((gstn) => {
          if (gstn) {
            if (gstn.length === 15) {
              this.gstin.setValue(gstn.toString().toUpperCase(), { emitEvent: false });
            }
            if (!this.gstnValidatorActive) {
              this.gstnValidatorActive = true;
              this.gstin.setValidators(Validators.pattern('^\\d{2}[A-Z]{5}\\d{4}[A-Z]{1}[A-Z\\d]{1}[Z]{1}[A-Z\\d]{1}$'));
              this.gstin.updateValueAndValidity();
            }
          }
          else {
            if (this.gstnValidatorActive) {
              this.gstnValidatorActive = false;
              this.gstin.clearValidators();
              this.gstin.updateValueAndValidity();
            }
          }
        });

      this.offlinePurchaseForm.updateValueAndValidity();
      this.disableGenerateBtn();
      this.showForms = true;
      this.showThanks = false;
      this.checkFormStatus();
    }, error => {
      this.loaderService.showSpinner(false);
      const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
        data: error.error.details,
        panelClass: 'dialog-width'
      });
      dialogRef.afterClosed().subscribe(data => {
        // navigate
      });
    });
  }

  checkFormStatus() {
    // console.log('changes', changes);
    if (this.offlineProposalData.status && this.offlineProposalData.status === 'INITIATED' || this.offlineProposalData.status === 'initiated') {
      this.showButton = true;
      Object.keys(this.offlinePurchaseForm.controls).forEach(control => {
        this.offlinePurchaseForm.get(control).enable();
      });
    } else {
      this.showButton = false;
      Object.keys(this.offlinePurchaseForm.controls).forEach(control => {
        this.offlinePurchaseForm.get(control).disable();
      });
    }
  }

  showNextScreen() {
    this.showForms = false;
    this.showThanks = true;
  }

  inputEvent(event, name) {
    const moment = require('moment');
    const newDate = new Date(event.value);
    this.offlinePurchaseForm.get(name).setValue(moment(newDate).format('YYYY-MM-DD'));
  }

  getDisplayPolicyType(policyType) {
    switch (policyType) {
      case 'FF':
        return 'Family Floater';

      case 'INDV':
        return 'Individual';

      case 'TW':
        return 'Two Wheeler';

      case 'PC':
        return 'Private Car';

      case 'RO':
        return 'Renewal Existing Cover';

      case 'NB':
        return 'New Policy';


    }
  }

  getDisplayMode(mode) {
    switch (mode) {
      case '0':
        return 'Single';

      case '1':
        return 'Annual';

      case '4':
        return 'Quarterly';

      case '2':
        return 'Half Yearly';

      case '12':
        return 'Monthly';
    }
  }

  submitForm() {
    if (this.offlineProposalData.applicationData.isIndividual) {
      this.offlineProposalData.applicationData.proposerFirstName = this.offlinePurchaseForm.get('firstName').value;
      this.offlineProposalData.applicationData.proposerLastName = this.offlinePurchaseForm.get('lastName').value;
      this.offlineProposalData.applicationData.proposerDob = this.offlinePurchaseForm.get('dob').value;
      this.offlineProposalData.applicationData.proposerGender = this.offlinePurchaseForm.get('gender').value;
      this.offlineProposalData.applicationData.proposerMobile = this.offlinePurchaseForm.get('mobileNo').value;
      this.offlineProposalData.applicationData.proposerEmail = this.offlinePurchaseForm.get('emailID').value;
    } else {
      this.offlineProposalData.applicationData.orgName = this.offlinePurchaseForm.get('businessEntityName').value;
      this.offlineProposalData.applicationData.doi = this.offlinePurchaseForm.get('dateOfIncorporation').value;
      this.offlineProposalData.applicationData.proposerMobile = this.offlinePurchaseForm.get('primaryMobile').value;
      this.offlineProposalData.applicationData.proposerEmail = this.offlinePurchaseForm.get('primaryEmail').value;
    }
    this.offlineProposalData.status = 'PENDING';
    // console.log('post data', this.offlineProposalData);
    // return;
    this.loaderService.showSpinner(true);
    this.quoteService.postSubmitOfflinePurchaseData(this.offlineProposalData).subscribe(result => {
      // console.log('post result', result);
      this.showForms = false;
      this.showThanks = true;
      this.loaderService.showSpinner(false);
    }, error => {
      this.loaderService.showSpinner(false);
      const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
        data: error.error.details,
        panelClass: 'dialog-width'
      });
      dialogRef.afterClosed().subscribe(data => {
        // navigate
      });
    });

  }



  backBtn(id) {
    if (id === 'close') {
      this.router.navigate(['/quickquote']);
    } else {
      this.location.back();
    }
  }

  disableGenerateBtn() {
    if (this.offlinePurchaseForm.valid) {
      return true;
    } else {
      return false;
    }
  }

  generateQRCode() {
    this.loaderService.showSpinner(true);
    this.quoteService.generateQRCode(this.offlineProposalData.applicationNo).subscribe(result => {
      // console.log('post result', result);
      this.loaderService.showSpinner(false);
      this.qrCodeError = false;
      const dialogRef = this.dialog.open(QrCodeModalComponent, {
        data: result,
        panelClass: 'dialog-width'
      });
      dialogRef.afterClosed().subscribe(data => {
        // navigate
      });
    }, error => {
      this.loaderService.showSpinner(false);
      this.qrCodeError = true;
      // const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
      //   data: error.error.details
      // });
      // dialogRef.afterClosed().subscribe(data => {
      //   // navigate
      // });
    });
  }


  MinDate(): Date {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDay();

    return new Date(currentYear - 100, currentMonth, currentDay);
  }


  private getValidationMsg() {
    return {
      businessEntityName: [
        { type: 'required', message: this.translateService.instant('error.BUSINESS_IS_REQUIRED') },
        { type: 'minlength', message: this.translateService.instant('error.BUSINESS_MIN') },
        { type: 'maxlength', message: this.translateService.instant('error.BUSINESS_MAX') }
      ],
      dateOfIncorporation: [
        { type: 'required', message: this.translateService.instant('error.DATE_OF_INCORPORATION_REQUIRED') },
        { type: 'pattern', message: this.translateService.instant('error.DATE_YYYY_MM_DD_REQUIRED') },
      ],
      primaryMobile: [
        { type: 'required', message: this.translateService.instant('error.MOBILE_REQUIRED') },
        { type: 'pattern', message: this.translateService.instant('error.MOBILE_INVALID') },
        { type: 'minlength', message: this.translateService.instant('error.MOBILE_MIN') },
        { type: 'maxlength', message: this.translateService.instant('error.MOBILE_MAX') }
      ],
      primaryEmail: [
        { type: 'required', message: this.translateService.instant('error.PRIMARY_EMAIL_REQUIRED') },
        { type: 'email', message: this.translateService.instant('error.PRIMARY_EMAIL_INVALID') }
      ],
      panNo: [
        { type: 'required', message: this.translateService.instant('error.PAN_REQUIRED') },
        { type: 'pattern', message: this.translateService.instant('error.PAN_INVALID') },
      ],
      gstin: [
        { type: 'required', message: this.translateService.instant('error.GSTN_REQUIRED') },
        { type: 'pattern', message: this.translateService.instant('error.GSTN_INVALID') },
      ],
      firstName: [
        { type: 'required', message: this.translateService.instant('error.FIRST_NAME_REQUIRED') },
        { type: 'minlength', message: this.translateService.instant('error.FIRST_NAME_MAX') },
        { type: 'maxlength', message: this.translateService.instant('error.FIRST_NAME_MAX') }
      ],
      lastName: [
        { type: 'required', message: this.translateService.instant('error.LAST_NAME_REQUIRED') },
        { type: 'minlength', message: this.translateService.instant('error.LAST_NAME_MIN') },
        { type: 'maxlength', message: this.translateService.instant('error.LAST_NAME_MAX') }
      ],
      dob: [
        { type: 'required', message: this.translateService.instant('error.DOB_REQUIRED') },
        { type: 'pattern', message: this.translateService.instant('error.DATE_YYYY_MM_DD_REQUIRED') },
        { type: 'underEighteen', message: this.translateService.instant('error.DOB_UNDER_EIGHTEEN') }
      ],
      gender: [
        { type: 'required', message: this.translateService.instant('error.GENDER_REQUIRED') },
        { type: 'pattern', message: this.translateService.instant('error.GENDER_INVALID') }
      ],
      mobileNo: [
        { type: 'required', message: this.translateService.instant('error.MOBILE_REQUIRED') },
        { type: 'pattern', message: this.translateService.instant('error.MOBILE_INVALID') },
        { type: 'minlength', message: this.translateService.instant('error.MOBILE_MIN') },
        { type: 'maxlength', message: this.translateService.instant('error.MOBILE_MAX') }
      ],
      emailID: [
        { type: 'required', message: this.translateService.instant('error.EMAIL_REQUIRED') },
        { type: 'email', message: this.translateService.instant('error.EMAIL_INVALID') }
      ],
    };
  }
}
