import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import {
  IndividualCustomer,
  Contacts,
  Addresses,
  Dependents,
  CustomerNotifications,
  CustomerApplications,
  Customer,
} from '@interface/Customer';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { CustomValidators } from '@app/_helpers/CustomValidators';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MY_FORMATS } from '../../../shared/utils/moment';
import { AccountService } from '@app/_services/account.service';
import { CustomersService } from '../../services/customers.service';
import { of } from 'rxjs';
import { TranslatePipe, TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { AlertModule } from '@app/_components/alert.module';
import { AlertService } from '../../../_services';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '@app/_services/loader.service';

@Component({
  selector: 'app-individual-feature',
  templateUrl: './individual-feature.component.html',
  styleUrls: ['./individual-feature.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class IndividualFeatureComponent implements OnInit {
  submitted = false;

  customer: FormGroup;

  addressList: FormArray;

  contactEmailList: FormArray;

  contactPhoneList: FormArray;

  dependentList: FormArray;

  disableSubmitButton = false;

  organizationCode: string;

  branchCode: string;

  showBranchSelector = false;

  branches = null;

  branchSelector: FormControl;

  notEditable = true;

  maxAdultDate: Date;

  isLoading = false;

  public validationMessages = {};

  csfInfo: FormGroup;

  customerDetails;

  emailForm;

  addressForm;

  phoneForm;

  dependentForm;

  allowedBranches;

  DepDobPicker = true;

  relation;

  isCif = false;

  cifNumber;

  primaryMobileNo;

  newCustomerId;

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

  // public csfForm() {
  //   this.csfInfo = new FormGroup({
  //     csfId: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(45)]),
  //   });
  // }

  private getValidationMsg() {
    return {
      branchName: [
        { type: 'required', message: this.translateService.instant('error.BRANCH_IS_REQUIRED') },
        { type: 'notDefaultBranch', message: this.translateService.instant('error.SELECT_BRANCH') },
      ],
      customerId: [
        { type: 'required', message: this.translateService.instant('error.CUSTOMER_ID_REQUIRED') },
      ],
      firstName: [
        { type: 'required', message: this.translateService.instant('error.FIRST_NAME_REQUIRED') },
        { type: 'minlength', message: this.translateService.instant('error.FIRST_NAME_MAX') },
        { type: 'maxlength', message: this.translateService.instant('error.FIRST_NAME_MAX') },
      ],
      lastName: [
        { type: 'required', message: this.translateService.instant('error.LAST_NAME_REQUIRED') },
        { type: 'minlength', message: this.translateService.instant('error.LAST_NAME_MIN') },
        { type: 'maxlength', message: this.translateService.instant('error.LAST_NAME_MAX') },
      ],
      dob: [
        { type: 'required', message: this.translateService.instant('error.DOB_REQUIRED') },
        {
          type: 'pattern',
          message: this.translateService.instant('error.DATE_YYYY_MM_DD_REQUIRED'),
        },
        {
          type: 'underEighteen',
          message: this.translateService.instant('error.DOB_UNDER_EIGHTEEN'),
        },
      ],
      gender: [
        { type: 'required', message: this.translateService.instant('error.GENDER_REQUIRED') },
        { type: 'pattern', message: this.translateService.instant('error.GENDER_INVALID') },
      ],
      mobileNo: [
        { type: 'required', message: this.translateService.instant('error.MOBILE_REQUIRED') },
        { type: 'pattern', message: this.translateService.instant('error.MOBILE_INVALID') },
        { type: 'minlength', message: this.translateService.instant('error.MOBILE_MIN') },
        { type: 'maxlength', message: this.translateService.instant('error.MOBILE_MAX') },
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
      dependentsFirstName: [
        {
          type: 'required',
          message: this.translateService.instant('error.DEPENDENT_FIRST_NAME_REQUIRED'),
        },
      ],
      dependentsLastName: [
        {
          type: 'required',
          message: this.translateService.instant('error.DEPENDENT_LAST_NAME_REQUIRED'),
        },
      ],
      dependentsDob: [
        {
          type: 'required',
          message: this.translateService.instant('error.DEPENDENTS_DOB_REQUIRED'),
        },
        {
          type: 'underEighteen',
          message: this.translateService.instant('error.DOB_UNDER_EIGHTEEN'),
        },
      ],
      relationshipType: [
        {
          type: 'required',
          message: this.translateService.instant('error.DEPENDENTS_RELATIONSHIP_TYPE'),
        },
      ],
    };
  }

  checkValueTest(event: any) {
    // console.log('date picker', event);
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

  redirectTo() {
    this.router.navigate(['/mycustomers']);
  }

  inputEvent(event) {
    // Return date object
    const moment = require('moment');
    const newDate = new Date(event.value);
    // console.log("mment format",moment(newDate).format('YYYY-MM-DD'));
    this.customer.get('dob').setValue(moment(newDate).format('YYYY-MM-DD'));
  }

  inputEvent2(event, index) {
    // Return date object
    const that = this;
    const moment = require('moment');
    const newDate = new Date(event.value);
    // console.log("mment format",moment(newDate).format('YYYY-MM-DD'));
    // this.dependentList.controls.forEach(function(item, i) {
    that.dependentList.at(index).get('dob').setValue(moment(newDate).format('YYYY-MM-DD'));
    // });
  }

  sendToAPI() {
    const formObj = this.customer.getRawValue();

    const serializedForm = JSON.stringify(formObj);
    const that = this;

    const mutatedForm = JSON.parse(serializedForm);
    // console.log(mutatedForm);
    if (mutatedForm['branchName'].id !== 'Default') {
      mutatedForm['branchCode'] = mutatedForm['branchName'].id;
    } else {
      mutatedForm['branchCode'] = this.branchCode;
    }

    delete mutatedForm['branchName'];
    delete mutatedForm['customerId'];
    mutatedForm['isIndividual'] = true;
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
    // console.log('before split', mutatedForm['dob']);
    mutatedForm['dob'] = mutatedForm['dob'].split('T')[0];
    // console.log('after split', mutatedForm['dob']);
    // console.log(mutatedForm['dependentList']);
    // if(mutatedForm['dependentList'])
    mutatedForm['dependentList'].forEach((item, key) => {
      // console.log('key', key);
      if (item.dob != null) {
        item.dob = item.dob.split('T')[0];
      }
      if (
        item.firstName == null ||
        (item.firstName === '' && item.lastName == null) ||
        (item.lastName === '' && item.dob == null) ||
        (item.dob === '' && item.relationshipType == null) ||
        item.relationshipType === ''
      ) {
        mutatedForm['dependentList'].splice(key);
      }
    });

    // console.log(mutatedForm['dependentList']);
    // console.log(mutatedForm['dependentList'].length);

    if (mutatedForm['dependentList'].length === 0) {
      delete mutatedForm['dependentList'];
    }
    // return ;
    mutatedForm['bankCustomerId'] = this.organizationCode + mutatedForm['mobileNo'];

    if (this.isCif) {
      mutatedForm['bankCustomerId'] = this.cifNumber;
    }

    this.loaderService.showSpinner(true);
    this.customerService.addCustomer(mutatedForm).subscribe(
      (customerResponse) => {
        this.primaryMobileNo = customerResponse['mobileNo'];
        this.newCustomerId = customerResponse['customerId'];
        console.log(customerResponse, this.primaryMobileNo);
        this.loaderService.showSpinner(false);
        this.alertService.info('Customer was saved successfully !');
        setTimeout(() => {
          this.router.navigate(['/mycustomers/new', this.newCustomerId]);
        }, 1000);
      },
      (error) => {
        // console.log('Error adding customer details' + error);
        this.loaderService.showSpinner(false);
        this.alertService.error('Error adding customer: ' + error.error.details[0]);
      },
      () => {
        // console.log('Observer got a complete notification');
        this.loaderService.showSpinner(false);
        this.disableSubmitButton = false;
      },
    );
  }

  lowercase(value: string) {
    return value.toLowerCase();
  }

  disableSaveButton() {
    if (
      this.customer.get('firstName').valid &&
      this.customer.get('lastName').valid &&
      this.customer.get('dob').valid &&
      this.customer.get('gender').valid &&
      this.customer.get('mobileNo').valid &&
      this.addressList.valid &&
      this.contactEmailList.valid &&
      this.contactPhoneList.valid
    ) {
      return true;
    }
    return false;
  }

  onSubmit(form: any): void {
    this.customer.markAllAsTouched();
    this.addressList.markAllAsTouched();
    this.contactEmailList.markAllAsTouched();
    this.contactPhoneList.markAllAsTouched();
    this.dependentList.markAllAsTouched();

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
    this.maxAdultDate = new Date(currentYear - 18, currentMonth, currentDay);
    this.customer = new FormGroup({
      branchName: new FormControl({ value: null, disabled: !this.showBranchSelector }, [
        Validators.required,
        CustomValidators.notDefaultBranch('Default'),
      ]),
      organizationCode: new FormControl({ value: this.organizationCode, disabled: true }),
      branchCode: new FormControl({ value: this.branchCode, disabled: true }),
      customerId: new FormControl({ value: null, disabled: true }),
      firstName: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(45),
      ]),
      lastName: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(45),
      ]),
      dob: new FormControl(null, [Validators.required]),
      gender: new FormControl(null, [Validators.required, Validators.pattern('M|F')]),
      mobileNo: new FormControl(null, [Validators.required, Validators.pattern('^[6-9]\\d{9}$')]),
      addressList: new FormArray([]),
      contactEmailList: new FormArray([]),
      contactPhoneList: new FormArray([]),
      dependentList: new FormArray([]),
    });

    this.addressList = this.customer.get('addressList') as FormArray;
    this.addressList.push(this.createNewAddressGroup());

    this.contactEmailList = this.customer.get('contactEmailList') as FormArray;
    this.contactEmailList.push(this.createNewContactEmailGroup());

    this.contactPhoneList = this.customer.get('contactPhoneList') as FormArray;
    this.contactPhoneList.push(this.createNewContactPhoneGroup());

    this.dependentList = this.customer.get('dependentList') as FormArray;
    this.dependentList.push(this.createNewDependentsGroup());

    of(this.getBranches()).subscribe((branches) => {
      this.branches = branches;
    });
    const toSelect = this.branches.find((c) => c.id === 'Default');
    // console.log('branch select', toSelect);
    if (toSelect) {
      this.customer.get('branchName').setValue(toSelect);
    }
  }

  createNewAddressGroup() {
    const postalcodeRegex = /^[1-9]{1}[0-9]{5,5}$/;
    return new FormGroup({
      addressType: new FormControl(null, [
        Validators.required,
        Validators.pattern('PERMANENT|CORRESPONDENCE|OFFICE'),
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
      firstName: new FormControl(null),
      lastName: new FormControl(null),
      dob: new FormControl(null),
      relationshipType: new FormControl(null),
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
      if (i < 2) {
        this.addressList.push(this.createNewAddressGroup());
      } else {
        alert('Addresses cannot be more than 3');
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

  checkRelType(event: any, index: number) {
    const that = this;
    let checkWife = 0;
    let checkFather = 0;
    let checkMother = 0;
    let checkHusband = 0;
    let checkMotherInLaw = 0;
    let checkFatherInLaw = 0;
    this.dependentList.controls.forEach((item, i) => {
      if (index !== i && item.value.relationshipType === event.value && event.value === '14') {
        checkFather++;
        // console.log(checkMother);
        // console.log(checkFather);
        if (checkFather > 0) {
          that.dependentList.at(index).get('relationshipType').setValue(null);
          that.dependentList.markAsTouched();
          return;
        }
      }
      if (index !== i && item.value.relationshipType === event.value && event.value === '7') {
        checkMother++;
        // console.log(checkMother);
        // console.log(checkFather);
        if (checkMother > 0) {
          that.dependentList.at(index).get('relationshipType').setValue(null);
          that.dependentList.markAsTouched();
          return;
        }
      }
      if (index !== i && item.value.relationshipType === event.value && event.value === '13') {
        checkMotherInLaw++;
        // console.log(checkMother);
        // console.log(checkFather);
        if (checkMotherInLaw > 0) {
          that.dependentList.at(index).get('relationshipType').setValue(null);
          that.dependentList.markAsTouched();
          return;
        }
      }
      if (index !== i && item.value.relationshipType === event.value && event.value === '8') {
        checkFatherInLaw++;
        // console.log(checkMother);
        // console.log(checkFather);
        if (checkFatherInLaw > 0) {
          that.dependentList.at(index).get('relationshipType').setValue(null);
          that.dependentList.markAsTouched();
          return;
        }
      }
      if (index !== i && item.value.relationshipType === event.value && event.value === '3') {
        checkHusband++;
        // console.log(checkMother);
        // console.log(checkFather);
        if (checkHusband > 0) {
          that.dependentList.at(index).get('relationshipType').setValue(null);
          that.dependentList.markAsTouched();
          return;
        }
      }
      if (index !== i && item.value.relationshipType === event.value && event.value === '2') {
        checkWife++;
        if (checkWife > 3) {
          that.dependentList.at(index).get('relationshipType').setValue(null);
          that.dependentList.markAsTouched();
          return;
        }
      }
    });
  }

  addNewDependentsGroup(i) {
    if (this.dependentList.valid) {
      if (i < 9) {
        this.dependentList.push(this.createNewDependentsGroup());
      } else {
        alert('Dependent cannot be more than 10');
      }
    } else {
      this.dependentList.markAllAsTouched();
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

  removeDependentsGroup(index: number) {
    this.dependentList.removeAt(index);
  }

  ngOnInit(): void {
    // this.csfForm();
    this.getAllowedBranches();
    this.getRelationship();
    this.route.queryParams.subscribe((params) => {
      if (params.cif) {
        this.isCif = true;
        this.cifNumber = params.cif;
        this.getCustomerByCIF(params.cif);
      }
    });
  }

  getRelationship() {
    this.customerService.getRelationship().subscribe(
      (relationship) => {
        // console.log(relationship);
        this.relation = relationship;
      },
      (error) => {
        // console.log(error);
      },
    );
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
    // console.log('allowed branches', this.allowedBranches);
    let arr = [];
    arr = this.allowedBranches.map((item) => {
      return { id: item['branchCode'], name: item['branchName'] };
    });
    arr.unshift({ id: 'Default', name: 'Default' });
    return arr;
  }

  onPostalCodeChange(val: string, index: number): void {
    // console.log('postal api called');
    if (val.length === 6) {
      this.loaderService.showSpinner(true);
      this.customerService.getPinData(val).subscribe(
        (postalcode) => {
          this.addressList.at(index).get('city').setValue(postalcode.city);
          this.addressList.at(index).get('state').setValue(postalcode.stateName);
          this.loaderService.showSpinner(false);
        },
        (err) => {
          // console.log('Error getting Postal code' + err);
          this.loaderService.showSpinner(false);
        },
      );
    } else {
      this.addressList.at(index).get('city').setValue(null);
      this.addressList.at(index).get('state').setValue(null);
    }
  }

  dependentMaxDate(index: number): Date {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDay();
    const val = this.dependentList.at(index).get('relationshipType').value;
    if (val) {
      this.dependentList.at(index).get('dob').enable();
      switch (val) {
        case '2':
        case '3':
        case '7':
        case '8':
        case '13':
        case '14':
          return new Date(currentYear - 18, currentMonth, currentDay);
          break;
        case '4':
        case '5':
          // case 'OTHER':
          return new Date();
          break;
        default:
          return new Date(currentYear - 18, currentMonth, currentDay);
      }
    } else {
      return new Date(currentYear - 18, currentMonth, currentDay);
    }
  }

  MinDate(): Date {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDay();

    return new Date(currentYear - 100, currentMonth, currentDay);
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
      customerId: new FormControl({ value: this.customerDetails.customerId, disabled: true }),
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

    this.dependentList = this.customer.get('dependentList') as FormArray;
    if (this.customerDetails.dependentList) {
      this.customerDetails.dependentList.forEach((dependentList) => {
        this.dependentForm = this.createNewDependentsGroup();
        this.dependentForm.setValue({
          // id: dependentList.id,
          firstName: dependentList.firstName,
          lastName: dependentList.lastName,
          dob: dependentList.dob,
          relationshipType: dependentList.relationshipType,
        });
        this.dependentList.push(this.dependentForm);
      });
    } else {
      this.dependentList.push(this.createNewDependentsGroup());
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
