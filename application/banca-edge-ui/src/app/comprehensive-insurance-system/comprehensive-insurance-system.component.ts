import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';
import { maxvalueVal } from '@app/shared/validators/maxValue.validator';
import { User } from '@app/_models';
import { AccountService } from '@app/_services';
import { LoaderService } from '@app/_services/loader.service';
import * as moment from 'moment';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CisOtpComponent } from './components/cis-otp/cis-otp.component';
import { payload,  } from './models/form-data';
// import {  ScreenMetadata } from './models/form-data';
// import {   dummyPayload} from './models/form-data';
import { forkJoin } from 'rxjs';

import { Lead } from './models/lead.model';
import { ComprehensiveInsuranceSystemService } from './services/comprehensive-insurance-system.service';
import { CisModalComponent } from './components/cis-modal/cis-modal.component';

@Component({
  selector: 'app-comprehensive-insurance-system',
  templateUrl: './comprehensive-insurance-system.component.html',
  styleUrls: ['./comprehensive-insurance-system.component.css'],
})
export class ComprehensiveInsuranceSystemComponent implements OnInit {
  lead: Lead;

  user: User;

  currentDate;

  screens;

  screensCopy;

  stepperFormGroups: FormGroup[] = [];

  payload;

  editFlow = false;

  insurerUser = false;

  bankCustomer = false;

  branchUser = false;

  disableSubmit = false;

  customerId;

  masterCount = 0;

  orgCode

  formatMasterCount = 0;

  cisNumber = '9999999999' ;

  smallScreen = false;

  isFormEditable = true;

  errorLoadingApplicationDetails = false;

  lob;

  productType;

  products = [];

  insurerId;

  allApiLoaded: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  allApiLoadedSubscription: Subscription;

  showSubmitErrorMessage = false;

  submitErrorMessage = '';

  showOtpError = false;

  customerDetails;

  isApplication = true;

  customerToken;

  consentApplicationData;

  @ViewChild('stepper', { static: false }) stepper: MatStepper;

  constructor(
    private accountService: AccountService,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private cisService: ComprehensiveInsuranceSystemService,
  ) {}

