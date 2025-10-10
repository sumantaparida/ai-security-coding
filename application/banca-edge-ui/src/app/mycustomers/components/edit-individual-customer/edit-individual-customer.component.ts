import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  IndividualCustomer,
  Contacts,
  Addresses,
  Dependents,
  CustomerNotifications,
  CustomerApplications,
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
import { constants } from 'perf_hooks';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';

import { LoaderService } from '@app/_services/loader.service';
@Component({
  selector: 'app-edit-individual-customer',
  templateUrl: './edit-individual-customer.component.html',
  styleUrls: ['./edit-individual-customer.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class EditIndividualCustomerComponent implements OnInit {
  customerId: number;
  customerDetails;
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
  public validationMessages = {};
  emailForm;
  addressForm;
  phoneForm;
  dependentForm;
  isLoading = false;
  allowedBranches;
  relation;

  constructor(
    private accountService: AccountService,
    private customerService: CustomersService,
    private translateService: TranslateService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private loaderService: LoaderService,
  ) {
    this.route.params.subscribe((params) => {
      if (params.CID) {
        this.customerId = params.CID;
      } else {
        this.customerId = null;
      }
    });

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

  ngOnInit(): void {
    this.loaderService.showSpinner(true);
    this.customerService.getCustomerById(this.customerId).subscribe(
      (customerResponse) => {
        this.loaderService.showSpinner(false);
        // console.log('Response', customerResponse);
        this.customerDetails = customerResponse;
        // console.log('Customer Details', this.customerDetails);
        // console.log(this.customerDetails.firstName);
        this.getAllowedBranches();
        this.getRelationship();
      },
      (error) => {
        this.loaderService.showSpinner(false);
        // console.log('Error fetching customer' + error);
      },
    );
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

  redirectTo() {
    this.router.navigate(['/mycustomers']);
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

  inputEvent(event) {
    // Return date object
    const moment = require('moment');
    const newDate = new Date(event.value);
    this.customer.get('dob').setValue(moment(newDate).format('YYYY-MM-DD'));
  }

  inputEvent2(event, index) {
    // Return date object
    const that = this;
    const moment = require('moment');
    const newDate = new Date(event.value);
    that.dependentList.at(index).get('dob').setValue(moment(newDate).format('YYYY-MM-DD'));
  }

  sendToAPI() {
    const formObj = this.customer.getRawValue();

    const serializedForm = JSON.stringify(formObj);

    const mutatedForm = JSON.parse(serializedForm);
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
        id: item.id,
        contactType: item.emailType,
        contactText: item.emailText,
      });
    });
    mutatedForm['contactPhoneList'].forEach((item) => {
      mutatedForm['contactList'].push({
        id: item.id,
        contactType: item.phoneType,
        contactText: item.phoneText,
      });
    });
    delete mutatedForm['contactEmailList'];
    delete mutatedForm['contactPhoneList'];

    // console.log('before split', mutatedForm['dob']);
    mutatedForm['dob'] = mutatedForm['dob'].split('T')[0];
    // console.log('after split', mutatedForm['dob']);
    // mutatedForm['dependentList'].forEach(function (item) { item.dob = item.dob.split('T')[0] });

    const contactDiff = mutatedForm['contactList'].filter(
      (x) => !this.customerDetails.contactList.some((x2) => x.id === x2.id),
    );
    const addressDiff = mutatedForm['addressList'].filter(
      (x) => !this.customerDetails.addressList.some((x2) => x.id === x2.id),
    );

    delete mutatedForm['contactList'];
    delete mutatedForm['dependentList'];
    delete mutatedForm['addressList'];

    // console.log('request data', mutatedForm);
    // return;

    this.loaderService.showSpinner(true);
    this.customerService.updateCustomer(mutatedForm, this.customerId).subscribe(
      (customerResponse) => {
        if (contactDiff.length > 0) {
          contactDiff.forEach((arr) => {
            this.addContact(arr);
          });
          console.log('hiii contact added');
        }
        if (addressDiff.length > 0) {
          addressDiff.forEach((arr) => {
            this.addAddress(arr);
          });
          console.log('hiii address added', addressDiff);
        }
        this.loaderService.showSpinner(false);

        // console.log(customerResponse);
        this.alertService.info('Customer was updated successfully !');
        setTimeout(() => {
          this.redirectTo();
        }, 1000);
      },
      (error) => {
        this.loaderService.showSpinner(false);
        // console.log('Error updating customer' + error);
        this.alertService.error('Error updating customer: ' + error.error.details);
      },
      () => {
        this.loaderService.showSpinner(false);
        // console.log('Observer got a complete notification');
        this.disableSubmitButton = false;
      },
    );
  }

  lowercase(value: string) {
    return value.toLowerCase();
  }

  addContact(data) {
    this.customerService.addContact(this.customerId, data).subscribe(
      () => {},
      (error) => {},
    );
  }
  addAddress(data) {
    this.customerService.addAddress(this.customerId, data).subscribe(
      () => {},
      (error) => {},
    );
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
      this.customerDetails.addressList.forEach((addressList) => {
        this.addressForm = this.createNewAddressGroup();
        this.addressForm.setValue({
          id: addressList.id,
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
            id: contactList.id,
            emailType: 'EMAIL',
            emailText: contactList.contactText,
          });
          this.contactEmailList.push(this.emailForm);
        } else {
          this.phoneForm = this.createNewContactPhoneGroup();
          this.phoneForm.setValue({
            id: contactList.id,
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
          id: dependentList.id,
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
    if (toSelect) {
      this.customer.get('branchName').setValue(toSelect);
    }
  }

  makeReadOnly(id: number) {
    // console.log("id of data",id);
    return id !== null ? true : false;
  }

  makeDisabled(id: number) {
    return id !== null ? true : false;
  }

  getFormData() {
    const formObj = this.customer.getRawValue();

    const serializedForm = JSON.stringify(formObj);

    const mutatedForm = JSON.parse(serializedForm);
    return mutatedForm;
  }

  onFocusOutAddress(event: any, index: number) {
    const mutatedForm = this.getFormData();

    if (this.addressList.valid) {
      if (mutatedForm['addressList'][index]['id'] !== null) {
        return false;
      }
      // add address
      // this.loaderService.showSpinner(true);
      // this.customerService.addAddress(this.customerId, mutatedForm['addressList'][index]).subscribe(
      //   customerResponse => {
      //     setTimeout(() => {
      //       this.loaderService.showSpinner(false);
      //     }, 3000);
      //     // console.log(customerResponse);
      //     // this.alertService.info('Address added successfully !');
      //     this.showMessage('Address added successfully !');
      //     this.ngOnInit();
      //   },
      //   error => {
      //     this.loaderService.showSpinner(false);
      //     // console.log("Error adding address" + error);
      //     // this.alertService.error('Error adding address: ' + error.error.details[0]);
      //     this.showMessage('Error adding address: ' + error.error.details);
      //   },
      //   () => {
      //     // console.log('Observer got a complete notification');
      //     this.disableSubmitButton = false;

      //   }
      // );
    } else {
      this.addressList.markAllAsTouched();
    }
  }

  onFocusOutEmail(event: any, index: number) {
    // console.log(event.target.value);
    const mutatedForm = this.getFormData();
    // console.log("all form data -->", mutatedForm);
    // console.log(mutatedForm['contactEmailList'][index]);
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const emailValue = mutatedForm['contactEmailList'][index].emailText;
    // console.log(re.test(emailValue));
    if (this.contactEmailList.valid) {
      // console.log('all value is filled');
      if (mutatedForm['contactEmailList'][index]['id'] !== null) {
        return false;
      }

      // add address
      mutatedForm['contactEmailList'][index].contactType =
        mutatedForm['contactEmailList'][index].emailType;
      mutatedForm['contactEmailList'][index].contactText = this.lowercase(
        mutatedForm['contactEmailList'][index].emailText,
      );
      delete mutatedForm['contactEmailList'][index].emailType;
      delete mutatedForm['contactEmailList'][index].emailText;
      // this.loaderService.showSpinner(true);
      // this.customerService.addContact(this.customerId, mutatedForm['contactEmailList'][index]).subscribe(
      //   customerResponse => {
      //     setTimeout(() => {
      //       this.loaderService.showSpinner(false);
      //     }, 3000);

      //     this.showMessage('Email added successfully !');
      //     this.ngOnInit();
      //   },
      //   error => {
      //     this.loaderService.showSpinner(false);

      //     this.showMessage('Error adding email: ' + error.error.details);
      //   },
      //   () => {

      //     this.disableSubmitButton = false;

      //   }
      // );
    } else {
      this.contactEmailList.markAllAsTouched();
    }
  }

  onKeyPressPhone(event: any, index: number) {
    const mutatedForm = this.getFormData();
    const phoneCheck = mutatedForm['contactPhoneList'][index].phoneText;
    // console.log(mutatedForm['contactPhoneList'][index]);
    const mobileReg = /^[6-9][0-9]{0,8}$/;
    const phoneReg = /^[1-9][0-9]{0,8}$/;
    if (
      mutatedForm['contactPhoneList'][index].phoneType === 'MOBILE' &&
      !mobileReg.test(phoneCheck)
    ) {
      event.target.value = '';
      this.contactPhoneList.markAsTouched();
      // event.preventDefault();
    }

    if (
      mutatedForm['contactPhoneList'][index].phoneType !== 'MOBILE' &&
      !phoneReg.test(phoneCheck)
    ) {
      event.target.value = '';
      this.contactPhoneList.markAsTouched();
    }
  }

  onFocusOutPhone(event: any, index: number) {
    // console.log(event.target.value);
    const mutatedForm = this.getFormData();
    // console.log("all form data -->", mutatedForm);
    // console.log(mutatedForm['contactPhoneList'][index]);
    const phoneCheck = mutatedForm['contactPhoneList'][index].phoneText;
    if (this.contactPhoneList.valid) {
      // console.log('all value is filled');
      if (mutatedForm['contactPhoneList'][index]['id'] != null) {
        return false;
      }
      // add address
      mutatedForm['contactPhoneList'][index].contactType =
        mutatedForm['contactPhoneList'][index].phoneType;
      mutatedForm['contactPhoneList'][index].contactText =
        mutatedForm['contactPhoneList'][index].phoneText;
      delete mutatedForm['contactPhoneList'][index].phoneType;
      delete mutatedForm['contactPhoneList'][index].phoneText;
      // this.loaderService.showSpinner(true);
      // this.customerService.addContact(this.customerId, mutatedForm['contactPhoneList'][index]).subscribe(
      //   customerResponse => {
      //     setTimeout(() => {
      //       this.loaderService.showSpinner(false);

      //       this.showMessage('Phone added successfully !');
      //       this.ngOnInit();
      //     }, 3000);
      //   },
      //   error => {
      //     this.loaderService.showSpinner(false);

      //     this.showMessage('Error adding phone: ' + error.error.details);
      //   },
      //   () => {
      //     this.disableSubmitButton = false;
      //   }
      // );
    } else {
      this.contactPhoneList.markAsTouched();
    }
  }

  onFocusOutDependent(event: any, index: number) {
    const mutatedForm = this.getFormData();
    let checkDepValue = true;
    if (
      mutatedForm['dependentList'][index]['firstName'] == null ||
      mutatedForm['dependentList'][index]['firstName'] === '' ||
      mutatedForm['dependentList'][index]['lastName'] == null ||
      mutatedForm['dependentList'][index]['lastName'] === '' ||
      mutatedForm['dependentList'][index]['dob'] == null ||
      mutatedForm['dependentList'][index]['dob'] === '' ||
      mutatedForm['dependentList'][index]['relationshipType'] == null ||
      mutatedForm['dependentList'][index]['relationshipType'] === ''
    ) {
      checkDepValue = false;
    }

    if (checkDepValue) {
      if (mutatedForm['dependentList'][index]['id'] !== null) {
        return false;
      }

      this.loaderService.showSpinner(true);
      this.customerService
        .addDependent(this.customerId, mutatedForm['dependentList'][index])
        .subscribe(
          (customerResponse) => {
            setTimeout(() => {
              this.loaderService.showSpinner(false);
            }, 3000);
            this.showMessage('Dependent added successfully !');
            this.ngOnInit();
          },
          (error) => {
            this.loaderService.showSpinner(false);
            // this.alertService.error('Error adding dependent: ' + error.error.details[0]);
            this.showMessage('Error adding dependent: ' + error.error.details);
          },
          () => {
            // console.log('Observer got a complete notification');
            this.disableSubmitButton = false;
          },
        );
    }
  }

  disableSaveButton() {
    if (
      this.customer.get('firstName').valid &&
      this.customer.get('lastName').valid &&
      this.customer.get('dob').valid &&
      this.customer.get('gender').valid &&
      this.customer.get('mobileNo').valid
    ) {
      return true;
    }

    return false;
  }

  createNewAddressGroup() {
    const postalcodeRegex: RegExp = /^[1-9]{1}[0-9]{5,5}$/;
    return new FormGroup({
      id: new FormControl(null),
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
      id: new FormControl(null),
      emailType: new FormControl('EMAIL', [Validators.required, Validators.pattern('EMAIL')]),
      emailText: new FormControl(null, [Validators.required, Validators.email]),
    });
  }

  createNewContactPhoneGroup() {
    return new FormGroup({
      id: new FormControl(null),
      phoneType: new FormControl(null, [
        Validators.required,
        Validators.pattern('HOME_PHONE|WORK_PHONE|MOBILE'),
      ]),
      phoneText: new FormControl(null, [Validators.required, Validators.pattern('^[0-9]{10,10}$')]),
    });
  }

  createNewDependentsGroup() {
    return new FormGroup({
      id: new FormControl(null),
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
        // alert('Addresses cannot be more than 3');
        this.showMessage('Addresses cannot be more than 3');
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
        // alert('Email cannot be more than 2');
        this.showMessage('Email cannot be more than 2');
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

  addNewContactPhoneGroup(i) {
    if (this.contactPhoneList.valid) {
      if (i < 2) {
        this.contactPhoneList.push(this.createNewContactPhoneGroup());
      } else {
        // alert('Phone cannot be more than 3');
        this.showMessage('Phone cannot be more than 3');
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
    const mutatedForm = this.getFormData();
    let checkDepValue = true;
    // console.log("all form data -->", mutatedForm);
    // console.log(mutatedForm['dependentList']);
    mutatedForm['dependentList'].forEach((item, key) => {
      if (
        item.firstName == null ||
        (item.firstName === '' && item.lastName == null) ||
        (item.lastName === '' && item.dob == null) ||
        (item.dob === '' && item.relationshipType == null) ||
        item.relationshipType === ''
      ) {
        checkDepValue = false;
      }
    });

    // console.log('dep value', checkDepValue);
    // this.addDependentValidation();

    if (checkDepValue) {
      if (i < 9) {
        this.dependentList.push(this.createNewDependentsGroup());
      } else {
        // alert('Dependent cannot be more than 10');
        this.showMessage('Dependent cannot be more than 10');
      }
    } else {
      // this.dependentList.markAllAsTouched();
      // alert('Dependent data are required');
      this.showMessage('Dependent data are required');
    }
  }

  removeAddressGroup(index: number, id: number) {
    if (id != null) {
      // console.log(id);
      this.loaderService.showSpinner(true);
      this.customerService.removeAddress(this.customerId, id).subscribe(
        (customerResponse) => {
          this.loaderService.showSpinner(false);
          // console.log(customerResponse);
          // this.alertService.info("Address removed successfully !");
          this.showMessage('Address removed successfully !');
          this.addressList.removeAt(index);
          // this.ngOnInit();
        },
        (error) => {
          this.loaderService.showSpinner(false);
          // console.log('Error removing address' + error);
          // this.alertService.error("Error removing address: " + error);
          this.showMessage('Error removing address: ' + error.error.details);
        },
        () => {
          // console.log('Observer got a complete notification');
        },
      );
    } else {
      this.addressList.removeAt(index);
    }
  }

  removeContactEmailGroup(index: number, id: number) {
    if (id != null) {
      // console.log(id);
      this.loaderService.showSpinner(true);
      this.customerService.removeContact(this.customerId, id).subscribe(
        (customerResponse) => {
          this.loaderService.showSpinner(false);
          // console.log(customerResponse);
          // this.alertService.info("Email removed successfully !");
          this.showMessage('Email removed successfully !');
          this.contactEmailList.removeAt(index);
          // this.ngOnInit();
        },
        (error) => {
          this.loaderService.showSpinner(false);
          // console.log('Error removing email' + error);
          // this.alertService.error("Error removing email: " + error);
          this.showMessage('Error removing email: ' + error.error.details);
        },
        () => {
          // console.log('Observer got a complete notification');
        },
      );
    } else {
      this.contactEmailList.removeAt(index);
    }
  }

  removeContactPhoneGroup(index: number, id: number) {
    if (id != null) {
      // console.log(id);
      this.loaderService.showSpinner(true);
      this.customerService.removeContact(this.customerId, id).subscribe(
        (customerResponse) => {
          this.loaderService.showSpinner(false);
          // console.log(customerResponse);
          // this.alertService.info("Phone removed successfully !");
          this.showMessage('Phone removed successfully !');
          this.contactPhoneList.removeAt(index);
          // this.ngOnInit();
        },
        (error) => {
          this.loaderService.showSpinner(false);
          // console.log('Error removing Phone' + error);
          // this.alertService.error("Error removing Phone: " + error);
          this.showMessage('Error removing Phone:' + error.error.details);
        },
        () => {
          // console.log('Observer got a complete notification');
        },
      );
    } else {
      this.contactPhoneList.removeAt(index);
    }
  }

  removeDependentsGroup(index: number, id: number) {
    if (id != null) {
      // console.log(id);
      this.loaderService.showSpinner(true);
      this.customerService.removeDependents(this.customerId, id).subscribe(
        (customerResponse) => {
          this.loaderService.showSpinner(false);
          // console.log(customerResponse);
          // this.alertService.info('Dependent removed successfully !');
          this.showMessage('Dependent removed successfully !');
          this.dependentList.removeAt(index);
          this.ngOnInit();
        },
        (error) => {
          this.loaderService.showSpinner(false);
          // console.log('Error removing Dependent' + error);
          // this.alertService.error('Error removing Dependent: ' + error.error.details);
          this.showMessage('Error removing Dependent: ' + error.error.details);
        },
        () => {
          // console.log('Observer got a complete notification');
        },
      );
    } else {
      this.dependentList.removeAt(index);
    }
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
          this.loaderService.showSpinner(false);
          this.addressList.at(index).get('city').setValue(postalcode.city);
          this.addressList.at(index).get('state').setValue(postalcode.stateName);
        },
        (err) => {
          this.loaderService.showSpinner(true);
          // console.log('Error getting Postal code' + err);
        },
      );
    } else {
      this.addressList.at(index).get('city').setValue(null);
      this.addressList.at(index).get('state').setValue(null);
    }
  }
  dependentMaxDate(index: number, id: number): Date {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDay();
    const val = this.dependentList.at(index).get('relationshipType').value;
    if (val) {
      if (id !== null) {
        this.dependentList.at(index).get('dob').disable();
      } else {
        this.dependentList.at(index).get('dob').enable();
      }
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

  showMessage(error) {
    const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
      data: error,
      panelClass: 'dialog-width',
    });
    dialogRef.afterClosed().subscribe((data) => {
      // navigate
    });
  }
}
