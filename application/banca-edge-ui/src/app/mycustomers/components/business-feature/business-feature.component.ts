import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  BusinessCustomer,
  Contacts,
  Addresses,
  Dependents,
  CustomerNotifications,
  CustomerApplications,
} from '@interface/Customer';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MY_FORMATS } from '../../../shared/utils/moment';
import { AccountService } from '../../../_services/account.service';
import { CustomersService } from '../../services/customers.service';
import { CustomValidators } from '../../../_helpers/CustomValidators';
import { of } from 'rxjs';
import { TranslatePipe, TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { AlertModule } from '@app/_components/alert.module';
import { AlertService } from '../../../_services';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '@app/_services/loader.service';

@Component({
  selector: 'app-business-feature',
  templateUrl: './business-feature.component.html',
  styleUrls: ['./business-feature.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class BusinessFeatureComponent implements OnInit {
  submitted = false;

  customer: FormGroup;

  addressList: FormArray;

  contactEmailList: FormArray;

  contactPhoneList: FormArray;

  disableSubmitButton = false;

  organizationCode: string;

  branchCode: string;

  showBranchSelector = false;

  branches = null;

  branchSelector: FormControl;

  notEditable = true;

  public validationMessages = {};

  panNo: FormControl;

  gstn: FormControl;

  panValidatorActive = false;

  gstnValidatorActive = false;

  maxTodayDate: Date;

  isLoading = false;

  allowedBranches;

  csfInfo: FormGroup;

  customerDetails;

  emailForm;

  addressForm;

  phoneForm;

  dependentForm;

  primaryMobileNo;

  newCustomerId;

  bankArray = [
    { value: 'KB', text: 'Karnataka Bank' },
    { value: 'IB', text: 'Indian Bank' },
    { value: 'IOB', text: 'Indian Overseas Bank' },
  ];

  constructor(
    private accountService: AccountService,
    private customerService: CustomersService,
    private translateService: TranslateService,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
  ) {
    const user = this.accountService.userValue;
    this.organizationCode = user.organizationCode;

    const userroles: string[] = user.roles;
    if (userroles.indexOf('ZONE.CUSTOMER.CREATE') > -1) {
      this.showBranchSelector = true;
      this.branchCode = null;
    } else {
      this.showBranchSelector = false;
      if (userroles.indexOf('BRANCH.CUSTOMER.CREATE') > -1) {
        this.branchCode = user.branchCode;
      }
    }
    this.validationMessages = this.getValidationMsg();
    translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.validationMessages = this.getValidationMsg();
    });
  }

  private getValidationMsg() {
    return {
      branchName: [
        { type: 'required', message: this.translateService.instant('error.BRANCH_IS_REQUIRED') },
        { type: 'notDefaultBranch', message: this.translateService.instant('error.SELECT_BRANCH') },
      ],

      orgName: [
        { type: 'required', message: this.translateService.instant('error.BUSINESS_IS_REQUIRED') },
        { type: 'minlength', message: this.translateService.instant('error.BUSINESS_MIN') },
        { type: 'maxlength', message: this.translateService.instant('error.BUSINESS_MAX') },
      ],
      dateOfIncorporation: [
        {
          type: 'required',
          message: this.translateService.instant('error.DATE_OF_INCORPORATION_REQUIRED'),
        },
        {
          type: 'pattern',
          message: this.translateService.instant('error.DATE_YYYY_MM_DD_REQUIRED'),
        },
      ],
      primaryContactName: [
        {
          type: 'required',
          message: this.translateService.instant('error.PRIMARY_CONTACT_REQUIRED'),
        },
        { type: 'minlength', message: this.translateService.instant('error.PRIMARY_CONTACT_MIN') },
        { type: 'maxlength', message: this.translateService.instant('error.PRIMARY_CONTACT_MAX') },
      ],
      primaryEmail: [
        {
          type: 'required',
          message: this.translateService.instant('error.PRIMARY_EMAIL_REQUIRED'),
        },
        { type: 'email', message: this.translateService.instant('error.PRIMARY_EMAIL_INVALID') },
      ],
      mobileNo: [
        { type: 'required', message: this.translateService.instant('error.MOBILE_REQUIRED') },
        { type: 'pattern', message: this.translateService.instant('error.MOBILE_INVALID') },
        { type: 'minlength', message: this.translateService.instant('error.MOBILE_MIN') },
        { type: 'maxlength', message: this.translateService.instant('error.MOBILE_MAX') },
      ],
      panNo: [
        { type: 'required', message: this.translateService.instant('error.PAN_REQUIRED') },
        { type: 'pattern', message: this.translateService.instant('error.PAN_INVALID') },
      ],
      gstn: [
        { type: 'required', message: this.translateService.instant('error.GSTN_REQUIRED') },
        { type: 'pattern', message: this.translateService.instant('error.GSTN_INVALID') },
      ],
      emailText: [
        { type: 'required', message: this.translateService.instant('error.EMAIL_REQUIRED') },
        { type: 'email', message: this.translateService.instant('error.EMAIL_INVALID') },
      ],
      phoneText: [
        { type: 'required', message: this.translateService.instant('error.PHONE_REQUIRED') },
        { type: 'pattern', message: this.translateService.instant('error.PHONE_INVALID') },
      ],
      addressType: [
        { type: 'required', message: this.translateService.instant('error.ADDRESS_TYPE') },
      ],
      addressline1: [
        {
          type: 'required',
          message: this.translateService.instant('error.ADDRESS_LINE1_REQUIRED'),
        },
        { type: 'minlength', message: this.translateService.instant('error.ADDRESS_LINE1_MIN') },
        { type: 'maxlength', message: this.translateService.instant('error.ADDRESS_LINE1_MAX') },
      ],
      addressline2: [
        {
          type: 'required',
          message: this.translateService.instant('error.ADDRESS_LINE2_REQUIRED'),
        },
        { type: 'minlength', message: this.translateService.instant('error.ADDRESS_LINE2_MIN') },
        { type: 'maxlength', message: this.translateService.instant('error.ADDRESS_LINE2_MAX') },
      ],
      addressline3: [
        { type: 'maxlength', message: this.translateService.instant('error.ADDRESS_LINE3_MAX') },
      ],
      postalcode: [
        { type: 'required', message: this.translateService.instant('error.POSTALCODE_REQUIRED') },
        { type: 'postalCode', message: this.translateService.instant('error.POSTALCODE_INVALID') },
      ],
      city: [{ type: 'required', message: this.translateService.instant('error.CITY_REQUIRED') }],
      state: [{ type: 'required', message: this.translateService.instant('error.STATE_REQUIRED') }],
      district: [
        { type: 'required', message: this.translateService.instant('error.DISTRICT_REQUIRED') },
      ],
      country: [
        { type: 'required', message: this.translateService.instant('error.COUNTRY_REQUIRED') },
      ],
      countryCode: [
        { type: 'required', message: this.translateService.instant('error.COUNTRY_CODE_REQUIRED') },
      ],
      emailType: [
        { type: 'required', message: this.translateService.instant('error.EMAIL_TYPE_REQUIRED') },
      ],
      phoneType: [
        { type: 'required', message: this.translateService.instant('error.PHONE_TYPE_REQUIRED') },
      ],
    };
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.customer.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  sendToAPI() {
    const formObj = this.customer.getRawValue();

    const serializedForm = JSON.stringify(formObj);
    const that = this;

    const mutatedForm = JSON.parse(serializedForm);
    if (mutatedForm['branchName'].id !== 'Default') {
      mutatedForm['branchCode'] = mutatedForm['branchName'].id;
    } else {
      mutatedForm['branchCode'] = this.branchCode;
    }

    delete mutatedForm['branchName'];
    delete mutatedForm['customerId'];
    mutatedForm['isIndividual'] = false;
    mutatedForm['contactList'] = [];
    mutatedForm['contactEmailList'].forEach((item) => {
      mutatedForm['contactList'].push({
        contactType: item.emailType,
        contactText: that.lowercase(item.emailText),
      });
    });
    mutatedForm['contactPhoneList'].forEach((item) => {
      mutatedForm['contactList'].push({ contactType: item.phoneType, contactText: item.phoneText });
    });
    delete mutatedForm['contactEmailList'];
    delete mutatedForm['contactPhoneList'];
    mutatedForm['dateOfIncorporation'] = mutatedForm['dateOfIncorporation'].split('T')[0];
    mutatedForm['primaryEmail'] = this.lowercase(mutatedForm['primaryEmail']);
    mutatedForm['bankCustomerId'] = this.organizationCode + mutatedForm['mobileNo'];

    this.loaderService.showSpinner(true);
    this.customerService.addCustomer(mutatedForm).subscribe(
      (customerResponse) => {
        this.primaryMobileNo = customerResponse['mobileNo'];
        this.newCustomerId = customerResponse['customerId'];

        // console.log(customerResponse);
        this.loaderService.showSpinner(false);
        this.alertService.info('Customer was saved successfully !');
        setTimeout(() => {
          this.router.navigate(['/mycustomers/new', this.newCustomerId]);
        }, 1000);
      },
      (error) => {
        // console.log('Error adding customer:' + error);
        this.loaderService.showSpinner(false);
        this.alertService.error('Error adding customer: ' + error.error.details[0]);
      },
      () => {
        // console.log('Observer got a complete notification');
        this.disableSubmitButton = false;
      },
    );
  }

  inputEvent(event) {
    // Return date object
    const moment = require('moment');
    const newDate = new Date(event.value);
    // console.log("mment format",moment(newDate).format('YYYY-MM-DD'));
    this.customer.get('dateOfIncorporation').setValue(moment(newDate).format('YYYY-MM-DD'));
  }

  lowercase(value: string) {
    return value.toLowerCase();
  }

  redirectTo() {
    this.router.navigate(['/mycustomers']);
  }

  onSubmit(form: any): void {
    this.customer.markAllAsTouched();
    this.addressList.markAllAsTouched();
    this.contactEmailList.markAllAsTouched();
    this.contactPhoneList.markAllAsTouched();

    this.alertService.clear();
    // console.log('you submitted value:', form);
    this.submitted = true;

    if (this.customer.valid === false) {
      return;
    } else {
      this.sendToAPI();
    }
  }

  get f() {
    return this.customer.controls;
  }

  private initForm() {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDay();
    this.maxTodayDate = new Date();
    this.customer = new FormGroup({
      branchName: new FormControl({ value: null, disabled: !this.showBranchSelector }, [
        Validators.required,
        CustomValidators.notDefaultBranch('Default'),
      ]),
      organizationCode: new FormControl({ value: this.organizationCode, disabled: true }),
      branchCode: new FormControl({ value: this.branchCode, disabled: true }),
      orgName: new FormControl(null, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(50),
      ]),
      dateOfIncorporation: new FormControl(null, [Validators.required]),
      primaryContactName: new FormControl(null, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(45),
      ]),
      primaryEmail: new FormControl(null, [Validators.required, Validators.email]),
      mobileNo: new FormControl(null, [Validators.required, Validators.pattern('^[6-9]\\d{9}$')]),
      panNo: new FormControl(null, [
        Validators.required,
        Validators.pattern('^[A-Z]{5}\\d{4}[A-Z]{1}$'),
      ]),
      gstn: new FormControl(null, [
        Validators.pattern('^\\d{2}[A-Z]{5}\\d{4}[A-Z]{1}[A-Z\\d]{1}[Z]{1}[A-Z\\d]{1}$'),
      ]),
      addressList: new FormArray([]),
      contactEmailList: new FormArray([]),
      contactPhoneList: new FormArray([]),
    });

    this.addressList = this.customer.get('addressList') as FormArray;
    this.addressList.push(this.createNewAddressGroup());

    this.contactEmailList = this.customer.get('contactEmailList') as FormArray;
    this.contactEmailList.push(this.createNewContactEmailGroup());

    this.contactPhoneList = this.customer.get('contactPhoneList') as FormArray;
    this.contactPhoneList.push(this.createNewContactPhoneGroup());
    this.panNo = this.customer.get('panNo') as FormControl;
    this.gstn = this.customer.get('gstn') as FormControl;

    this.panNo.valueChanges.subscribe((pan) => {
      if (pan) {
        if (pan.length === 10) {
          this.panNo.setValue(pan.toString().toUpperCase(), { emitEvent: false });
        }

        if (!this.panValidatorActive) {
          this.panValidatorActive = true;
          this.panNo.setValidators(Validators.pattern('^[A-Z]{5}\\d{4}[A-Z]{1}$'));
          this.panNo.updateValueAndValidity();
        }
      } else {
        if (this.panValidatorActive) {
          this.panValidatorActive = false;
          this.panNo.clearValidators();
          this.panNo.updateValueAndValidity();
        }
      }
    });

    this.gstn.valueChanges.subscribe((gstn) => {
      if (gstn) {
        if (gstn.length === 15) {
          this.gstn.setValue(gstn.toString().toUpperCase(), { emitEvent: false });
        }
        if (!this.gstnValidatorActive) {
          this.gstnValidatorActive = true;
          this.gstn.setValidators(
            Validators.pattern('^\\d{2}[A-Z]{5}\\d{4}[A-Z]{1}[A-Z\\d]{1}[Z]{1}[A-Z\\d]{1}$'),
          );
          this.gstn.updateValueAndValidity();
        }
      } else {
        if (this.gstnValidatorActive) {
          this.gstnValidatorActive = false;
          this.gstn.clearValidators();
          this.gstn.updateValueAndValidity();
        }
      }
    });

    of(this.getBranches()).subscribe((branches) => {
      this.branches = branches;
    });
    const toSelect = this.branches.find((c) => c.id === 'Default');
    if (toSelect) {
      this.customer.get('branchName').setValue(toSelect);
    }
  }

  createNewAddressGroup() {
    const postalcodeRegex = /^[1-9]{1}[0-9]{5,5}$/;
    return new FormGroup({
      addressType: new FormControl(null, [
        Validators.required,
        Validators.pattern('HEADQUARTER|OFFICE'),
      ]),
      addressline1: new FormControl(null, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(50),
      ]),
      addressline2: new FormControl(null, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(50),
      ]),
      addressline3: new FormControl(null, [Validators.maxLength(50)]),
      postalcode: new FormControl(null, [
        Validators.required,
        CustomValidators.pattern(postalcodeRegex),
      ]),
      city: new FormControl(null, [Validators.required]),
      state: new FormControl(null, [Validators.required]),
      district: new FormControl(null),
      country: new FormControl('India', Validators.required),
      countryCode: new FormControl('91'),
    });
  }

  createNewContactEmailGroup() {
    return new FormGroup({
      emailType: new FormControl('EMAIL', [Validators.required, Validators.pattern('EMAIL')]),
      emailText: new FormControl(null, [Validators.required, Validators.email]),
    });
  }

  createNewContactPhoneGroup() {
    return new FormGroup({
      phoneType: new FormControl(null, [
        Validators.required,
        Validators.pattern('HOME_PHONE|WORK_PHONE|MOBILE'),
      ]),
      phoneText: new FormControl(null, [Validators.required, Validators.pattern('^[0-9]{10,10}$')]),
    });
  }

  createNewDependentsGroup() {
    return new FormGroup({
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      dob: new FormControl(null, Validators.required),
      relationshipType: new FormControl(null, [
        Validators.required,
        Validators.pattern('SELF|SPOUSE|SON|DAUGHTER|FATHER|MOTHER|OTHER'),
      ]),
    });
  }

  checkAddType(event: any, index: number) {
    const that = this;
    this.addressList.controls.forEach((item, i) => {
      if (index !== i && item.value.addressType === event.value) {
        that.addressList.at(index).get('addressType').setValue(null);
        that.addressList.markAsTouched();
        return;
      }
    });
  }

  addNewAddressGroup(i) {
    if (this.addressList.valid) {
      if (i < 1) {
        this.addressList.push(this.createNewAddressGroup());
      } else {
        alert('Addresses cannot be more than 2');
      }
    } else {
      this.addressList.markAllAsTouched();
    }
  }

  addNewContactEmailGroup(i) {
    if (this.contactEmailList.valid) {
      if (i < 1) {
        this.contactEmailList.push(this.createNewContactEmailGroup());
      } else {
        alert('Email cannot be more than 2');
      }
    } else {
      this.contactEmailList.markAllAsTouched();
    }
  }

  checkPhoneType(event: any, index: number) {
    const that = this;
    this.contactPhoneList.controls.forEach((item, i) => {
      if (index !== i && item.value.phoneType === event.value) {
        that.contactPhoneList.at(index).get('phoneType').setValue(null);
        that.contactPhoneList.markAsTouched();
        return;
      }
    });
  }

  onKeyPressPhone(event: any, index: number) {
    // console.log(this.contactPhoneList);
    // console.log(this.contactPhoneList.at(index).value);
    // let mutatedForm = this.getFormData();
    const phoneText = this.contactPhoneList.at(index).value.phoneText;
    const phoneType = this.contactPhoneList.at(index).value.phoneType;
    // console.log(mutatedForm['contactPhoneList'][index]);
    const mobileReg = /^[6-9][0-9]{0,8}$/;
    const phoneReg = /^[1-9][0-9]{0,8}$/;
    // console.log(mobileReg.test(phoneText));
    if (phoneType === 'MOBILE' && !mobileReg.test(phoneText)) {
      this.contactPhoneList.at(index).get('phoneText').setValue(null);
      this.contactPhoneList.markAsTouched();
    }

    if (phoneType !== 'MOBILE' && !phoneReg.test(phoneText)) {
      this.contactPhoneList.at(index).get('phoneText').setValue(null);
      this.contactPhoneList.markAsTouched();
    }
  }

  addNewContactPhoneGroup(i) {
    if (this.contactPhoneList.valid) {
      if (i < 2) {
        this.contactPhoneList.push(this.createNewContactPhoneGroup());
      } else {
        alert('Phone cannot be more than 3');
      }
    } else {
      this.contactPhoneList.markAllAsTouched();
    }
  }

  removeAddressGroup(index: number) {
    this.addressList.removeAt(index);
  }

  removeContactEmailGroup(index: number) {
    this.contactEmailList.removeAt(index);
  }

  removeContactPhoneGroup(index: number) {
    this.contactPhoneList.removeAt(index);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params.cif) {
        this.getCustomerByCIF(params.cif);
      }
    });
    this.getAllowedBranches();
  }

  getAllowedBranches() {
    this.customerService.getAllowedBranches().subscribe(
      (branches) => {
        this.loaderService.showSpinner(false);
        // console.log('branches', branches);
        this.allowedBranches = branches;
        this.initForm();
      },
      (error) => {
        // console.log('Error adding customer details' + error);
        this.loaderService.showSpinner(false);
      },
    );
  }

  getBranches() {
    let arr = [];
    arr = this.allowedBranches.map((item) => {
      return { id: item['branchCode'], name: item['branchName'] };
    });
    arr.unshift({ id: 'Default', name: 'Default' });
    return arr;
  }

  onPostalCodeChange(val: string, index: number): void {
    if (val.length === 6) {
      this.loaderService.showSpinner(true);
      this.customerService.getPinData(val).subscribe(
        (postalcode) => {
          this.addressList.at(index).get('city').setValue(postalcode.city);
          this.addressList.at(index).get('state').setValue(postalcode.stateName);
          this.loaderService.showSpinner(false);
          // console.log('pincode' + index);
        },
        (err) => {
          this.loaderService.showSpinner(false);
          // console.log('Error getting Postal code' + err);
        },
      );
    } else {
      this.addressList.at(index).get('city').setValue(null);
      this.addressList.at(index).get('state').setValue(null);
    }
  }

  MinDate(): Date {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDay();

    return new Date(currentYear - 100, currentMonth, currentDay);
  }

  disableSaveButton() {
    if (
      this.customer.get('orgName').valid &&
      this.customer.get('dateOfIncorporation').valid &&
      this.customer.get('primaryContactName').valid &&
      this.customer.get('primaryEmail').valid &&
      this.customer.get('mobileNo').valid &&
      this.addressList.valid &&
      this.contactEmailList.valid &&
      this.contactPhoneList.valid
    ) {
      return true;
    }

    return false;
  }

  getCustomerByCIF(cifNumber: number) {
    this.loaderService.showSpinner(true);
    this.customerService.getCustomerfromBank(cifNumber).subscribe(
      (result) => {
        this.loaderService.showSpinner(false);
        // console.log('result', result);
        this.customerDetails = result;
        this.fillBankCustomerData();
      },
      (error) => {
        this.loaderService.showSpinner(false);
        this.alertService.error(error.error.details);
      },
    );
  }

  fillBankCustomerData() {
    this.customer = new FormGroup({
      branchName: new FormControl({ value: null, disabled: !this.showBranchSelector }, [
        Validators.required,
        CustomValidators.notDefaultBranch('Default'),
      ]),
      organizationCode: new FormControl({
        value: this.customerDetails.organizationCode,
        disabled: true,
      }),
      branchCode: new FormControl({ value: this.customerDetails.branchCode, disabled: true }),
      firstName: new FormControl(this.customerDetails.firstName, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(45),
      ]),
      lastName: new FormControl(this.customerDetails.lastName, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(45),
      ]),
      dob: new FormControl(this.customerDetails.dob, [Validators.required]),
      gender: new FormControl(this.customerDetails.gender, [
        Validators.required,
        Validators.pattern('M|F'),
      ]),
      mobileNo: new FormControl(this.customerDetails.mobileNo, [
        Validators.required,
        Validators.pattern('^[6-9]\\d{9}$'),
      ]),
      addressList: new FormArray([]),
      contactEmailList: new FormArray([]),
      contactPhoneList: new FormArray([]),
      dependentList: new FormArray([]),
    });

    this.disableSaveButton();

    this.addressList = this.customer.get('addressList') as FormArray;

    if (this.customerDetails.addressList) {
      // console.log('address list', this.customerDetails.addressList);
      let i = 0;
      this.customerDetails.addressList.forEach((addressList) => {
        this.addressForm = this.createNewAddressGroup();
        this.addressForm.setValue({
          // id: addressList.id,
          addressType: addressList.addressType,
          addressline1: addressList.addressline1,
          addressline2: addressList.addressline2,
          addressline3: 'addressline3' in addressList ? addressList.addressline3 : null,
          postalcode: addressList.postalcode,
          city: addressList.city,
          state: 'state' in addressList ? addressList.state : null,
          district: 'district' in addressList ? addressList.district : null,
          country: addressList.country,
          countryCode: addressList.countryCode,
        });
        this.addressList.push(this.addressForm);
        this.onPostalCodeChange(addressList.postalcode, i);
        i++;
      });
    } else {
      this.addressList.push(this.createNewAddressGroup());
    }

    this.contactEmailList = this.customer.get('contactEmailList') as FormArray;
    this.contactPhoneList = this.customer.get('contactPhoneList') as FormArray;

    if (this.customerDetails.contactList) {
      this.customerDetails.contactList.forEach((contactList) => {
        if (contactList.contactType === 'EMAIL' || contactList.contactType === 'email') {
          this.emailForm = this.createNewContactEmailGroup();
          this.emailForm.setValue({
            // id: contactList.id,
            emailType: 'EMAIL',
            emailText: contactList.contactText,
          });
          this.contactEmailList.push(this.emailForm);
        } else {
          this.phoneForm = this.createNewContactPhoneGroup();
          this.phoneForm.setValue({
            // id: contactList.id,
            phoneType: contactList.contactType,
            phoneText: contactList.contactText,
          });
          this.contactPhoneList.push(this.phoneForm);
        }
      });
    } else {
      this.contactEmailList.push(this.createNewContactEmailGroup());
      this.contactPhoneList.push(this.createNewContactPhoneGroup());
    }

    if (this.contactEmailList.value.length === 0) {
      this.contactEmailList.push(this.createNewContactEmailGroup());
    }

    if (this.contactPhoneList.value.length === 0) {
      this.contactPhoneList.push(this.createNewContactPhoneGroup());
    }

    of(this.getBranches()).subscribe((branches) => {
      this.branches = branches;
    });
    const toSelect = this.branches.find((c) => c.id === 'Default');
    // console.log('branch select', toSelect);
    if (toSelect) {
      this.customer.get('branchName').setValue(toSelect);
    }
  }
}