  ngOnInit() {
    this.payload = JSON.parse(JSON.stringify(payload));
    // console.log('the lead model', this.lead);
    if (this.router.url.indexOf('application') > -1) {
      this.isApplication = true;
    }
    
    this.route.url.subscribe(url => console.log(url));
    this.accountService.user.subscribe((user) => {
      if(user){
        this.user = user;
        this.insurerUser = this.user?.isInsurerUser;
        this.bankCustomer = this.user?.isBankCustomer;
        this.branchUser = !this.insurerUser && !this.bankCustomer;
      }
    });

    this.route.params.subscribe((param) => {
      // console.log('the param', param);
      if (param.customerId) {
        this.customerId = param.customerId;
        this.payload.productInfo.customerId = this.customerId;
      }
      if (param.lob) {
        this.lob = param.lob;
        this.payload.productInfo.lob = this.lob;
      }
      if (param.productType) {
        this.productType = param.productType;
        this.payload.productInfo.productType = this.productType;
      }
      if (param.insurerId) {
        this.insurerId = param.insurerId;
        this.payload.productInfo.insurerId = +this.insurerId;
      }
      if (param.cisNumber) {
        this.editFlow = true;
        if (!this.user.isBankCustomer && !this.user.isInsurerUser) {
          this.isFormEditable = false;
        }
        this.cisNumber = param.cisNumber;
      }
      if(param.token){
        this.editFlow = true;
        this.customerToken = param.token;
        this.isFormEditable = false;
      }
    });

    const requiredDataForApp = [];

    if(!this.customerToken){
      if (this.insurerId) {
        const metadataPayload = {
          productId: this.insurerId,
          formType: this.lob
        };
        requiredDataForApp.push(this.cisService.getMetadata(metadataPayload));
      }
      if (this.customerId) {
        requiredDataForApp.push(this.cisService.getCustomerById(this.customerId));
      }
      if (this.cisNumber && this.cisNumber !=='9999999999') {
        requiredDataForApp.push(this.cisService.getCisApplication(this.cisNumber));
      }
      this.loaderService.showSpinner(true);

      forkJoin(requiredDataForApp).subscribe((data) => {
        this.loaderService.showSpinner(false);
          this.screens = data[0];
          // this.screens = ScreenMetadata;
          this.screensCopy = JSON.parse(JSON.stringify(this.screens));
          this.customerDetails = data[1];
          // this.customerDetails = customerInfo;
          this.customerDetails.maritalStatus = this.customerDetails.customerNeeds.maritalStatus === 'Married' ? 'M' : 'S';
        this.customerDetails.fullName =
          this.customerDetails.firstName + ' ' + this.customerDetails.lastName;
        this.payload.proposer.customerBankId = this.customerDetails['bankCustomerId'];
        
       
        
        if (!this.editFlow) {
          const permanentAddress = this.customerDetails.addressList.find(address => address.addressType === 'PERMANENT');
          const mailingAddress = this.customerDetails.addressList.find(address => address.addressType === 'MAILING');
          this.payload.policyAddress = permanentAddress ? permanentAddress : {};
          this.payload.mailingAddress = mailingAddress ? mailingAddress : {};
        }
        if (data.length === 3) {
          this.payload = data[2];
          // this.payload = dummyPayload;
          this.payload.productInfo.leadNumber = this.cisNumber;
          if (this.editFlow && !this.payload.paymentInfo) {
            this.payload.paymentInfo = {
              paymentType: 'DBT',
            };
          }
          if (this.branchUser) {
            this.isFormEditable = false;
            this.disableSubmit = true;
          } else if (
            this.insurerUser &&
            (this.payload.productInfo.statusCode === '9' )
          ) {
            this.isFormEditable = false;
            this.disableSubmit = true;
          }
        }
        this.loaderService.showSpinner(false);
  
        this.fetchMastersData();
      },err=>{
      this.loaderService.showSpinner(false);
  
      });
    } else {
      let customerId
      let metadataPayload
        this.cisService.getConsentCisApplication(this.customerToken).subscribe((resData)=>{
          console.log(resData)
        this.consentApplicationData = resData;
         customerId= this.consentApplicationData['applicationData']['productInfo']['customerId'];
         metadataPayload = {
          productId: this.consentApplicationData['applicationData']['productInfo']['insurerId'],
          formType:resData['lob']
        };
        this.lob=this.consentApplicationData['lob'];
        this.productType = this.consentApplicationData['productType'];
        this.insurerId = this.consentApplicationData['insurerCode'];
        this.cisNumber = this.consentApplicationData['leadNumber'];
        this.orgCode = this.consentApplicationData['orgCode']
        requiredDataForApp.push(this.cisService.getMetadata(metadataPayload))
        requiredDataForApp.push(this.cisService.getCustomerByIdCis(customerId,this.orgCode))
        this.loaderService.showSpinner(true);
        forkJoin(requiredDataForApp).subscribe((data) => {
          this.loaderService.showSpinner(false);
            this.screens = data[0];
            // this.screens = ScreenMetadata;
            this.screensCopy = JSON.parse(JSON.stringify(this.screens));
            this.customerDetails = data[1];
            this.customerDetails.maritalStatus = this.customerDetails.customerNeeds.maritalStatus === 'Married' ? 'M' : 'S';
            this.customerDetails.fullName =
              this.customerDetails.firstName + ' ' + this.customerDetails.lastName;
            this.payload.proposer.customerBankId = this.customerDetails['bankCustomerId'];
          
          if (!this.editFlow) {
            const permanentAddress = this.customerDetails.addressList.find(address => address.addressType === 'PERMANENT');
            const mailingAddress = this.customerDetails.addressList.find(address => address.addressType === 'MAILING');
            this.payload.policyAddress = permanentAddress ? permanentAddress : {};
            this.payload.mailingAddress = mailingAddress ? mailingAddress : {};
          }
            this.payload = this.consentApplicationData['applicationData'];
            // this.payload = applicationData;
            this.payload.productInfo.leadNumber = this.cisNumber;
            if (this.editFlow && !this.payload.paymentInfo) {
              this.payload.paymentInfo = {
                paymentType: 'DBT',
              };
            }
           if (this.payload.productInfo.statusCode === '9') {
              this.isFormEditable = false;
              this.disableSubmit = true;
            }
          
          this.loaderService.showSpinner(false);
    
          this.fetchMastersData();
        },err=>{
        this.loaderService.showSpinner(false);
    
        });
    },error=>{
      console.log(error)
    })
    // requiredDataForApp.push(this.cisService.getMetadata(metadataPayload))
    
    }
   
    // console.log('HI2',requiredDataForApp)
    // console.log('working bro?', requiredDataForApp);
    // this.loaderService.showSpinner(true);
    

    this.currentDate = moment().format('YYYY-MM-DD');
  }

  fetchMastersData() {
    this.allApiLoadedSubscription = this.allApiLoaded.subscribe((count) => {
      // console.log('got the count', count);
      if (count === this.masterCount + this.formatMasterCount && count !== 0) {
        this.allApiLoadedSubscription.unsubscribe();
        this.screensCopy = JSON.parse(JSON.stringify(this.screens));
        //handle hideScreen
        this.handleHiseScreen();
        this.stepperFormGroups.push(new FormGroup({}));
        this.createGenralForm(-1);
        // console.log('stepperFormGroups', this.stepperFormGroups[0]);
      }
    });
    const masterCodes = [];
    const formatMasterCodes = [];
    this.screens.screens.forEach((screen) => {
      if (screen.sections) {
        screen.sections.forEach((section) => {
          section.formData.forEach((form) => {
            if (
              form.isLoadedFromMaster &&
              form.masterValue &&
              form.masterValue !== '' &&
              masterCodes.indexOf(form.masterValue) === -1
            ) {
              masterCodes.push(form.masterValue);
            } else if (
              form.isLoadedFromMaster &&
              form.masterFromNormalApi &&
              form.masterFromNormalApi !== '' &&
              formatMasterCodes.indexOf(form.masterFromNormalApi) === -1
            ) {
              const checkMasterCondition = this.masterCondition(form);
              // console.log(checkMasterCondition);
              if (
                checkMasterCondition &&
                form.masterFromNormalApiReplaceList &&
                form.masterFromNormalApiReplaceList.length > 0
              ) {
                form.masterFromNormalApiReplaceList.forEach((pathToReplace) => {
                  if (pathToReplace.selectFromObject) {
                    const value = this.getValueFromObj(pathToReplace.objectKey);
                    form.masterFromNormalApi = form.masterFromNormalApi.replace('{replace}', value);
                  }
                });
                formatMasterCodes.push(form.masterFromNormalApi);
              }
              // console.log('finally got the formatMasterCodes', formatMasterCodes);
            }
          });
        });
      }
    });
    // console.log('master array', masterCodes);
    this.masterCount = masterCodes.length;
    this.formatMasterCount = formatMasterCodes.length;
    let apiCount = 0;
    masterCodes.forEach((master) => {
      let insurerId = this.insurerId;
      console.log('master', master);
      if (master === 'SpForInsurer') {
        insurerId = this.customerToken?this.consentApplicationData['branchCode']:this.user.branchCode;
      }
      this.cisService
        .getDropdownFromMaster(master, this.lob, this.productType, insurerId,this.cisNumber)
        .subscribe((dropdown: any[]) => {
          this.screens.screens.forEach((screen) => {
            if (screen.sections) {
              screen.sections.forEach((section) => {
                section.formData.forEach((form) => {
                  if (form.masterValue === 'Products') {
                    this.products = dropdown;
                  }
                  if (form.isLoadedFromMaster && form.masterValue && master === form.masterValue) {
                    form.options = dropdown;
                  }
                });
              });
            }
          });
          ++apiCount;
          this.allApiLoaded.next(apiCount);
        });
    });
    formatMasterCodes.forEach((master) => {
      this.cisService.getDropdownAndFormatToStandards(master).subscribe((dropdown: any[]) => {
        this.screens.screens.forEach((screen) => {
          if (screen.sections) {
            screen.sections.forEach((section) => {
              section.formData.forEach((form) => {
                if (
                  form.isLoadedFromMaster &&
                  form.masterFromNormalApi &&
                  master === form.masterFromNormalApi
                ) {
                  if (form.keyValueMapping) {
                    dropdown = dropdown.map((dropdownValue) => {
                      return {
                        id: dropdownValue[form.keyValueMapping.id],
                        value: dropdownValue[form.keyValueMapping.value],
                      };
                    });
                  }
                  form.options = dropdown;
                }
              });
            });
          }
        });
        ++apiCount;
        this.allApiLoaded.next(apiCount);
      });
    });
  }

  masterCondition(form):Boolean{
    // console.log(form)
    let allConditionsMet = false
    if(form.masterApiCallConditionName === 'checkAppStatus'){
      allConditionsMet =  form.masterApiCallConditionRule.every(condition=>{
          const value = this.getValueFromObj(condition.objectKey);
        // console.log('inside condition',condition,value)
          if(condition.conditionName === 'Equals'){
           return condition.conditionVal.includes(value)
          } else {
            return false
          }
        })
    }
    // console.log(allConditionsMet);
    return  allConditionsMet
  }

  createContactInfoForm(index) {
    const postalcodeRegex = /^[1-9]{1}[0-9]{5,5}$/;
    const currentFormGroup = this.stepperFormGroups[index + 1];
    const sameAddress = this.payload.addressSame ? 'yes' : 'no'
    currentFormGroup.addControl('addressSame', new FormControl(sameAddress, Validators.required));
    currentFormGroup.addControl(
      'policyaddressline1',
      new FormControl(this.payload.policyAddress.addressline1, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(80),
        Validators.pattern('^[a-zA-Z0-9- #.,/]*$'),
      ]),
    );
    currentFormGroup.addControl(
      'policyaddressline2',
      new FormControl(this.payload.policyAddress.addressline2, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(80),
        Validators.pattern('^[a-zA-Z0-9- #.,/]*$'),
      ]),
    );
    currentFormGroup.addControl(
      'policyaddressline3',
      new FormControl(this.payload.policyAddress.addressline3, [
        Validators.maxLength(80),
        Validators.pattern('^[a-zA-Z0-9- #.,/]*$'),
      ]),
    );
    if (postalcodeRegex.test(this.payload.policyAddress.postalcode)) {
      currentFormGroup.addControl(
        'policypostalcode',
        new FormControl(this.payload.policyAddress.postalcode?.trim(), [
          Validators.required,
          Validators.pattern(postalcodeRegex),
        ]),
      );

      currentFormGroup.addControl(
        'policycity',
        new FormControl(this.payload.policyAddress.city, Validators.required),
      );
      currentFormGroup.addControl(
        'policystate',
        new FormControl(this.payload.policyAddress.state, Validators.required),
      );
    } else {
      currentFormGroup.addControl(
        'policypostalcode',
        new FormControl('', [Validators.required, Validators.pattern(postalcodeRegex)]),
      );
      currentFormGroup.addControl('policycity', new FormControl('', Validators.required));
      currentFormGroup.addControl('policystate', new FormControl('', Validators.required));
    }

    if (currentFormGroup.get('addressSame').value === 'no') {
      currentFormGroup.addControl(
        'mailaddressline1',
        new FormControl(this.payload.mailingAddress.addressline1, [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(40),
          Validators.pattern('^[a-zA-Z0-9- #.,/]*$'),
        ]),
      );
      currentFormGroup.addControl(
        'mailaddressline2',
        new FormControl(this.payload.mailingAddress.addressline2, [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(40),
          Validators.pattern('^[a-zA-Z0-9- #.,/]*$'),
        ]),
      );
      currentFormGroup.addControl(
        'mailaddressline3',
        new FormControl(this.payload.mailingAddress.addressline3, [
          Validators.maxLength(40),
          Validators.pattern('^[a-zA-Z0-9- #.,/]*$'),
        ]),
      );
      currentFormGroup.addControl('searchCtrl2', new FormControl(''));
      if (postalcodeRegex.test(this.payload.mailingAddress.postalcode)) {
        currentFormGroup.addControl(
          'mailpostalcode',
          new FormControl(this.payload.mailingAddress.postalcode?.trim(), [
            Validators.required,
            Validators.pattern(postalcodeRegex),
          ]),
        );

        currentFormGroup.addControl(
          'mailcity',
          new FormControl(this.payload.mailingAddress.city, Validators.required),
        );
        currentFormGroup.addControl(
          'mailstate',
          new FormControl(this.payload.mailingAddress.state, Validators.required),
        );
      } else {
        currentFormGroup.addControl(
          'mailpostalcode',
          new FormControl('', [Validators.required, Validators.pattern(postalcodeRegex)]),
        );
        currentFormGroup.addControl('mailcity', new FormControl('', Validators.required));
        currentFormGroup.addControl('mailstate', new FormControl('', Validators.required));
      }
    }
  }

  createGenralForm(index) {
    // console.log(index);
    const currentFormGroup = this.stepperFormGroups[index + 1];
    // console.log('currentFormGroup', currentFormGroup);
    const currentScreen = this.screens.screens[index + 1];
    //handle ArrayLogic for insurers
    if(currentScreen.isArray){
      this.handleInsurers_Nominees(currentScreen);
    }
    currentScreen.sections.forEach((section) => {
      if (
        !section.isDependent ||
        (section.isDependent &&
          section.sectionVisibleIfDependentValueIn.findIndex(
            (value) => value === currentFormGroup.get(section.dependsOnControl)?.value,
          ) > -1)
      ) {
        // console.log('section', section);
        section.formData.forEach((form) => {
          // console.log('each form', form);

          const validatorsArray = this.cisService.getValidatorsArray(form);
          if (form.key !== '') {
            let defaultValue;
            // if(form.getFromLocal){
            //  let localValue= localStorage.getItem(form.localStorageTag)
            //   currentFormGroup.addControl(
            //     form.controlName + '-' + form.key,
            //     new FormControl(localValue, validatorsArray),
            //   );
            //   this.payload[form.key][form.controlName] = defaultValue;}
             if (form.selectFromObject && this.isFormEditable ) {
              defaultValue = this.customerToken && form.objectConsentKey ? this.getValueFromObj(form.objectConsentKey):this.getValueFromObj(form.objectKey);
              currentFormGroup.addControl(
                form.controlName + '-' + form.key,
                new FormControl(defaultValue, validatorsArray),
              );
              this.payload[form.key][form.valueType] = defaultValue;
            } else if (form.defaultValue && form.defaultValue != '') {
              currentFormGroup.addControl(
                form.controlName + '-' + form.key,
                new FormControl(form.defaultValue, validatorsArray),
              );
              defaultValue = form.defaultValue;
              if(!form.controlName.includes('_')){
              this.payload[form.key][form.valueType] = defaultValue;
                
              } else{
                const writeArrayIndex = form.controlName.split('_')[1]
              this.payload[form.key][writeArrayIndex][form.valueType] = defaultValue;
              }
            }
            if (this.editFlow) {
              if(!form.controlName.includes('_')){
                currentFormGroup.addControl(
                  form.controlName + '-' + form.key,
                  new FormControl(this.payload[form.key][form.valueType], validatorsArray),
                );
              } else{
                const writeArrayIndex = form.controlName.split('_')[1]
                currentFormGroup.addControl(
                  form.controlName + '-' + form.key,
                  new FormControl(this.payload[form.key][writeArrayIndex][form.valueType], validatorsArray),
                );
              }
              

             
              // if (form.controlType === 'select-key-value') {
              //   const idTag = form.keyValueMapping.id;
              //   const valueTag = form.keyValueMapping.value;
              //   this.payload[form.key][idTag] = defaultValue;
              //   if (defaultValue) {
              //     this.payload[form.key][valueTag] = form.options.find(
              //       (option) => option.id === defaultValue,
              //     ).value;
              //   } else {
              //     this.payload[form.key][valueTag] = undefined;
              //   }
              // }
            } else {
              currentFormGroup.addControl(
                form.controlName + '-' + form.key,
                new FormControl(this.payload[form.key][form.controlName], validatorsArray),
              );

              if (form.controlType === 'select-key-value') {
                const idTag = form.keyValueMapping.id;
                const valueTag = form.keyValueMapping.value;
                this.payload[form.key][idTag] = defaultValue;
                if (defaultValue) {
                  this.payload[form.key][valueTag] = form.options.find(
                    (option) => option.id === defaultValue,
                  ).value;
                } else {
                  this.payload[form.key][valueTag] = undefined;
                }
              }
            }
          } else {
            if (form.defaultValue && form.defaultValue != '') {
              currentFormGroup.addControl(
                form.controlName,
                new FormControl(form.defaultValue.toString(), validatorsArray),
              );
            }
            if (form.selectFromRoot) {
              currentFormGroup.addControl(
                form.controlName,
                new FormControl(this.payload[form.controlName]?.toString(), validatorsArray),
              );
            } else {
              currentFormGroup.addControl(
                form.controlName,
                new FormControl(this.payload[form.controlName]?.toString(), validatorsArray),
              );
            }
          }
          const currentKey = form.key ? '-' + form.key : '';
          if (form.subscribeChanges) {
            // console.log('subscribing the form', form);
            currentFormGroup
              .get(form.controlName + currentKey)
              .valueChanges.subscribe((currentValue) => {
                // console.log('got the currentValue', currentValue,this.screens);
                // console.log('got the form', form);
                if (
                  form.actions &&
                  form.actions.updateScreens &&
                  form.actions.updateScreens.length > 0
                ) {
                  form.actions.updateScreens.forEach((screenToBeUpdated) => {
                    const addScreen =
                      screenToBeUpdated.displayScreenOnlyIfCurrenControlValueIn.indexOf(
                        currentValue,
                      ) > -1;
                    const isScreenAlreadyPresent =
                      this.screens.screens.findIndex(
                        (screen) =>
                          screen.screenName === screenToBeUpdated.screenToBeAddedOrRemoved,
                      ) > -1;
                    // console.log('****Update Screen Present? ', addScreen, isScreenAlreadyPresent);
                    // console.log('****Update Screen details ', screenToBeUpdated.screenIndex);
                    if (addScreen && !isScreenAlreadyPresent) {
                      const tempScreens = JSON.parse(JSON.stringify(this.screensCopy));
                      //find screen original position
                      const originalScreenIndex = tempScreens.screens.findIndex(screen=>{return screen.screenName === screenToBeUpdated.screenToBeAddedOrRemoved})
                      this.screens.screens.splice(
                        originalScreenIndex,
                        0,
                        tempScreens.screens[originalScreenIndex],
                      );
                      // console.log('updated screen', this.screens);
                      this.stepperFormGroups.splice(originalScreenIndex);
                    } else if (!addScreen && isScreenAlreadyPresent) {
                      console.log(screenToBeUpdated.screenIndex)
                      //find screenIndex
                      const screenIndex = this.screens.screens.findIndex(screen=>{return screen.screenName === screenToBeUpdated.screenToBeAddedOrRemoved})
                      this.stepperFormGroups.splice(screenIndex);
                      this.screens.screens.splice(screenIndex, 1);
                    }
                  });
                }
                if (
                  form.actions &&
                  form.actions.updateControls &&
                  form.actions.updateControls.length > 0
                ) {
                  const updationDetails = form.actions.updateControls.find(
                    (updateControl) => updateControl.currentControlValue === currentValue,
                  );
                  // console.log('****updationDetails****', updationDetails);
                  if (updationDetails) {
                    setTimeout(() => {
                      updationDetails.controls.forEach((control) => {
                        // console.log(
                        //   'chech the control name',
                        //   currentFormGroup.get(control.controlName),
                        // );
                        if (currentFormGroup.get(control.controlName)) {
                          const updatedValidators = this.cisService.getValidatorsArray(control);
                          // console.log('****updatedValidators****', updatedValidators);
                          // console.log('****control to update****', control.controlName);
                          currentFormGroup
                            .get(control.controlName)
                            .setValidators(updatedValidators);
                          currentFormGroup.get(control.controlName).updateValueAndValidity();
                          currentScreen.sections.forEach((screenSection) => {
                            const valDependentform = screenSection.formData.find((valform) => {
                              // console.log('valForm', valform, form);
                              return valform.controlName + currentKey === control.controlName;
                            });
                            if (valDependentform) {
                              // console.log('****form to update****', valDependentform);
                              valDependentform.validators = control.validators;
                            }
                          });
                        }
                      });
                    });
                  }
                }
              });
          }
          if (form.initiallyDisabled && currentFormGroup.get(form.controlName + currentKey).valid) {
            currentFormGroup.get(form.controlName + currentKey).disable();
          }
        });
      }
    });
  }

  handleInsurers_Nominees(currentScreen){
  // console.log('HI')
    if(currentScreen.hasOwnProperty('getArrayObjCount')){
      // console.log('hi2')
      currentScreen.arrayObjCount=this.getValueFromObj(currentScreen.getArrayObjCount)
    }
    currentScreen.arrayPayloadTagAffected.forEach(payloadTag=>{
      for(let i=0;i<currentScreen.arrayObjCount;i++){
        if(this.payload[payloadTag].length <  currentScreen.arrayObjCount){
        this.payload[payloadTag] = [{},...this.payload[payloadTag]]
     }
    }
    })
  }
  createSummaryForm(index) {
    const currentFormGroup = this.stepperFormGroups[index + 1];
    currentFormGroup.addControl('consentCheck', new FormControl(null));
    if(this.customerToken){
      currentFormGroup.get('consentCheck').setValidators(Validators.requiredTrue);
    }
  }

  getValueFromObj(objectKey) {
    // console.log('***check here', objectKey);
    let [requiredLevel, requiredField, ...tagKey] = objectKey;
    // console.log(requiredLevel,requiredField,tagKey)
    requiredLevel = this[requiredLevel];
    // console.log('requiredLevel', requiredLevel);
    // console.log('requiredField', requiredField);
    // console.log('tagKey', tagKey);
    tagKey.forEach((key) => {
      if(typeof key ==='string' && key.split('_').length>1){
        const [tagName,index] = key.split('_')
        requiredLevel = index ? requiredLevel[tagName][+index] : requiredLevel[tagName]
      } else {
        requiredLevel = requiredLevel[key];
      }
    });
    // console.log('requiredLevel', requiredLevel[requiredField]);
    return requiredLevel[requiredField];
  }


  setIndex(event) {
    // console.log(event);
    if (event.selectedIndex < event.previouslySelectedIndex) {
      this.stepperFormGroups.splice(event.selectedIndex + 1);
    }
  }

  goToNextScreen(screen, nextScreen, component, index, stepper: MatStepper) {
    // console.log('index', index);
    // console.log('component', component);
    const nextScreenComponent = this.screens.screens[index + 1].component;
    this.preScreenRenderRequirementsChecks(this.screens.screens[index + 1]);
    let isCurrentScreenValidated = true;
    if (screen.validations) {
      if (screen.validations.checkGstCalculation) {
        const errorMessage = this.checkGstCalculation(index);
        if (errorMessage.length > 0) {
          isCurrentScreenValidated = false;
          this.openModal(errorMessage);
        }
      }
      if(screen.validations.checkSpSelection){
        const errorMessage =  this.checkSp(this.payload);
        if (errorMessage.length > 0) {
          isCurrentScreenValidated = false;
          this.openModal(errorMessage);
        }
      }

       if(screen.validations.checkTitleValidations) {
          const errorMessage = this.checkTitleValidation(screen, index)
          if (errorMessage.length > 0) {
            isCurrentScreenValidated = false;
            this.openModal(errorMessage);
          }
      }
      // if (screen.validations.checkTitleValidations) {
      //   const errorMessage = this.checkTitleValidations(screen, index);
      //   if (errorMessage.length > 0) {
      //     isCurrentScreenValidated = false;
      //     this.openErrorDisplayModal(errorMessage);
      //   }
      // }
      if (screen.validations.checkPtPptValidations) {
        const errorMessage = this.checkPtPptValidations(screen, index);
        if (errorMessage.length > 0) {
          isCurrentScreenValidated = false;
          this.openModal(errorMessage);
        }
      }
    } else {
      isCurrentScreenValidated = true;
    }

    if (this.stepperFormGroups.length === index + 1 && isCurrentScreenValidated) {
      this.stepperFormGroups.push(new FormGroup({}));
    }

    if (nextScreenComponent === 'general' && isCurrentScreenValidated) {
      // this.stepperFormGroups.push(new FormGroup({}));
      this.createGenralForm(index);
      stepper.next();
    } else if (nextScreenComponent === 'contact-info' && isCurrentScreenValidated) {
      // this.stepperFormGroups.push(new FormGroup({}));
      this.createContactInfoForm(index);
      stepper.next();
    } else if (nextScreenComponent === 'Summary' && isCurrentScreenValidated) {
      this.isFormEditable = false;
      this.createSummaryForm(index);
      stepper.next();
    }
  }

  preScreenRenderRequirementsChecks(screen){
    console.log(screen)
    if(screen.preScreenRenderRequirementsChecks?.removeFields.length > 0){
      // console.log('inside remove fields')
    } else if(screen.preScreenRenderRequirementsChecks?.removeValidators.length > 0){
      // console.log('inside remove validators')
      screen.preScreenRenderRequirementsChecks?.removeValidators.forEach(validatateForm=>{
        let reqFormData;
        screen.sections.find(section=>{
          section.formData.find(form=>{
              if(form.valueType === validatateForm.formName) {
                reqFormData = form
              }
            })
           })
       const confirmRemoveValidator = validatateForm.validateCondition.every(condtionCheck=>{
            return this.conditionalCheck(condtionCheck)
           })
           if(confirmRemoveValidator){
            validatateForm.validatorToRemove.forEach(validatorToBeRemoved=>{
                delete reqFormData.validators[validatorToBeRemoved]
            })
           }
      })
    }
  }

  conditionalCheck(condtionCheck){
  const reqVal =  this.getValue(condtionCheck.concernedValue,this.payload)
    if(condtionCheck.condition==='below'){
      return  reqVal < condtionCheck.valueToCompare
    }
    else if(condtionCheck.condition==='above'){
      return  reqVal > condtionCheck.valueToCompare
    }
   else if(condtionCheck.condition==='equal'){
      return  reqVal == condtionCheck.valueToCompare
    }
  }

  getValue(form,data){
    let reqLevel = data;
    form.prefillDepth[1].forEach(tag=>{
      if(typeof tag ==='string' && tag.split('-').length>1){
        const [tagName,index] = tag.split('-')
        reqLevel = index? reqLevel[tagName][+index] : reqLevel[tagName]
      } else {
        reqLevel = reqLevel[tag]
      }
    })
    return reqLevel[form.prefillDepth[0]];
  }

  navigateToEditScreen(stepper: MatStepper, screenIndex) {
    this.isFormEditable = true;
    stepper.selectedIndex = screenIndex;
  }

  checkPtPptValidations(screen, index) {
    // console.log(screen, index);
    return [];
  }

  checkTitleValidation(screen , index){
    let  genderValidMessage= '';
    let genderValidArr = []
    const currentFormGroup = this.stepperFormGroups[index];
    screen.sections.forEach(section=>{
      section.formData.forEach(form=>{
        if(form.hasGenderValidation){
          let controlValArr =[];
            const controlName = form.key !=='' ? form.controlName + '-' + form.key : form.controlName
            const controlVal = currentFormGroup.get(controlName)?.value;
            if(controlVal){
              const controlGenderVal = form.options.find(option=>{return option.id === controlVal}).gender;
              controlValArr.push(controlGenderVal)
               form.genderCompareControl.forEach(control=>{
                let hasGenderTag = control.split("-");
                console.log(hasGenderTag);
                if(!hasGenderTag[2]){
                  controlValArr.push(currentFormGroup.get(control)?.value);
                } else {
                  const controlValue = currentFormGroup.get(hasGenderTag[0]+'-'+hasGenderTag[1])?.value
                 
                  const reqForm = section.formData.find(form=>form.controlName === hasGenderTag[0])
                  const controlGenderVal = reqForm.options.find(option=>{return option.id === controlValue}).gender;
                   controlValArr.push(controlGenderVal);
                }
               })
               
                controlValArr = controlValArr.filter(val=>{return val !== 'B'})
                console.log(controlValArr)
               if(controlValArr.every(val=>{return val === controlGenderVal[0]})){
                genderValidArr.push(true);
               } else {
                genderValidArr.push(false);
               }
            }
        }
      })
    })
    if(genderValidArr.every(val=>val === true)){
      genderValidMessage = '';
    } else {
    genderValidMessage = 'Title, Gender and Relationship are not matching. Please enter correct values';
    }
    return genderValidMessage;
  }

  openModal(message) {
    const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
      data: message,
      panelClass: 'dialog-width',
    });
    return dialogRef;
  }
  checkSp(payload){
   const insurerAppilcationData = this.cisService.insurerAppilcationData
      if(insurerAppilcationData['agentCode']){
        console.log(insurerAppilcationData['agentCode'],payload['agencyData']['insurerSpCode'])
       if(insurerAppilcationData['agentCode'] === payload['agencyData']['insurerSpCode']) {
          return ''
       } else {
        return `Sp mapped in incorrect.Quote created for SP:${insurerAppilcationData['agentCode']}`
       }
      }
  }

  checkGstCalculation(index) {
    let flag = false;
    let message = 'Base premium and GST should add up Total GST with premium';

    const currentScreenFrom = this.stepperFormGroups[index];
    // console.log('currentScreenFrom', currentScreenFrom);
    const statusCode = currentScreenFrom.get('statusCode-productInfo').value;
    if (this.disableSubmit) {
      return '';
    }

    if (
      statusCode === '2' ||
      statusCode === '3' ||
      statusCode === '4' ||
      statusCode === '6' ||
      statusCode === '11' ||
      statusCode === '12'
    ) {
      return '';
    }

    const ppt = currentScreenFrom.get('ppt-productInfo').value;
    let confirmNetPremium;
    let confirmPt;
    let confirmPpt;
    const premiumWithGst = currentScreenFrom.get('netPremium-productInfo').value;
    const pt = currentScreenFrom.get('pt-productInfo').value;
    const gst = currentScreenFrom.get('gst-productInfo').value;
    const basePremium = currentScreenFrom.get('basePremium-productInfo').value;
    const policyStartDate = currentScreenFrom.get('policyStartDate-productInfo')?.value;
    const policyEndDate = currentScreenFrom.get('policyEndDate-productInfo')?.value;
    // console.log('check here', +basePremium + +gst === +premiumWithGst);

    // console.log('check the pt', pt);
    if (statusCode === '9') {
      confirmNetPremium = currentScreenFrom.get('confirmNetPremium-productInfo').value;
      confirmPt = currentScreenFrom.get('confirmPt-productInfo').value;
      confirmPpt = currentScreenFrom.get('confirmPpt-productInfo').value;

      if (pt < 1 || ppt < 1 || premiumWithGst < 1) {
        return 'Please enter a valid details';
      }

      if (pt !== confirmPt) {
        return 'Please confirm Policy Term';
      }
      if (ppt !== confirmPpt) {
        return 'Please confirm Premium Paying Term';
      }
      if (premiumWithGst !== confirmNetPremium) {
        return 'Please confirm Net Premium';
      }
      if (
        moment(new Date(policyStartDate)).add(pt, 'years').format('YYYY-MM-DD') !== policyEndDate
      ) {
        return 'Please check Policy Term and Policy Start Date and Policy End Date';
      }
    }

    if (pt && pt !== '' && ppt && ppt !== '' && +ppt > +pt) {
      flag = true;
      message = 'Policy Term cannot be greater than Premium Paying Term';
    }

    if (gst && gst !== '' && basePremium && basePremium !== '' && gst > basePremium) {
      return 'GST cannot be greater that Base Premium';
    }

    if (
      gst &&
      basePremium &&
      premiumWithGst &&
      basePremium !== '' &&
      gst !== '' &&
      premiumWithGst !== '' &&
      +basePremium + +gst !== +premiumWithGst
    ) {
      flag = true;
      message = 'Base premium and GST should add up Total GST with premium';
    }

    return flag ? message : '';
  }

  onSubmitClicked() {
    this.loaderService.showSpinner(true);
    this.reConsilePayload(); 
   if(!this.customerToken) {
    if (!this.editFlow) {
      if (this.isApplication) {
        this.payload.productInfo.status = 'COLLECTION';
        this.payload.productInfo.statusCode = '7';
        this.payload.productInfo.productId=0;
      }
      // this.payload = dummyPayload
      this.cisService.submitApplication(this.payload).subscribe(
        (data) => {
          const appNo = data['appNo'];
          const statusCode = data['statusCode']
          this.loaderService.showSpinner(false);
          // this.payload = payload;
          // console.log('submitted successfully', data, data['isOtpRequired']);
          if (data['isOtpRequired'] && !this.isApplication) {
            const proposerScreen = this.screens.screens.findIndex(
              (screen) => screen.screenName.toLowerCase().includes('proposer') === true,
            );
            // console.log('proposerScreen', proposerScreen);
            const proposerForm = this.stepperFormGroups[proposerScreen];
            const mobile = proposerForm.get('mobile-proposer').value;
            this.sendOtp(mobile, data['appNo']);
          } else {
            let message;
            if(data['message']){
              message = data['message']
            } else {
              message = `Application has been successfully initiated with Application number: ${appNo}. Please initiate payment from next screen against this number to proceed further.`
            };
            const otpDialog = this.openModal(
              message
            );
            otpDialog.afterClosed().subscribe(() => {statusCode === 7 ? this.router.navigateByUrl(`/initiate-payment/cis/${appNo}`) :this.router.navigate(['/', 'cis'])});
          }
        },
        () => {
          this.showSubmitErrorMessage = true;
          this.submitErrorMessage = 'Error while submitted Lead';
          this.loaderService.showSpinner(false);
        },
      );
    } else {
      this.cisService.updateApplication(this.payload).subscribe(
        (data) => {
          this.loaderService.showSpinner(false);
          // console.log('updated successfully successfully', data);
          this.router.navigate(['/', 'cis']);
        },
        () => {
          this.showSubmitErrorMessage = true;
          this.submitErrorMessage = 'Error while updating Lead';
          this.loaderService.showSpinner(false);
        },
      );
    }
  } else {
      this.loaderService.showSpinner(false);

      let appNo = this.consentApplicationData['leadNumber']
      const dialogRef = this.dialog.open(CisOtpComponent, {
        data: {
          appNo,
        },
        panelClass: 'dialog-width',
      });
      dialogRef.afterClosed().subscribe((result:{valid: boolean,message: String}) => {
        if (result.valid === true) {
          this.showOtpError = false;
    this.loaderService.showSpinner(true);

          this.cisService.submitCisConsent(this.payload,this.customerToken).subscribe((res) => {
      this.loaderService.showSpinner(false);
            let message;
             if(res['checkProposalResponse']){
              this.loaderService.showSpinner(true);
              this.cisService.checkProposalResponse(appNo).subscribe(
                (data) => { 
                  this.loaderService.showSpinner(false);
                  if(data['statusCode'] === 1){
                    message = data['message']
                  } else {
                    message = data['message']
                  }
                  const otpDialog = this.openModal(
                    message
                  );
                  otpDialog.afterClosed().subscribe(()=>{
                    if(data['statusCode'] === 1){
                      this.router.navigate(['/']);
                    }
                  })
                },(error)=>{
                  this.loaderService.showSpinner(false);

                  this.dialog.open(PolicyErrorModalComponent,{
                    data:error['errorMessage']
                  })
                });
            }else {
              if(res['message']){
                message = res['message']
              } else {
                message = `Application has been successfully initiated with Application number: ${appNo}. Please initiate payment from next screen against this number to proceed further.`
              };
              const otpDialog = this.openModal(
                message
              );
              otpDialog.afterClosed().subscribe(()=>{
                if(res['statusCode'] === 1){
                  this.router.navigate(['/']);
                }
              })
            } 
          },error=>{
      this.loaderService.showSpinner(false);

            this.dialog.open(PolicyErrorModalComponent,{
              data:error['errorMessage']
            })
          });
        } else {
          this.dialog.open(PolicyErrorModalComponent,{
            data:result.message
          })
        }
      });
    }
  }

  reConsilePayload(){
    if (this.payload.insureds.length>0 ){
      // console.log(this.payload.insureds)
      const insureds = this.payload.insureds
      insureds.forEach((ins,index)=>{
        if(Object.keys(ins).length === 0){
          this.payload.insureds.splice(0,1);
        }
      })
    }
  }

  sendOtp(mobileNo, appNo) {
    this.loaderService.showSpinner(true);
    const otpPayload = {
      otpKey: appNo,
      otpRequestDesc: '',
      mobileNo: mobileNo,
    };
    this.cisService.sendOtp(otpPayload).subscribe(() => {
      this.loaderService.showSpinner(false);
      const dialogRef = this.dialog.open(CisOtpComponent, {
        data: {
          appNo,
        },
        panelClass: 'dialog-width',
      });
      dialogRef.afterClosed().subscribe((result:{valid:boolean,message:string}) => {
        if (result.valid === true) {
          this.showOtpError = false;
          this.cisService.sendLeadDataToInsurer(appNo).subscribe(() => {
            const otpDialog = this.openModal(
              `Lead successfully pushed with Lead Reference Number: ${appNo}`,
            );
            otpDialog.afterClosed().subscribe(() => this.router.navigate(['/', 'cis']));
          });
        }
      });
    });
  }

  onSpCodeChanged(spCode) {
    // console.log('got the spcode', spCode);
  }

  openTC(){
    const dialogRef = this.dialog.open(CisModalComponent, {
      data: {type:'consent',insurer: this.insurerId},
      panelClass: 'dialog-width',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(() => {
    });
  }

  handleHiseScreen(){
    this.screens.screens.forEach((screen,index)=>{
      if(screen.hideScreen){
        screen.sections.forEach(section=>{
          section.formData.forEach(form=>{
            if(form.selectFromObject){
           const defaultValue = this.customerToken && form.objectConsentKey ? this.getValueFromObj(form.objectConsentKey):this.getValueFromObj(form.objectKey);
            if(!form.controlName.includes('_')){
              this.payload[form.key][form.valueType] = defaultValue;
                
              } else{
                const writeArrayIndex = form.controlName.split('_')[1]
              this.payload[form.key][writeArrayIndex][form.valueType] = defaultValue;
              }
        }})
        })
     this.screens.screens.splice(index,1)
        
      }
    })
  }
}
