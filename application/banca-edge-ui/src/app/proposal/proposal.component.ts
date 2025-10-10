import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { ProposalService } from '@app/proposal/services/proposal.service';
import { ConsentModalComponent } from './components/consent-modal/consent-modal.component';
import { PolicyErrorModalComponent } from '../shared/components/policy-error-modal/policy-error-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { User } from '@app/_models';
import { OtpModalComponent } from './components/otp-modal/otp-modal.component';
import { MismatchDialogComponent } from './components/mismatch-dialog/mismatch-dialog.component';
import { AccountService } from '@app/_services';
import { LoaderService } from '@app/_services/loader.service';
import { QrCodeModalComponent } from '@app/quote/qr-code-modal/qr-code-modal.component';
import { BehaviorSubject, Subscription } from 'rxjs';
import { PaymentOptionModalComponent } from './components/payment-option-modal/payment-option-modal.component';
import { maxvalueVal } from '@app/shared/validators/maxValue.validator';
// import Razorpay from 'razorpay';


// import { sampleApplicationData, sampleProposalMetaData, sampleQstruc } from './form-data';

declare var Razorpay: any;

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.css'],
})
export class ProposalComponent implements OnInit {
  isInsuredAlsoProposer = false;

  isFormEditable = true;

  productId;

  policyFormGroupData = [];

  relationshipDropdown;

  nomineeRelationshipDropdown;

  nationalityDropdown;

  titleDropdown;

  applicationData;

  insuredDetails;

  // answers = [];
  insurersNames = [];

  proposerDetails;

  policyQuestions = [];

  insuredData;

  insuredDataCopy;

  currentDate;

  applicationNo: string;

  showSubmitErrorMessage = false;

  submitErrorMessage = '';

  showOtpError = false;

  errorLoadingApplicationDetails = false;

  errorMessage = '';

  smallScreen;

  screens;

  screensCopy;

  currentUser: User;

  isBranchUser = false;

  customerAccountDetails;

  countriesList;

  paymentIndex: number;

  qrCodeError = false;

  masterCount = 0;

  formType = 'Long';

  customerToken;

  orgCode;

  sendLeadToInsurerData;

  userRoles;

  hasEditAccess = true;

  checkProposalResponseApiSubscription: Subscription;

  errorFromCovers = false;

  displayedColumns: string[];

  stepperFormGroups: FormGroup[] = [];

  genderDropdown = [
    { id: 'M', value: 'Male' },
    { id: 'F', value: 'Female' },
  ];

  maritalStatusDropdown = [
    { id: 'M', value: 'Married' },
    { id: 'U', value: 'Single' },
  ];

  razorPayload;

  displayBankName;


  razorAmount 
  razorReceipt;
  razorCurrency; 
  allApiLoaded: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  @ViewChild('stepper', { static: false }) stepper: MatStepper;

  @ViewChild('verticalStepper', { static: false }) verticalStepper: MatStepper;

  allApiLoadedSubscription: Subscription;

   

  constructor(
    public dialog: MatDialog,
    public proposalservice: ProposalService,
    private route: ActivatedRoute,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private accountService: AccountService,
    private loaderService: LoaderService,
  ) {
    breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).subscribe((result) => {
      this.smallScreen = result.matches;
    });
  }

  ngOnInit() {
    this.accountService.user.subscribe((user) => {
      if (user) {
        this.userRoles = user['roles'];
        this.hasEditAccess =
          this.userRoles?.includes('BRANCH.POLICY.CREATE') ||
          this.userRoles?.includes('INSURER.POLICY.CREATE') ||
          this.userRoles?.includes('CUSTOMER.POLICY.CREATE');
        console.log(user, this.hasEditAccess);
        if (!this.hasEditAccess) {
          this.isFormEditable = false;
        }
      } else {
        this.isFormEditable = true;
      }
    });

    this.currentDate = moment().format('YYYY-MM-DD');
    this.route.params.subscribe((params) => {
      if (params.appNo) {
        this.applicationNo = params.appNo;
      } else {
        this.applicationNo = null;
      }
      if (params.productId) {
        this.productId = params.productId;
        this.currentUser = this.accountService.userValue;
        this.isBranchUser =
          this.currentUser.bankCustomer == false && this.currentUser.insurerUser == false;
      } else {
        this.productId = null;
      }
      if (params.formType) {
        this.formType = params.formType;
      } else {
        this.formType = 'Long';
      }
      if (params.token) {
        this.customerToken = params.token;
      } else {
        this.customerToken = null;
      }
    });

    this.loaderService.showSpinner(false);
    if (this.customerToken == null) {
      this.proposalservice.getApplicationbyApplicationNo(this.applicationNo).subscribe(
        (insurers) => {
          this.getApplicationDetails(insurers);
        },
        () => {
          this.loaderService.showSpinner(false);
          this.errorMessage = 'Sorry! Error loading application. Please try after sometime.';
          this.errorLoadingApplicationDetails = true;
        },
      );
    } else {
      this.proposalservice.getPolicyForConsent(this.customerToken).subscribe(
        (insurers) => {
          const productId = 'productId';
          const orgCode = 'orgCode';
          this.productId = insurers[productId];
          this.accountService.orgCode = insurers[orgCode];
          this.getApplicationDetails(insurers);
        },
        () => {
          this.loaderService.showSpinner(false);
          this.errorMessage = 'Sorry! Error loading application. Please try after sometime.';
          this.errorLoadingApplicationDetails = true;
        },
      );
    }
  }

  getApplicationDetails(insurers) {
    // uncomment below to change to sample applicationData
    // insurers = sampleApplicationData;
    this.allApiLoadedSubscription = this.allApiLoaded.subscribe((count) => {
      if (count === this.masterCount && count !== 0) {
        this.allApiLoadedSubscription.unsubscribe();
        this.constructAnswersForFirstTime();
        this.buildFirstScreenForm();
      }
    });

    this.loaderService.showSpinner(false);
    if (insurers.statusCode >= 4) {
      this.isFormEditable = false;
    }
    this.insuredData = insurers;
    this.orgCode = this.insuredData.orgCode;
    if(this.orgCode === 'SIB'){
      this.displayBankName = 'South Indian Bank';
    } else if(this.orgCode === 'CSB'){
      this.displayBankName = 'CSB Bank';
    }else if(this.orgCode === 'SB'){
      this.displayBankName = 'Saraswat Bank';
    }
    this.insuredDataCopy = JSON.parse(JSON.stringify(insurers));
    this.applicationData = insurers.applicationData;
    this.insuredDetails = insurers.applicationData.insureds;

    if (this.insuredDetails) {
      this.insuredData.applicationData.policyMaturityAge =
        this.insuredDetails[0].age + this.insuredData.pt;
      this.insurersNames = [];
      this.insuredDetails.forEach((insured) => {
        this.insurersNames.push({
          id: insured.memberId,
          name: insured.firstName + ' ' + insured.lastName,
        });
      });
    }
    this.loaderService.showSpinner(true);
    this.proposalservice.getAccountDetails(insurers.applicationNo).subscribe(
      (data) => {
        this.loaderService.showSpinner(false);
        this.customerAccountDetails = data;
        if (this.customerAccountDetails.length === 0 && this.insuredData.insurerCode === 512) {
          this.errorMessage =
            'For LIC you should be a Bank of Maharashtra Customer with a positive bank balance';
          this.errorLoadingApplicationDetails = true;
        }
      },
      () => {
        this.loaderService.showSpinner(false);
        this.customerAccountDetails = [];
        if (this.customerAccountDetails.length === 0 && this.insuredData.insurerCode === 512) {
          this.errorMessage =
            'For LIC you should be a Bank of Maharashtra Customer with a positive bank balance';
          this.errorLoadingApplicationDetails = true;
        }
      },
    );
    this.getProposalFormData();
  }

  constructAnswersForFirstTime() {
    if (this.insuredData.productType === 'GC' && this.insuredData.productId !== '158GL01V01') {
      this.insurersNames = [];
      this.insurersNames.push({
        id: 0,
        name:
          this.applicationData.primaryInsured.firstName +
          ' ' +
          this.applicationData.primaryInsured.lastName,
        gender: this.applicationData.primaryInsured.gender,
      });
      if (this.applicationData.loanDetails.coBorrower === 'Y') {
        this.insurersNames.push({
          id: 1,
          name:
            this.applicationData.secondaryInsured.firstName +
            ' ' +
            this.applicationData.secondaryInsured.lastName,
          gender: this.applicationData.secondaryInsured.gender,
        });
      }
    } else if (this.insuredDetails) {
      this.insurersNames = [];
      this.insuredDetails.forEach((insured) => {
        this.insurersNames.push({
          id: insured.memberId,
          name: insured.firstName + ' ' + insured.lastName,
          gender: insured.gender,
        });
      });
    }
    if (this.applicationData.answers && this.applicationData.answers.length === 0) {
      this.policyQuestions.forEach((question) => {
        this.applicationData.answers.push({
          questionId: question.questionId,
          answer: '',
          answerDetails: [],
        });
      });
    }
    if (this.applicationData.answers) {
      this.applicationData.answers.forEach((answer) => {
        if (answer.answerDetails === undefined || answer.answerDetails.length === 0) {
          answer.answerDetails = [];
          const questionForCurrentAnswer = this.policyQuestions.find(
            (question) => question.questionId === answer.questionId,
          );
          this.insurersNames.forEach((insurerName) => {
            const answerStructure = {
              memberId: insurerName.id,
              answer: '',
              details: {},
            };
            if (questionForCurrentAnswer.questionType === 'YESNOTEXT') {
              Object.defineProperty(answerStructure.details, 'desc', {
                value: '',
                writable: true,
                enumerable: true,
                configurable: true,
              });
            } else if (questionForCurrentAnswer.questionType === 'YESNOPOPUP') {
              questionForCurrentAnswer.formData.forEach(() => {
                answerStructure.details = [];
              });
            } else if (questionForCurrentAnswer.questionType === 'YESNOFORM') {
              questionForCurrentAnswer.formData.forEach((formElement) => {
                Object.defineProperty(answerStructure.details, formElement.valueType, {
                  value: '',
                  writable: true,
                  enumerable: true,
                  configurable: true,
                });
              });
            }
            answer.answerDetails.push(answerStructure);
          });
        }
      });
    }
  }

  getProposalFormData() {
    this.loaderService.showSpinner(true);
    this.proposalservice
      .getProposalFormData(this.productId, this.formType, this.insuredData.online)
      .subscribe(
        (formData) => {
          this.loaderService.showSpinner(false);
          this.screens = formData;
          this.screens.screens.forEach((screen) => {
            if (screen.isArray) {
              this.handleSectionsIfArrayRequired(screen);
            }
            if (screen.preRenderRequirementsChecks) {
              this.preRenderRequirementsChecks(screen);
            }
          });
          this.screensCopy = JSON.parse(JSON.stringify(formData));
          // this.screens = sampleProposalMetaData;
          // this.screens.screens.forEach((screen) => {
          //   if (screen.isArray) {
          //     this.handleSectionsIfArrayRequired(screen);
          //   }
          //   if (screen.preRenderRequirementsChecks) {
          //     this.preRenderRequirementsChecks(screen);
          //   }
          // });
          // console.log('checking the screen', this.screens);
          // this.screensCopy = JSON.parse(JSON.stringify(sampleProposalMetaData));

          if (this.insuredData.lob === 'Travel') {
            this.proposalservice.getTravelCountries().subscribe(
              (data) => {
                this.countriesList = data;
              },
              () => {
                this.countriesList = [];
              },
            );
          }
          if (this.insuredData.lob === 'Motor') {
            if (this.insuredData.applicationData?.vehicleInfo?.policyType === 'NB') {
              this.screens.screens.splice(2, 1);
              this.screens.screens[1].nextScreen = 'Proposer';
              const vehicleScreen = this.screens.screens.find(
                (screen) => screen.screenName === 'Vehicle',
              );
              const regNoFormData = vehicleScreen.sections[1].formData.find(
                (form) => form.controlName === 'vehicleRegno',
              );
              delete regNoFormData.validators.required;
            }
          }
          if (this.insuredData.lob === 'Life' && this.insuredData.productType === 'GC') {
            this.removeSecondaryInsuredScreen();
            const primaryInsured = this.screens.screens.find(
              (screen) => screen.screenName === 'Primary Insured',
            );
            const primarySections = primaryInsured.sections.filter((section) => {
              if (
                !this.applicationData.primaryInsured.medicalRequired &&
                section.sectionName === 'Declaration of Good Health'
              ) {
                return section;
              } else if (
                this.applicationData.primaryInsured.medicalRequired &&
                section.sectionName === 'For Female Life only'
              ) {
                return section;
              } else if (section.sectionName === 'Life Style Details') {
                return section;
              } else if (
                this.applicationData.primaryInsured.medicalRequired &&
                section.sectionName === 'Family Details'
              ) {
                return section;
              } else if (
                this.applicationData.primaryInsured.medicalRequired &&
                section.sectionName === 'General Details'
              ) {
                return section;
              } else if (
                this.applicationData.primaryInsured.medicalRequired &&
                section.sectionName === 'Medical History'
              ) {
                return section;
              } else if (section.sectionName === 'Covid Form') {
                return section;
              } else if (!section.medicalSection) {
                return section;
              }
            });
            primaryInsured.sections = primarySections;
            const secondaryInsured = this.screens.screens.find(
              (screen) => screen.screenName === 'Secondary Insured',
            );
            if (secondaryInsured) {
              const secondarySections = secondaryInsured.sections.filter((section) => {
                if (
                  !this.applicationData.secondaryInsured.medicalRequired &&
                  section.sectionName === 'Declaration of Good Health'
                ) {
                  return section;
                } else if (
                  this.applicationData.secondaryInsured.medicalRequired &&
                  section.sectionName === 'For Female Life only'
                ) {
                  return section;
                } else if (section.sectionName === 'Life Style Details') {
                  return section;
                } else if (
                  this.applicationData.secondaryInsured.medicalRequired &&
                  section.sectionName === 'Family Details'
                ) {
                  return section;
                } else if (
                  this.applicationData.secondaryInsured.medicalRequired &&
                  section.sectionName === 'General Details'
                ) {
                  return section;
                } else if (
                  this.applicationData.secondaryInsured.medicalRequired &&
                  section.sectionName === 'Medical History'
                ) {
                  return section;
                } else if (section.sectionName === 'Covid Form') {
                  return section;
                } else if (!section.medicalSection) {
                  return section;
                }
              });
              secondaryInsured.sections = secondarySections;
            }
          }

          this.fetchMastersData();

          // this.buildFirstScreenForm();
        },
        () => {
          // uncomment below commented screens for checking sompo
          // this.screens = sampleProposalMetaData;
          // this.screens.screens.forEach((screen) => {
          //   if (screen.isArray) {
          //     this.handleSectionsIfArrayRequired(screen);
          //   }
          //   if (screen.preRenderRequirementsChecks) {
          //     this.preRenderRequirementsChecks(screen);
          //   }
          // });
          // console.log('checking the screen', this.screens);
          // this.screensCopy = JSON.parse(JSON.stringify(sampleProposalMetaData));
          // if (
          //   this.insuredData.applicationData.addonBenefits &&
          //   this.insuredData.applicationData.addonBenefits.length === 0
          // ) {
          //   const additionalCoversIndex = this.screens.screens.findIndex(
          //     (screen) => screen.screenName === 'Additional Covers',
          //   );
          //   if (additionalCoversIndex > 0) {
          //     this.screens.screens[additionalCoversIndex - 1].nextScreen =
          //       this.screens.screens[additionalCoversIndex + 1].screenName;
          //     this.screens.screens[additionalCoversIndex - 1].validations = {
          //       ...this.screens.screens[additionalCoversIndex - 1].validations,
          //       ...this.screens.screens[additionalCoversIndex].validations,
          //     };
          //     this.screens.screens.splice(additionalCoversIndex, 1);
          //     console.log('screens', this.screens);
          //   }
          // }
          // console.log('screens', this.screens);
          // this.fetchMastersData();
          // this.screensCopy = JSON.parse(JSON.stringify(sampleProposalMetaData));
          this.loaderService.showSpinner(false);
          this.errorMessage = 'Sorry! Error loading application. Please try after sometime.';
          this.errorLoadingApplicationDetails = true;
        },
      );
  }

  handleSectionsIfArrayRequired(currentScreen) {
    if (currentScreen.isArray) {
      // console.log('sections', currentScreen);
      const sections = currentScreen.sections.splice(0);
      this.applicationData[currentScreen.tag].forEach((data, arrayIndex) => {
        // console.log('each data', data, arrayIndex);
        // console.log('section', sections);
        const sectionToAppend = sections.map((section) => {
          const sectionCopy = JSON.parse(JSON.stringify(section));
          const mappedFormField = section.formData.map((form) => {
            const formCopy = JSON.parse(JSON.stringify(form));
            formCopy.controlName = formCopy.controlName + arrayIndex;
            return formCopy;
          });
          sectionCopy.formData = mappedFormField;
          sectionCopy.arrayIndex = arrayIndex;
          // console.log('form copy', mappedFormField);
          return sectionCopy;
        });
        // currentScreen.sections = sectionToAppend;
        currentScreen.sections.push(...sectionToAppend);
      });
      // console.log('currentScreen', currentScreen);
    }
  }

  preRenderRequirementsChecks(screen) {
    if (
      screen.preRenderRequirementsChecks.removeEdit &&
      screen.preRenderRequirementsChecks.removeEdit.length > 0
    ) {
      screen.preRenderRequirementsChecks.removeEdit.forEach((field) => {
        let requiredField;
        screen.sections.forEach((section) => {
          requiredField = section.formData.find((form) => {
            return form.controlName === field.fieldName;
          });
          if (requiredField !== undefined) {
            let requiredLevel = this.insuredData;
            if (field.tagKey && field.tagKey.length > 0) {
              field.tagKey.forEach((key) => {
                requiredLevel = requiredLevel[key];
              });
            }
            if (field.checkCondition === 'hasValue') {
              if (requiredLevel[field.tagToCheck] !== '') {
                requiredField.initiallyDisabled = true;
              }
            }
          }
        });
      });
    }
    if (
      screen.preRenderRequirementsChecks.removeFields &&
      screen.preRenderRequirementsChecks.removeFields.length > 0
    ) {
      screen.preRenderRequirementsChecks.removeFields.forEach((field) => {
        screen.sections.forEach((section) => {
          const sectionFormData = section.formData;
          if (sectionFormData && sectionFormData.length > 0) {
            const index = sectionFormData.findIndex(
              (eachForm) => eachForm.controlName === field.fieldName,
            );
            console.log(field.fieldName, index);
            if (index > -1) {
              let requiredLevel = this.insuredData;
              if (field.tagKey && field.tagKey.length > 0) {
                field.tagKey.forEach((key) => {
                  requiredLevel = requiredLevel[key];
                });
              }
              if (field.operator === 'EQUAL') {
                if (requiredLevel[field.tagToCheck] === field.value) {
                  sectionFormData.splice(index, 1);
                }
              } else if (field.operator === 'GREATER') {
                if (requiredLevel[field.tagToCheck] > field.value) {
                  sectionFormData.splice(index, 1);
                }
              } else if (field.operator === 'LESSER') {
                if (requiredLevel[field.tagToCheck] < field.value) {
                  sectionFormData.splice(index, 1);
                }
              }
            }
          }
        });
      });
      for (let sectionIndex = screen.sections.length - 1; sectionIndex >= 0; sectionIndex--) {
        const currentSection = screen.sections[sectionIndex];
        if (currentSection.formData && currentSection.formData.length === 0) {
          screen.sections.splice(sectionIndex, 1);
        }
      }
    }
    if (
      screen.preRenderRequirementsChecks.removeValidators &&
      screen.preRenderRequirementsChecks.removeValidators.length > 0
    ) {
      screen.preRenderRequirementsChecks.removeValidators.forEach((validator) => {
        if (screen.isArray) {
          screen.sections.forEach((section) => {
            const sectionFormData = section.formData;
            if (sectionFormData && sectionFormData.length > 0) {
              const index = sectionFormData.findIndex(
                (eachForm) => eachForm.controlName.slice(0, -1) === validator.fieldName,
              );
              if (index > -1) {
                const arrayIndex = +sectionFormData[index].controlName.slice(-1);
                let requiredLevel = this.insuredData;
                if (validator.tagKey && validator.tagKey.length > 0) {
                  validator.tagKey.forEach((key) => {
                    requiredLevel = requiredLevel[key];
                  });
                }
                if (validator.operator === 'EQUAL') {
                  if (requiredLevel[arrayIndex][validator.tagToCheck] === validator.value) {
                    validator.validatorToBeRemoved.forEach((validation) => {
                      delete sectionFormData[index].validators[validation];
                    });
                  }
                } else if (validator.operator === 'GREATER') {
                  if (requiredLevel[arrayIndex][validator.tagToCheck] > validator.value) {
                    validator.validatorToBeRemoved.forEach((validation) => {
                      delete sectionFormData[index].validators[validation];
                    });
                  }
                } else if (validator.operator === 'LESSER') {
                  console.log('LESSER', requiredLevel);
                  if (requiredLevel[arrayIndex][validator.tagToCheck] < validator.value) {
                    validator.validatorToBeRemoved.forEach((validation) => {
                      delete sectionFormData[index].validators[validation];
                    });
                  }
                }
              }
            }
          });
        } else if (!screen.isArray) {
          screen.sections.forEach((section) => {
            const sectionFormData = section.formData;
            if (sectionFormData && sectionFormData.length > 0) {
              const index = sectionFormData.findIndex(
                (eachForm) => eachForm.controlName === validator.fieldName,
              );
              if (index > -1) {
                let requiredLevel = this.insuredData;
                if (validator.tagKey && validator.tagKey.length > 0) {
                  validator.tagKey.forEach((key) => {
                    requiredLevel = requiredLevel[key];
                  });
                }
                if (validator.operator === 'EQUAL') {
                  if (requiredLevel[validator.tagToCheck] === validator.value) {
                    validator.validatorToBeRemoved.forEach((validation) => {
                      delete sectionFormData[index].validators[validation];
                    });
                  }
                } else if (validator.operator === 'GREATER') {
                  if (requiredLevel[validator.tagToCheck] > validator.value) {
                    validator.validatorToBeRemoved.forEach((validation) => {
                      delete sectionFormData[index].validators[validation];
                    });
                  }
                } else if (validator.operator === 'LESSER') {
                  console.log('LESSER', requiredLevel);
                  if (requiredLevel[validator.tagToCheck] < validator.value) {
                    validator.validatorToBeRemoved.forEach((validation) => {
                      delete sectionFormData[index].validators[validation];
                    });
                  }
                }
              }
            }
          });
        }
      });
    }
  }

  filterMasterValues(form) {
    // console.log('current form', form);
    form.filterMasterValues.forEach((filter) => {
      // console.log('filter', filter);
      const index = form.options.findIndex((option) => option.id === filter.id);
      // console.log('id, index', filter.id, index);
      if (index > -1) {
        let requiredLevel = this.insuredData;
        if (filter.tagKey && filter.tagKey.length > 0) {
          filter.tagKey.forEach((key) => {
            requiredLevel = requiredLevel[key];
          });
        }
        if (!Array.isArray(requiredLevel)) {
          if (filter.operator === 'EQUAL') {
            if (requiredLevel[filter.tagToCheck] === filter.value) {
              form.options.splice(index, 1);
            }
          } else if (filter.operator === 'GREATER') {
            if (requiredLevel[filter.tagToCheck] > filter.value) {
              form.options.splice(index, 1);
            }
          } else if (filter.operator === 'LESSER') {
            // console.log('LESSER', requiredLevel);
            // console.log('value in obj', requiredLevel[filter.tagToCheck]);
            // console.log('value in filter', filter.value);
            if (requiredLevel[filter.tagToCheck] < filter.value) {
              form.options.splice(index, 1);
              // console.log('form options', form.options);
            }
          }
        } else {
          // console.log('required level is an array');
          requiredLevel.some((level) => {
            if (filter.operator === 'EQUAL') {
              if (requiredLevel[filter.tagToCheck] === filter.value) {
                // console.log('value is equal to specified');
                form.options.splice(index, 1);
                return true;
              }
            } else if (filter.operator === 'GREATER') {
              if (level[filter.tagToCheck] > filter.value) {
                // console.log('LESSER', requiredLevel);
                // console.log('value in obj', level[filter.tagToCheck]);
                // console.log('value in filter', filter.value);
                // console.log('value is greater than specified');
                form.options.splice(index, 1);
                return true;
              }
            } else if (filter.operator === 'LESSER') {
              // console.log('LESSER', requiredLevel);
              // console.log('value in obj', level[filter.tagToCheck]);
              // console.log('value in filter', filter.value);
              if (level[filter.tagToCheck] < filter.value) {
                // console.log('value is lesser than specified');
                form.options.splice(index, 1);
                // console.log('form options', form.options);
                return true;
              }
            }
          });
        }
        // console.log('required level', requiredLevel);
      }
    });
  }

  removeSecondaryInsuredScreen() {
    if (this.applicationData.loanDetails.coBorrower === 'N') {
      const secondaryInsuredIndex = this.screens.screens.findIndex(
        (screen) => screen.screenName === 'Secondary Insured',
      );
      if (secondaryInsuredIndex > -1) {
        this.screens.screens[secondaryInsuredIndex - 1].nextScreen =
          this.screens.screens[secondaryInsuredIndex + 1].screenName;
        this.screens.screens.splice(secondaryInsuredIndex, 1);
        Object.keys(this.insuredData.applicationData.secondaryInsured).forEach(
          (key) => (this.insuredData.applicationData.secondaryInsured[key] = ''),
        );
        this.stepperFormGroups.splice(1);
      }
    } else if (this.applicationData.loanDetails.coBorrower === 'Y') {
      const secondaryInsuredIndex = this.screens.screens.findIndex(
        (screen) => screen.screenName === 'Secondary Insured',
      );
      if (secondaryInsuredIndex === -1) {
        const secondaryInsuredIndexFromCopy = this.screensCopy.screens.findIndex(
          (screen) => screen.screenName === 'Secondary Insured',
        );
        if (secondaryInsuredIndexFromCopy > -1) {
          this.screens.screens.splice(1, this.screensCopy.screens.slice(1));
          this.screens.screens.splice(
            secondaryInsuredIndexFromCopy,
            0,
            this.screensCopy.screens[secondaryInsuredIndexFromCopy],
          );
          this.stepperFormGroups.splice(1);
          this.insuredData.secondaryInsured = JSON.parse(
            JSON.stringify(this.insuredDataCopy.applicationData.secondaryInsured),
          );
          this.screens.screens[secondaryInsuredIndexFromCopy].sections.forEach((section) => {
            section.formData.forEach((form) => {
              if (form.isLoadedFromMaster) {
                const master = form.masterValue;
                if (master === 'Relationship') {
                  form.options = this.relationshipDropdown;
                } else if (master === 'Title') {
                  form.options = this.titleDropdown;
                } else if (master === 'NomineeRelationShip') {
                  form.options = this.nomineeRelationshipDropdown;
                } else if (master === 'Nationality') {
                  form.options = this.nationalityDropdown;
                }
              }
            });
          });
        }
      }
    }
  }

  fetchMastersData() {
    const masterCodes = [];
    const medicalMasterCodes = [];
    this.screens.screens.forEach((screen) => {
      if (screen.sections) {
        screen.sections.forEach((section) => {
          section.formData.forEach((form) => {
            if (form.masterValue && masterCodes.indexOf(form.masterValue) === -1) {
              masterCodes.push(form.masterValue);
            }
          });
        });
      }
    });
    this.masterCount = masterCodes.length;
    let apiCount = 0;
    masterCodes.forEach((master) => {
      let productId = this.insuredData.productId;
      if (master === 'SpForInsurer') {
        productId = this.insuredData.branchCode;
      }
      this.proposalservice.getDropdownFromMaster(master, productId).subscribe((dropdown: any[]) => {
        this.screens.screens.forEach((screen) => {
          if (screen.sections) {
            screen.sections.forEach((section) => {
              section.formData.forEach((form) => {
                if (form.masterValue && master === form.masterValue) {
                  form.options = dropdown;
                  if (form.filterMasterValues && form.filterMasterValues.length > 0) {
                    this.filterMasterValues(form);
                  }
                  if (master === 'Relationship') {
                    this.relationshipDropdown = dropdown;
                  } else if (master === 'MedicalQuestion') {
                    if (medicalMasterCodes.indexOf(master) === -1) {
                      medicalMasterCodes.push(master);
                      // uncomment and copy below code to respective questions to add sampleQuestionData. Changes also needs to be done in create genral.
                      // const needQ = dropdown.find((formQ) => formQ.code === 'ped-1');
                      // dropdown = [needQ];
                      // dropdown.splice(0, dropdown.length, sampleQstruc);
                      // console.log(dropdown);
                      this.policyQuestions = [...this.policyQuestions, ...dropdown];
                    }
                    section.formData = dropdown;
                    // this.policyQuestions = AvivaGCMedicalsection.formData;
                  } else if (master === 'DoghQuestions') {
                    if (medicalMasterCodes.indexOf(master) === -1) {
                      medicalMasterCodes.push(master);
                      this.policyQuestions = [...this.policyQuestions, ...dropdown];
                    }
                    section.formData = dropdown;
                  } else if (master === 'LifestyleQuestions') {
                    if (medicalMasterCodes.indexOf(master) === -1) {
                      medicalMasterCodes.push(master);
                      this.policyQuestions = [...this.policyQuestions, ...dropdown];
                    }
                    section.formData = dropdown;
                  } else if (master === 'FamilyQuestions') {
                    if (medicalMasterCodes.indexOf(master) === -1) {
                      medicalMasterCodes.push(master);
                      this.policyQuestions = [...this.policyQuestions, ...dropdown];
                    }
                    section.formData = dropdown;
                  } else if (master === 'GenralQuestions') {
                    if (medicalMasterCodes.indexOf(master) === -1) {
                      medicalMasterCodes.push(master);
                      this.policyQuestions = [...this.policyQuestions, ...dropdown];
                    }
                    section.formData = dropdown;
                  } else if (master === 'FemaleLifeQuestions') {
                    if (medicalMasterCodes.indexOf(master) === -1) {
                      medicalMasterCodes.push(master);
                      this.policyQuestions = [...this.policyQuestions, ...dropdown];
                    }
                    section.formData = dropdown;
                  } else if (master === 'MedicalHistory') {
                    if (medicalMasterCodes.indexOf(master) === -1) {
                      medicalMasterCodes.push(master);
                      this.policyQuestions = [...this.policyQuestions, ...dropdown];
                    }
                    section.formData = dropdown;
                  } else if (master === 'CovidQuestions') {
                    if (medicalMasterCodes.indexOf(master) === -1) {
                      medicalMasterCodes.push(master);
                      this.policyQuestions = [...this.policyQuestions, ...dropdown];
                    }
                    section.formData = dropdown;
                  } else if (master === 'Title') {
                    this.titleDropdown = dropdown;
                  } else if (master === 'NomineeRelationShip') {
                    this.nomineeRelationshipDropdown = dropdown;
                  } else if (master === 'Nationality') {
                    this.nationalityDropdown = dropdown;
                  } else if (
                    master === 'PolicyCategorisation' &&
                    !this.applicationData.proposerInsured
                  ) {
                    form.options = form.options.filter((option) => {
                      return (
                        form.proposerInsuredOption.findIndex((reqOption) => {
                          return reqOption === option.id;
                        }) > -1
                      );
                    });
                  }
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

  buildFirstScreenForm() {
    const firstScreenData = this.screens.screens.find((screen, index) => index === 0);
    this.stepperFormGroups.push(new FormGroup({}));
    if (firstScreenData.component === 'policy-questions') {
      this.createPolicyForm(-1);
    } else if (firstScreenData.component === 'medical-questions') {
      this.createMedicalForm(-1);
    } else if (firstScreenData.component === 'property') {
      this.createPropertyForm(-1);
    } else if (firstScreenData.component === 'proposer') {
      this.createProposerForm(-1);
    } else if (firstScreenData.component === 'contact-info') {
      this.createContactInfoForm(-1);
    } else if (firstScreenData.component === 'additional-covers') {
      // this.createContactInfoForm(0);
    } else if (firstScreenData.component === 'previous-policy') {
      this.createPreviousPolicyForm(-1);
    } else if (firstScreenData.component === 'vehicle') {
      this.createVehicleForm(-1);
    } else if (firstScreenData.component === 'insured') {
      this.createInsuredForm(-1);
    } else if (firstScreenData.component === 'payment') {
      this.createPaymentForm(-1);
    } else if (firstScreenData.component === 'genral') {
      this.createGenralForm(-1);
    }
    if (this.insuredData.productType === 'GC') {
      this.removeSecondaryInsuredScreen();
    }
  }

  goToNextScreen(screen, nextScreen, component, index, stepper: MatStepper) {
    // console.log('checking next screen', screen, nextScreen);
    // console.log('checking component', component, index);
    // console.log('total number of screens', this.screens.screens.length);
    // console.log('checking component', nextScreenComponent);
    const nextScreenComponent = this.screens.screens[index + 1].component;
    let isCurrentScreenValidated = true;
    if (this.insuredData.status !== 'INFORCE' && screen.validations) {
      // if (screen.validations.initiatePayment) {
      //   this.initiatePayment(stepper);
      // }
      // if (screen.validations.sendForSPApproval) {
      //   this.sendForSPApproval(stepper);
      // }
      if (screen.validations.checkBmi) {
        const errorMessage = this.checkBmi();
        if (errorMessage.length > 0) {
          isCurrentScreenValidated = false;
          this.openErrorDisplayModal(errorMessage);
        }
      }
      if (screen.validations.checkEducationValidation) {
        const errorMessage = this.checkEducationValidation(screen);
        if (errorMessage.length > 0) {
          isCurrentScreenValidated = false;
          this.openErrorDisplayModal(errorMessage);
        }
      }
      if (screen.validations.checkOccupationValidation) {
        const errorMessage = this.checkOccupationValidation(screen);
        if (errorMessage.length > 0) {
          isCurrentScreenValidated = false;
          this.openErrorDisplayModal(errorMessage);
        }
      }
      if (screen.validations.checkMaritalStatus) {
        const errorMessage = this.checkMaritalStatus();
        if (errorMessage.length > 0) {
          isCurrentScreenValidated = false;
          this.openErrorDisplayModal(errorMessage);
        }
      }
      if (screen.validations.checkMedicalAnswers) {
        const errorMessage = this.checkMedicalAnswers(index);
        if (errorMessage.length > 0) {
          isCurrentScreenValidated = false;
          this.openErrorDisplayModalNew(errorMessage);
         
        }
      }
      if (screen.validations.checkTitleValidations) {
        const errorMessage = this.checkTitleValidations(screen, index);
        if (errorMessage.length > 0) {
          isCurrentScreenValidated = false;
          this.openErrorDisplayModal(errorMessage);
        }
      }
      if (screen.validations.checkTotalSum) {
        const errorMessage = this.checkTotalSum(screen, index);
        if (errorMessage.length > 0) {
          isCurrentScreenValidated = false;
          this.openErrorDisplayModal(errorMessage);
        }
      }
    } else {
      isCurrentScreenValidated = true;
    }
    if (this.stepperFormGroups.length === index + 1 && isCurrentScreenValidated) {
      this.stepperFormGroups.push(new FormGroup({}));
    }
    if (nextScreenComponent === 'medical-questions' && isCurrentScreenValidated) {
      this.createMedicalForm(index);
      stepper.next();
    } else if (nextScreen === 'Policy' && isCurrentScreenValidated) {
      this.createPolicyForm(index);
      stepper.next();
    } else if (nextScreen === 'Vehicle' && isCurrentScreenValidated) {
      this.createVehicleForm(index);
      stepper.next();
    } else if (
      nextScreen === 'Insured' &&
      isCurrentScreenValidated &&
      nextScreenComponent === 'insured'
    ) {
      this.createInsuredForm(index);
      stepper.next();
    } else if (nextScreen === 'Previous Policy' && isCurrentScreenValidated) {
      this.createPreviousPolicyForm(index);
      stepper.next();
    } else if (nextScreenComponent === 'genral' && isCurrentScreenValidated) {
      this.createGenralForm(index);
      stepper.next();
    } else if (
      (nextScreen === 'Proposer' || nextScreen === 'Basic Info About Proposer') &&
      isCurrentScreenValidated
    ) {
      this.createProposerForm(index);
      stepper.next();
    } else if (nextScreen === 'Contact Info' && isCurrentScreenValidated) {
      this.createContactInfoForm(index);
      stepper.next();
    } else if (nextScreen === 'Additional Covers' && isCurrentScreenValidated) {
      stepper.next();
    } else if (nextScreen === 'Documents' && isCurrentScreenValidated) {
      stepper.next();
    } else if (nextScreen === 'Payment' && isCurrentScreenValidated) {
      this.paymentIndex = index + 1;
      this.createPaymentForm(index);
      stepper.next();
    } else if (nextScreenComponent === 'property') {
      this.createPropertyForm(index);
      stepper.next();
    } else if (nextScreen === 'Summary' && isCurrentScreenValidated) {
      this.isFormEditable = false;
      this.createSummaryForm(index);
      stepper.next();
    } else if (nextScreen === 'Success') {
      stepper.steps.forEach((step) => {
        step.completed = true;
      });
      if (this.insuredData.status !== 'INFORCE') {
        if (screen.validations.sendLeadToInsurer) {
          stepper.next();
        } else if (screen.validations.sendForSPApproval) {
          this.sendForSPApproval(stepper);
        } else if (screen.validations.initiatePayment) {
          this.initiatePayment(stepper);
        } else {
          stepper.next();
        }
      } else {
        stepper.next();
      }
    }
  }

  fillProposerFormInsured(index) {
    const currentFormGroup = this.stepperFormGroups[index + 1];
    let currentKey = '';
    let proposerDetails;
    if (this.insuredDetails && this.insuredDetails.length > 0 && this.relationshipDropdown) {
      const selfRelationship = this.relationshipDropdown.find(
        (rel) => rel.value.toLowerCase().indexOf('self') > -1,
      );
      proposerDetails = this.insuredDetails.find(
        (insurer) => insurer.proposerRel === selfRelationship.id,
      );
    }
    this.proposerDetails = proposerDetails;
    if (proposerDetails) {
      this.isInsuredAlsoProposer = true;
      this.screens.screens[index + 1].sections.forEach((section) => {
        if (
          !section.isDependent ||
          (section.isDependent &&
            section.sectionVisibleIfDependentValueIn.findIndex(
              (value) =>
                value === currentFormGroup.get(section.dependsOnControl + currentKey).value,
            ) > -1)
        ) {
          section.formData.forEach((form) => {
            currentKey = '';
            currentKey = form.key !== '' ? '-' + form.key : '';
            const validatorsArray = this.getValidatorsArray(form);
            if (form.key === 'proposer') {
              if (
                form.controlName.toLowerCase().indexOf('mobile') === -1 &&
                form.controlName.toLowerCase().indexOf('pan') === -1 &&
                form.controlName.toLowerCase().indexOf('email') === -1 &&
                proposerDetails[form.valueType] !== undefined &&
                proposerDetails[form.valueType] !== null
              ) {
                currentFormGroup.addControl(
                  form.controlName + currentKey,
                  new FormControl(proposerDetails[form.valueType]?.toString(), validatorsArray),
                );
                this.applicationData[form.key][form.valueType] = proposerDetails[form.valueType];
              } else if (form.selectFromRoot) {
                currentFormGroup.addControl(
                  form.controlName,
                  new FormControl(this.insuredData[form.controlName], validatorsArray),
                );
              } else {
                currentFormGroup.addControl(
                  form.controlName + currentKey,
                  new FormControl(this.applicationData[form.key][form.valueType], validatorsArray),
                );
              }
            } else if (form.selectFromRoot) {
              currentFormGroup.addControl(
                form.controlName + currentKey,
                new FormControl(this.insuredData[form.controlName]?.toString(), validatorsArray),
              );
            } else {
              currentFormGroup.addControl(
                form.controlName + currentKey,
                new FormControl(this.applicationData[form.key][form.valueType], validatorsArray),
              );
            }
            if (form.controlType === 'seachableDropdown') {
              currentFormGroup.addControl('searchCtrl', new FormControl(''));
            }
            if (
              currentFormGroup.get(form.controlName + currentKey).valid &&
              form.initiallyDisabled
            ) {
              currentFormGroup.get(form.controlName + currentKey).disable();
            }
            if (form.hasOwnProperty('isInsuredproposerTagtoCheck')) {
              if (
                this.applicationData[form.isInsuredproposerTagtoCheck] &&
                currentFormGroup.get(form.controlName + currentKey).valid
              ) {
                console.log(currentFormGroup.get(form.controlName + currentKey));
                currentFormGroup.get(form.controlName + currentKey).disable();
              }
            }
            if (form.valueIsDependent) {
              currentFormGroup.get(form.valueIsDependentOnControl).valueChanges.subscribe((val) => {
                const dependentValArr = Object.keys(form.valueSetBasedOnDependentValue);
                if (dependentValArr.findIndex((valKey) => valKey === val) > -1) {
                  currentFormGroup
                    .get(form.controlName + currentKey)
                    .setValue(form.valueSetBasedOnDependentValue[val].id);
                  if (form.valueIsDependentToDisable) {
                    if (
                      form.valueIsDependentToDisableValue.findIndex(
                        (disableValue) => disableValue === val,
                      ) > -1
                    ) {
                      this.applicationData[form.key][form.controlName] =
                        form.valueSetBasedOnDependentValue[val].id;
                      currentFormGroup.get(form.controlName + currentKey).disable();
                    } else {
                      if (currentFormGroup.get(form.controlName + currentKey).disabled) {
                        currentFormGroup.get(form.controlName + currentKey).enable();
                      }
                    }
                  }
                } else {
                  if (currentFormGroup.get(form.controlName + currentKey).disabled) {
                    currentFormGroup.get(form.controlName + currentKey).enable();
                  }
                }
              });
            }
          });
        }
      });
    } else {
      this.screens.screens[index + 1].sections.forEach((section) => {
        if (
          !section.isDependent ||
          (section.isDependent &&
            section.sectionVisibleIfDependentValueIn.findIndex(
              (value) =>
                value === currentFormGroup.get(section.dependsOnControl + currentKey).value,
            ) > -1)
        ) {
          section.formData.forEach((form) => {
            currentKey = '';
            currentKey = '-' + form.key;
            const validatorsArray = this.getValidatorsArray(form);
            currentFormGroup.addControl(
              form.controlName + currentKey,
              new FormControl(this.applicationData[form.key][form.valueType], validatorsArray),
            );
            if (form.controlType === 'seachableDropdown') {
              currentFormGroup.addControl('searchCtrl', new FormControl(''));
            }
            // currentFormGroup
            //   .addControl(form.controlName, new FormControl(this.applicationData[form.valueType], validatorsArray));
            if (form.controlName === 'proposerType' && this.applicationData.proposer.isIndividual) {
              currentFormGroup.get('proposerType' + currentKey).setValue('I');
            } else if (form.controlName === 'proposerType') {
              currentFormGroup.get('proposerType' + currentKey).setValue('C');
            }
            if (
              form.initiallyDisabled &&
              currentFormGroup.get(form.controlName + currentKey).valid
            ) {
              currentFormGroup.get(form.controlName + currentKey).disable();
            }
            if (form.valueIsDependent) {
              currentFormGroup.get(form.valueIsDependentOnControl).valueChanges.subscribe((val) => {
                const dependentValArr = Object.keys(form.valueSetBasedOnDependentValue);
                if (dependentValArr.findIndex((valKey) => valKey === val) > -1) {
                  currentFormGroup
                    .get(form.controlName + currentKey)
                    .setValue(form.valueSetBasedOnDependentValue[val].id);
                  if (form.valueIsDependentToDisable) {
                    if (
                      form.valueIsDependentToDisableValue.findIndex(
                        (disableValue) => disableValue === val,
                      ) > -1
                    ) {
                      this.applicationData[form.key][form.controlName] =
                        form.valueSetBasedOnDependentValue[val].id;
                      currentFormGroup.get(form.controlName + currentKey).disable();
                    } else {
                      if (currentFormGroup.get(form.controlName + currentKey).disabled) {
                        currentFormGroup.get(form.controlName + currentKey).enable();
                      }
                    }
                  }
                } else {
                  if (currentFormGroup.get(form.controlName + currentKey).disabled) {
                    currentFormGroup.get(form.controlName + currentKey).enable();
                  }
                }
              });
            }
          });
        }
      });
    }
  }

  createGenralForm(index) {
    const currentFormGroup = this.stepperFormGroups[index + 1];
    const currentScreen = this.screens.screens[index + 1];
    if (currentScreen.screenName.toLowerCase().indexOf('proposer') > -1) {
      this.fillProposerFormInsured(index);
    } else {
      this.screens.screens[index + 1].sections.forEach((section) => {
        // uncomment and edit below code for medical question structure. For formData in question section. Changes also needs to be done in fetchMastersData().
        // if (section.sectionName === 'Covid Form') {
        //   const needQ = section.formData.find((form) => form.code === 'covid-16');
        //   section.formData = [needQ];
        //   section.formData.splice(0, section.formData.length, sampleQstruc);
        //   console.log(section.formData);
        // }
        if (
          !section.isDependent ||
          (section.isDependent &&
            section.sectionVisibleIfDependentValueIn.findIndex(
              (value) => value === currentFormGroup.get(section.dependsOnControl)?.value,
            ) > -1)
        ) {
          if (!section.medicalSection && !currentScreen.isArray) {
            section.formData.forEach((form) => {
              const validatorsArray = this.getValidatorsArray(form);
              if (form.key !== '') {
                currentFormGroup.addControl(
                  form.controlName + '-' + form.key,
                  new FormControl(
                    this.insuredData.applicationData[form.key][form.controlName]?.toString(),
                    validatorsArray,
                  ),
                );
              } else {
                if (form.controlType === 'checkbox') {
                  if (this.insuredData.applicationData[form.controlName]?.toString() === 'Y') {
                    currentFormGroup.addControl(
                      form.controlName,
                      new FormControl(true, validatorsArray),
                    );
                  } else {
                    currentFormGroup.addControl(
                      form.controlName,
                      new FormControl(false, validatorsArray),
                    );
                  }
                } else if (form.selectFromRoot) {
                  currentFormGroup.addControl(
                    form.controlName,
                    new FormControl(
                      this.insuredData[form.controlName]?.toString(),
                      validatorsArray,
                    ),
                  );
                } else {
                  currentFormGroup.addControl(
                    form.controlName,
                    new FormControl(
                      this.insuredData.applicationData[form.controlName]?.toString(),
                      validatorsArray,
                    ),
                  );
                }
              }
              const currentKey = form.key ? '-' + form.key : '';
              if (
                form.initiallyDisabled &&
                currentFormGroup.get(form.controlName + currentKey).valid
              ) {
                currentFormGroup.get(form.controlName + currentKey).disable();
              }
              if (form.subscribeChanges) {
                if (!currentFormGroup.get(form.controlName + currentKey).disabled) {
                  currentFormGroup
                    .get(form.controlName + currentKey)
                    .valueChanges.subscribe((changes) => {
                      const Dform = form.subscribeActions.find((action) => {
                        return action.currentControlValue === changes;
                      });
                      const updatedValidators = this.getValidatorsArray(Dform.updateControl);
                      currentFormGroup
                        .get(Dform.updateControl.controlName)
                        .setValidators(updatedValidators);
                      currentFormGroup
                        .get(Dform.updateControl.controlName)
                        .updateValueAndValidity();
                      const valDependentform = section.formData.find((valform) => {
                        return valform.controlName === form.valDependentControlName;
                      });
                      valDependentform.validators = Dform.updateControl.validators;
                    });
                }
              }
            });
          } else if (!section.medicalSection) {
            section.formData.forEach((form) => {
              const i = +form.controlName.slice(-1);
              const validatorsArray = this.getValidatorsArray(form);
              if (form.key !== '') {
                currentFormGroup.addControl(
                  form.controlName + '-' + form.key,
                  new FormControl(
                    this.insuredData.applicationData[currentScreen.tag][i][
                      form.valueType
                    ]?.toString(),
                    validatorsArray,
                  ),
                );
              }
              const currentKey = form.key ? '-' + form.key : '';
              if (
                form.initiallyDisabled &&
                currentFormGroup.get(form.controlName + currentKey).valid
              ) {
                currentFormGroup.get(form.controlName + currentKey).disable();
              }
              if (form.subscribeChanges) {
                currentFormGroup.get(form.controlName).valueChanges.subscribe((changes) => {
                  const Dform = form.subscribeActions.find((action) => {
                    return action.currentControlValue === changes;
                  });
                  const updatedValidators = this.getValidatorsArray(Dform.updateControl);
                  console.log(currentFormGroup.get(Dform.updateControl.controlName));
                  currentFormGroup
                    .get(Dform.updateControl.controlName)
                    .setValidators(updatedValidators);
                  currentFormGroup.get(Dform.updateControl.controlName).updateValueAndValidity();
                  const valDependentform = section.formData.find((valform) => {
                    return valform.controlName === form.valDependentControlName;
                  });
                  valDependentform.validators = Dform.updateControl.validators;
                });
              }
            });
          } else {
            this.applicationData.answers.forEach((answer) => {
              if (answer.answerDetails === undefined || answer.answerDetails.length === 0) {
                answer.answerDetails = [];
                this.insurersNames.forEach((insurerName) => {
                  const answerStructure = {
                    memberId: insurerName.id,
                    answer: '',
                    details: {},
                  };
                  section.formData.forEach((question) => {
                    // question.questionType = 'YESNOFORM';
                    if (question.questionType === 'YESNOFORM') {
                      // question.formData = MedicalQuestionFollowUpQuestions;
                      question.formData.forEach((formElement) => {
                        Object.defineProperty(answerStructure.details, formElement.valueType, {
                          value: '',
                          writable: true,
                          enumerable: true,
                          configurable: true,
                        });
                      });
                      currentFormGroup.addControl(
                        `member-${insurerName.id}-question-${question.questionId}-allFilled`,
                        new FormControl(''),
                      );
                    } else if (question.questionType === 'YESNOPOPUP') {
                      question.formData.forEach(() => {
                        answerStructure.details = [];
                      });
                      currentFormGroup.addControl(
                        `member-${insurerName.id}-question-${question.questionId}-allFilled`,
                        new FormControl(''),
                      );
                    } else if (question.questionType === 'YESNOTEXT') {
                      Object.defineProperty(answerStructure.details, 'desc', {
                        value: '',
                        writable: true,
                        enumerable: true,
                        configurable: true,
                      });
                      currentFormGroup.addControl(
                        `member-${insurerName.id}-question-${question.questionId}`,
                        new FormControl('', Validators.required),
                      );
                    }
                  });
                  answer.answerDetails.push(answerStructure);
                });
              }
            });
            this.insurersNames = [];
            if (this.insuredData.lob === 'Life' && this.insuredData.productType === 'GC') {
              this.insurersNames.push({
                id: 0,
                name:
                  this.applicationData.primaryInsured.firstName +
                  ' ' +
                  this.applicationData.primaryInsured.lastName,
                gender: this.applicationData.primaryInsured.gender,
              });
              if (this.applicationData.loanDetails.coBorrower === 'Y') {
                this.insurersNames.push({
                  id: 1,
                  name:
                    this.applicationData.secondaryInsured.firstName +
                    ' ' +
                    this.applicationData.secondaryInsured.lastName,
                  gender: this.applicationData.secondaryInsured.gender,
                });
              }
            } else {
              this.applicationData.insureds.forEach((insured, id) => {
                this.insurersNames.push({
                  id,
                  name: insured.firstName + ' ' + insured.lastName,
                  gender: insured.gender,
                });
              });
            }
            if (
              currentScreen.screenName === 'Primary Insured' ||
              currentScreen.hasMedicalWithSingleInsured
            ) {
              section.formData.forEach((question) => {
                // console.log('adding this as well', this.insurersNames[0].id, question.questionId);
                currentFormGroup.addControl(
                  `member-${this.insurersNames[0].id}-question-${question.questionId}-allFilled`,
                  new FormControl(''),
                );
              });
            } else if (currentScreen.screenName === 'Secondary Insured') {
              section.formData.forEach((question) => {
                currentFormGroup.addControl(
                  `member-${this.insurersNames[1].id}-question-${question.questionId}-allFilled`,
                  new FormControl(''),
                );
              });
            } else if (currentScreen.hasMedicalWithSingleInsured) {
              section.formData.forEach((question) => {
                if (
                  question.questionType === 'YESNOFORM' ||
                  question.questionType === 'YESNOTEXT'
                ) {
                  currentFormGroup.addControl(
                    `member-${this.insurersNames[1].id}-question-${question.questionId}-allFilled`,
                    new FormControl(''),
                  );
                } else {
                  currentFormGroup.addControl(
                    question.code,
                    new FormControl('', Validators.required),
                  );
                }
              });
            }
            section.formData.forEach((policyQuestion) => {
              const positiveAnswerForCurrentQuestion = policyQuestion.positiveAnswer.substring(
                0,
                1,
              );
              const currentQuestionAnswer = this.applicationData.answers.find(
                (answer) => answer.questionId === policyQuestion.questionId,
              );
              let fillingFirstTime = true;
              let foundPositive = false;
              // let foundNegative = true;
              let currentMemberAnswer;
              if (currentScreen.screenName === 'Primary Insured') {
                currentMemberAnswer = currentQuestionAnswer.answerDetails.filter(
                  (answerDetail) => answerDetail.memberId === this.insurersNames[0].id,
                );
              } else if (currentScreen.screenName === 'Secondary Insured') {
                currentMemberAnswer = currentQuestionAnswer.answerDetails.filter(
                  (answerDetail) => answerDetail.memberId === this.insurersNames[1].id,
                );
              } else {
                currentMemberAnswer = currentQuestionAnswer.answerDetails.filter(
                  (answerDetail) => answerDetail.memberId === this.insurersNames[0].id,
                );
              }

              currentMemberAnswer.forEach((detail) => {
                if (detail.answer !== '') {
                  fillingFirstTime = false;
                  if (detail.answer !== positiveAnswerForCurrentQuestion) {
                    // foundNegative = true;
                    currentFormGroup.addControl(
                      `${policyQuestion.questionId}-member-${currentMemberAnswer[0].memberId}`,
                      new FormControl(detail.answer, [Validators.required]),
                    );
                  } else {
                    foundPositive = true;
                  }
                }
              });
              if (fillingFirstTime) {
                currentFormGroup.addControl(
                  `${policyQuestion.questionId}-member-${currentMemberAnswer[0].memberId}`,
                  new FormControl('', [Validators.required]),
                );
              } else if (foundPositive) {
                currentFormGroup.addControl(
                  `${policyQuestion.questionId}-member-${currentMemberAnswer[0].memberId}`,
                  new FormControl(positiveAnswerForCurrentQuestion, [Validators.required]),
                );
              }
            });
          }
        }
      });
    }
  }

  createPropertyForm(index) {
    const currentFormGroup = this.stepperFormGroups[index + 1];
    this.screens.screens[index + 1].sections.forEach((section) => {
      if (
        !section.isDependent ||
        (section.isDependent &&
          section.sectionVisibleIfDependentValueIn.findIndex(
            (value) => value === currentFormGroup.get(section.dependsOnControl).value,
          ) > -1)
      ) {
        section.formData.forEach((form) => {
          const validatorsArray = this.getValidatorsArray(form);
          if (Array.isArray(this.applicationData[form.key])) {
            this.applicationData[form.key].forEach((content) => {
              if (form.valueType === content.type && form.coverId === content.coverId) {
                if (form.controlType === 'radio') {
                  if (form.controlName === 'burglary' && content.sa !== 100) {
                    currentFormGroup.addControl(
                      form.controlName + '-' + form.key,
                      new FormControl('N', validatorsArray),
                    );
                  } else {
                    currentFormGroup.addControl(
                      form.controlName + '-' + form.key,
                      new FormControl('Y', validatorsArray),
                    );
                  }
                } else if (form.controlType === 'select') {
                  currentFormGroup.addControl(
                    form.controlName + '-' + form.key,
                    new FormControl(content[form.dependentTag]?.toString(), validatorsArray),
                  );
                } else {
                  currentFormGroup.addControl(
                    form.controlName + '-' + form.key,
                    new FormControl(content[form.dependentTag], validatorsArray),
                  );
                }
              }
            });
            if (form.controlType === 'radio') {
              currentFormGroup.addControl(
                form.controlName + '-' + form.key,
                new FormControl('N', validatorsArray),
              );
            }
          }
          if (form.key !== '') {
            currentFormGroup.addControl(
              form.controlName + '-' + form.key,
              new FormControl(
                this.insuredData.applicationData[form.key][form.controlName]?.toString(),
                validatorsArray,
              ),
            );
          } else {
            currentFormGroup.addControl(
              form.controlName,
              new FormControl(
                this.insuredData.applicationData[form.controlName]?.toString(),
                validatorsArray,
              ),
            );
          }
          const currentKey = form.key ? '-' + form.key : '';
          if (form.initiallyDisabled && currentFormGroup.get(form.controlName + currentKey).valid) {
            currentFormGroup.get(form.controlName + currentKey).disable();
          }
          if (form.subscribeChanges) {
            currentFormGroup
              .get(form.controlName + currentKey)
              .valueChanges.subscribe((changes) => {
                // console.log(changes);
                const Dform = form.subscribeActions.find((action) => {
                  return action.currentControlValue === changes;
                });
                const updatedValidatorsArr = this.getValidatorsArray(Dform.updateControl);
                if (currentFormGroup.controls[Dform.updateControl.controlName]) {
                  currentFormGroup
                    .get(Dform.updateControl.controlName)
                    .setValidators(updatedValidatorsArr);
                  currentFormGroup.get(Dform.updateControl.controlName).updateValueAndValidity();
                } else {
                  currentFormGroup.addControl(
                    Dform.updateControl.controlName,
                    new FormControl('', updatedValidatorsArr),
                  );
                }
              });
          }
        });
      }
    });
  }

  createVehicleForm(index) {
    const currentFormGroup = this.stepperFormGroups[index + 1];
    this.screens.screens[index + 1].sections.forEach((section) => {
      if (
        !section.isDependent ||
        (section.isDependent &&
          section.sectionVisibleIfDependentValueIn.findIndex(
            (value) => value === currentFormGroup.get(section.dependsOnControl).value,
          ) > -1)
      ) {
        section.formData.forEach((form) => {
          const validatorsArray = this.getValidatorsArray(form);
          let initialControlValue = '';
          if (form.controlType === 'radio') {
            initialControlValue = this.applicationData.vehicleInfo[form.controlName]
              ? this.applicationData.vehicleInfo[form.controlName]
              : 'N';
          } else {
            initialControlValue = this.applicationData.vehicleInfo[form.controlName];
          }
          currentFormGroup.addControl(
            form.controlName,
            new FormControl(initialControlValue, validatorsArray),
          );
        });
      }
    });
  }

  createPaymentForm(index) {
    const today = new Date();
    const currentFormGroup = this.stepperFormGroups[index + 1];
    if (this.customerAccountDetails && this.customerAccountDetails.length > 0) {
      currentFormGroup.addControl('paymentType', new FormControl('DBT', Validators.required));
      currentFormGroup.addControl(
        'accountNumber',
        new FormControl(this.customerAccountDetails[0].accountNo),
      );
      if (this.currentUser.organizationCode === 'KB') {
        currentFormGroup.addControl(
          'chequeOrDDNo',
          new FormControl(this.applicationData?.paymentInfo?.instrumentNo, [
            Validators.required,
            Validators.pattern(/[0-9]{6}/),
          ]),
        );
        currentFormGroup.addControl(
          'chkOrDDDate',
          new FormControl(this.applicationData?.paymentInfo?.instrumentDate, [Validators.required]),
        );
        currentFormGroup.addControl(
          'ifscCode',
          new FormControl(this.applicationData?.paymentInfo?.ifscCode, [
            Validators.required,
            Validators.pattern(/^[A-Z]{4}0[0-9]{6}$/),
          ]),
        );
      }
    } else {
      currentFormGroup.addControl(
        'paymentType',
        new FormControl(this.applicationData?.paymentInfo?.paymentType, [Validators.required]),
      );
      currentFormGroup.addControl(
        'chequeOrDDNo',
        new FormControl(this.applicationData?.paymentInfo?.instrumentNo, [
          Validators.required,
          Validators.pattern(/[0-9]{6}/),
        ]),
      );
      currentFormGroup.addControl(
        'chkOrDDDate',
        new FormControl(this.applicationData?.paymentInfo?.instrumentDate, [Validators.required]),
      );
      currentFormGroup.addControl(
        'ifscCode',
        new FormControl(this.applicationData?.paymentInfo?.ifscCode, [
          Validators.required,
          Validators.pattern(/^[A-Z]{4}0[0-9]{6}$/),
        ]),
      );
      currentFormGroup.addControl(
        'micrCode',
        new FormControl(this.applicationData?.paymentInfo?.micrCode, [
          Validators.required,
          Validators.pattern(/[0-9]{9}/),
        ]),
      );
    }
    currentFormGroup.addControl('premiumPayable', new FormControl(this.insuredData.premiumAmount));
    currentFormGroup.addControl('insurerName', new FormControl(this.insuredData.insurerName));
    currentFormGroup.addControl('customerName', new FormControl(this.insuredData.customerName));
    currentFormGroup.addControl(
      'dateOfPayment',
      new FormControl(today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear()),
    );
    if (
      currentFormGroup.get('paymentType').value === null ||
      currentFormGroup.get('paymentType').value === ''
    ) {
      currentFormGroup.get('chequeOrDDNo').disable();
      currentFormGroup.get('chkOrDDDate').disable();
    }
  }

  createPreviousPolicyForm(index) {
    const currentFormGroup = this.stepperFormGroups[index + 1];
    this.screens.screens[index + 1].sections.forEach((section) => {
      if (
        !section.isDependent ||
        (section.isDependent &&
          section.sectionVisibleIfDependentValueIn.findIndex(
            (value) => value === currentFormGroup.get(section.dependsOnControl).value,
          ) > -1)
      ) {
        section.formData.forEach((form) => {
          const validatorsArray = this.getValidatorsArray(form);
          currentFormGroup.addControl(
            form.controlName,
            new FormControl(this.applicationData.prevInsurance[form.valueType], validatorsArray),
          );
        });
      }
    });
  }

  createPolicyForm(indexOfPolicyForm) {
    const firstScreenData = this.screens.screens.find(
      (screen, index) => index === indexOfPolicyForm + 1,
    );
    const currentFormGroup = this.stepperFormGroups[indexOfPolicyForm + 1];
    // this.policyFormGroup = new FormGroup({});
    if (firstScreenData && firstScreenData.sections && firstScreenData.sections.length > 0) {
      firstScreenData.sections.forEach((section) => {
        section.formData.forEach((form) => {
          const validatorsArray = this.getValidatorsArray(form);
          currentFormGroup.addControl(
            form.controlName,
            new FormControl(this.applicationData[form.controlName], validatorsArray),
          );
        });
      });
    }
  }

  createMedicalForm(indexOfMedicalForm) {
    const currentFormGroup = this.stepperFormGroups[indexOfMedicalForm + 1];
    const currentScreen = this.screens.screens[indexOfMedicalForm + 1];
    if (this.insuredData.productType === 'GC' && this.insuredData.productId !== '158GL01V01') {
      this.insurersNames = [];
      this.insurersNames.push({
        id: 0,
        name:
          this.applicationData.primaryInsured.firstName +
          ' ' +
          this.applicationData.primaryInsured.lastName,
        gender: this.applicationData.primaryInsured.gender,
      });
      if (this.stepperFormGroups[0].get('coBorrower-loanDetails').value === 'Y') {
        this.insurersNames.push({
          id: 1,
          name:
            this.applicationData.secondaryInsured.firstName +
            ' ' +
            this.applicationData.secondaryInsured.lastName,
          gender: this.applicationData.secondaryInsured.gender,
        });
      }
    } else if (this.insuredDetails) {
      this.insurersNames = [];
      this.insuredDetails.forEach((insured) => {
        this.insurersNames.push({
          id: insured.memberId,
          name: insured.firstName + ' ' + insured.lastName,
          gender: insured.gender,
        });
      });
    }
    if (this.applicationData.answers.length === 0) {
      this.policyQuestions.forEach((question) => {
        this.applicationData.answers.push({
          questionId: question.questionId,
          answer: '',
          answerDetails: [],
        });
      });
    }
    this.applicationData.answers.forEach((answer) => {
      if (answer.answerDetails === undefined || answer.answerDetails.length === 0) {
        answer.answerDetails = [];
        this.insurersNames.forEach((insurerName) => {
          const answerStructure = {
            memberId: insurerName.id,
            answer: '',
            details: {},
          };
          // answerStructure.memberId = insurerName.id;
          currentScreen.sections.forEach((section) => {
            section.formData.forEach((question) => {
              // question.questionType = 'YESNOFORM';
              if (question.questionType === 'YESNOFORM') {
                // question.formData = MedicalQuestionFollowUpQuestions;
                question.formData.forEach((formElement) => {
                  Object.defineProperty(answerStructure.details, formElement.valueType, {
                    value: '',
                    writable: true,
                    enumerable: true,
                    configurable: true,
                  });
                });
                currentFormGroup.addControl(
                  `member-${insurerName.id}-question-${question.questionId}-allFilled`,
                  new FormControl(''),
                );
              } else if (question.questionType === 'YESNOPOPUP') {
                question.formData.forEach(() => {
                  answerStructure.details = [];
                });
                currentFormGroup.addControl(
                  `member-${insurerName.id}-question-${question.questionId}-allFilled`,
                  new FormControl(''),
                );
              } else if (question.questionType === 'YESNOTEXT') {
                Object.defineProperty(answerStructure.details, 'desc', {
                  value: '',
                  writable: true,
                  enumerable: true,
                  configurable: true,
                });
                currentFormGroup.addControl(
                  `member-${insurerName.id}-question-${question.questionId}`,
                  new FormControl('', Validators.required),
                );
              }
            });
            answer.answerDetails.push(answerStructure);
          });
        });
      }
    });
    this.insurersNames.forEach((insurerName) => {
      currentScreen.sections.forEach((section) => {
        section.formData.forEach((question) => {
          currentFormGroup.addControl(
            `member-${insurerName.id}-question-${question.questionId}-allFilled`,
            new FormControl(''),
          );
        });
      });
    });
    currentScreen.sections.forEach((section) => {
      section.formData.forEach((policyQuestion) => {
        const positiveAnswerForCurrentQuestion = policyQuestion.positiveAnswer.substring(0, 1);
        const currentQuestionAnswer = this.applicationData.answers.find(
          (answer) => answer.questionId === policyQuestion.questionId,
        );
        let fillingFirstTime = true;
        let foundPositive = false;
        // let foundNegative = true;

        currentQuestionAnswer.answerDetails.forEach((detail) => {
          if (detail.answer !== '') {
            fillingFirstTime = false;
            if (detail.answer !== positiveAnswerForCurrentQuestion) {
              // foundNegative = true;
              currentFormGroup.addControl(
                `${policyQuestion.questionId}`,
                new FormControl(detail.answer, [Validators.required]),
              );
            } else {
              foundPositive = true;
            }
          }
        });
        if (fillingFirstTime) {
          currentFormGroup.addControl(
            `${policyQuestion.questionId}`,
            new FormControl('', [Validators.required]),
          );
        } else if (foundPositive) {
          currentFormGroup.addControl(
            `${policyQuestion.questionId}`,
            new FormControl(positiveAnswerForCurrentQuestion, [Validators.required]),
          );
        }
      });
    });

    currentScreen.sections.forEach((section) => {
      section.formData.forEach((policyQuestion) => {
        if(policyQuestion.isFieldDependent){
            if(policyQuestion?.fieldVisibleIfParentValue?.findIndex(val=>val === currentFormGroup.get(policyQuestion.dependentControl)?.value) === -1){
                if(currentFormGroup.get(policyQuestion.code)){
                  currentFormGroup.removeControl(policyQuestion.code );
                } 
            }
        }
      });
    });
  }

  createInsuredForm(indexOfInsuredForm) {
    const currentFormGroup = this.stepperFormGroups[indexOfInsuredForm + 1];
    this.insuredDetails.forEach((insured, index) => {
      this.screens.screens[indexOfInsuredForm + 1].sections.forEach((section) => {
        if (
          !section.isDependent ||
          (section.isDependent &&
            section.sectionVisibleIfDependentValueIn.findIndex(
              (value) => value === currentFormGroup.get(section.dependsOnControl).value,
            ) > -1)
        ) {
          section.formData.forEach((form) => {
            const validatorsArray = this.getValidatorsArray(form);
            currentFormGroup.addControl(
              form.controlName + index,
              new FormControl(
                this.applicationData.insureds[index][form.valueType],
                validatorsArray,
              ),
            );
            if (form.controlType === 'seachableDropdown') {
              currentFormGroup.addControl('searchCtrl' + index, new FormControl(''));
            }
            if (currentFormGroup.get(form.controlName + index).valid && form.initiallyDisabled) {
              currentFormGroup.get(form.controlName + index).disable();
            }
          });
        }
      });
    });
  }

  createProposerForm(index) {
    const currentFormGroup = this.stepperFormGroups[index + 1];
    let proposerDetails;
    if (this.insuredDetails && this.insuredDetails.length > 0 && this.relationshipDropdown) {
      const selfRelationship = this.relationshipDropdown.find(
        (rel) => rel.value.toLowerCase().indexOf('self') > -1,
      );
      proposerDetails = this.insuredDetails.find(
        (insurer) => insurer.proposerRel === selfRelationship.id,
      );
    }
    this.proposerDetails = proposerDetails;
    if (proposerDetails) {
      this.isInsuredAlsoProposer = true;
      this.screens.screens[index + 1].sections.forEach((section) => {
        if (
          !section.isDependent ||
          (section.isDependent &&
            section.sectionVisibleIfDependentValueIn.findIndex(
              (value) => value === currentFormGroup.get(section.dependsOnControl).value,
            ) > -1)
        ) {
          section.formData.forEach((form) => {
            const validatorsArray = this.getValidatorsArray(form);
            if (form.key === 'proposer') {
              if (
                form.controlName.toLowerCase().indexOf('mobile') === -1 &&
                form.controlName.toLowerCase().indexOf('pan') === -1 &&
                form.controlName.toLowerCase().indexOf('email') === -1 &&
                proposerDetails[form.valueType] !== undefined &&
                proposerDetails[form.valueType] !== null
              ) {
                currentFormGroup.addControl(
                  form.controlName + '-' + form.key,
                  new FormControl(proposerDetails[form.valueType], validatorsArray),
                );
                this.applicationData[form.key][form.valueType] = proposerDetails[form.valueType];
              } else {
                currentFormGroup.addControl(
                  form.controlName + '-' + form.key,
                  new FormControl(this.applicationData[form.key][form.valueType], validatorsArray),
                );
              }
            } else {
              currentFormGroup.addControl(
                form.controlName + '-' + form.key,
                new FormControl(this.applicationData[form.key][form.valueType], validatorsArray),
              );
            }
            if (form.controlType === 'seachableDropdown') {
              currentFormGroup.addControl('searchCtrl', new FormControl(''));
            }
            if (
              currentFormGroup.get(form.controlName + '-' + form.key).valid &&
              form.initiallyDisabled
            ) {
              currentFormGroup.get(form.controlName + '-' + form.key).disable();
            }
            // if (form.subscribeChanges) {
            //   if (this.applicationData.hasOwnProperty(form.valDependentAppdata)) {
            //     const panReq =
            //       this.applicationData[form.valDependentAppdata] >= 50000 ? true : false;
            //     console.log('check', panReq);
            //     form.subscribeActions.forEach((reqPanCon) => {
            //       if (reqPanCon.currentControlValue === panReq) {
            //         const updatedValidators = this.getValidatorsArray(reqPanCon.updateControl);
            //         currentFormGroup
            //           .get(reqPanCon.updateControl.controlName)
            //           .setValidators(updatedValidators);
            //         currentFormGroup
            //           .get(reqPanCon.updateControl.controlName)
            //           .updateValueAndValidity();
            //         form.validators = reqPanCon.updateControl.validators;
            //       }
            //     });
            //   }
            // }
          });
        }
      });
    } else {
      this.screens.screens[index + 1].sections.forEach((section) => {
        if (
          !section.isDependent ||
          (section.isDependent &&
            section.sectionVisibleIfDependentValueIn.findIndex(
              (value) => value === currentFormGroup.get(section.dependsOnControl).value,
            ) > -1)
        ) {
          section.formData.forEach((form) => {
            const validatorsArray = this.getValidatorsArray(form);
            currentFormGroup.addControl(
              form.controlName + '-' + form.key,
              new FormControl(this.applicationData[form.key][form.valueType], validatorsArray),
            );
            if (form.controlType === 'seachableDropdown') {
              currentFormGroup.addControl('searchCtrl', new FormControl(''));
            }
            // currentFormGroup
            //   .addControl(form.controlName, new FormControl(this.applicationData[form.valueType], validatorsArray));
            if (
              form.controlName === 'proposerType-proposer' &&
              this.applicationData.proposer.isIndividual
            ) {
              currentFormGroup.get('proposerType-proposer').setValue('I');
            } else if (form.controlName === 'proposerType') {
              currentFormGroup.get('proposerType-proposer').setValue('C');
            }
            // if (form.subscribeChanges) {
            //   if (this.applicationData.hasOwnProperty(form.valDependentAppdata)) {
            //     const panReq =
            //       this.applicationData[form.valDependentAppdata] >= 50000 ? true : false;
            //     console.log('check', panReq);
            //     form.subscribeActions.forEach((reqPanCon) => {
            //       if (reqPanCon.currentControlValue === panReq) {
            //         const updatedValidators = this.getValidatorsArray(reqPanCon.updateControl);
            //         currentFormGroup
            //           .get(reqPanCon.updateControl.controlName)
            //           .setValidators(updatedValidators);
            //         currentFormGroup
            //           .get(reqPanCon.updateControl.controlName)
            //           .updateValueAndValidity();
            //         form.validators = reqPanCon.updateControl.validators;
            //       }
            //     });
            //   }
            // }
          });
        }
      });
    }
  }

  createContactInfoForm(index) {
    const postalcodeRegex = /^[1-9]{1}[0-9]{5,5}$/;
    const currentFormGroup = this.stepperFormGroups[index + 1];
    currentFormGroup.addControl(
      'addressSame',
      new FormControl(
        this.applicationData.addressSame ? 'yes' : 'no',
        Validators.required,
      ),
    );
    currentFormGroup.addControl(
      'policyaddressline1',
      new FormControl(this.applicationData.policyAddress.addressline1, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(40),
        Validators.pattern('^[a-zA-Z0-9- #.,/]*$'),
      ]),
    );
    currentFormGroup.addControl(
      'policyaddressline2',
      new FormControl(this.applicationData.policyAddress.addressline2, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(40),
        Validators.pattern('^[a-zA-Z0-9- #.,/]*$'),
      ]),
    );
    currentFormGroup.addControl(
      'policyaddressline3',
      new FormControl(this.applicationData.policyAddress.addressline3, [
        Validators.maxLength(40),
        Validators.pattern('^[a-zA-Z0-9- #.,/]*$'),
      ]),
    );
    if (this.insuredData.insurerCode == 134) {
      currentFormGroup.addControl('searchCtrl1', new FormControl(''));
    }
    if (postalcodeRegex.test(this.applicationData.policyAddress.postalcode)) {
      currentFormGroup.addControl(
        'policypostalcode',
        new FormControl(this.applicationData.policyAddress.postalcode?.trim(), [
          Validators.required,
          Validators.pattern(postalcodeRegex),
        ]),
      );
      if (this.insuredData.insurerCode == 134) {
        currentFormGroup.addControl(
          'policycity',
          new FormControl(this.applicationData.policyAddress.cityCode, Validators.required),
        );
        currentFormGroup.addControl(
          'policystate',
          new FormControl(this.applicationData.policyAddress.stateCode, Validators.required),
        );
      } else {
        currentFormGroup.addControl(
          'policycity',
          new FormControl(this.applicationData.policyAddress.city, Validators.required),
        );
        currentFormGroup.addControl(
          'policystate',
          new FormControl(this.applicationData.policyAddress.state, Validators.required),
        );
      }
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
        new FormControl(this.applicationData.mailingAddress.addressline1, [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(40),
          Validators.pattern('^[a-zA-Z0-9- #.,/]*$'),
        ]),
      );
      currentFormGroup.addControl(
        'mailaddressline2',
        new FormControl(this.applicationData.mailingAddress.addressline2, [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(40),
          Validators.pattern('^[a-zA-Z0-9- #.,/]*$'),
        ]),
      );
      currentFormGroup.addControl(
        'mailaddressline3',
        new FormControl(this.applicationData.mailingAddress.addressline3, [
          Validators.maxLength(40),
          Validators.pattern('^[a-zA-Z0-9- #.,/]*$'),
        ]),
      );
      currentFormGroup.addControl('searchCtrl2', new FormControl(''));
      if (postalcodeRegex.test(this.applicationData.mailingAddress.postalcode)) {
        currentFormGroup.addControl(
          'mailpostalcode',
          new FormControl(this.applicationData.mailingAddress.postalcode?.trim(), [
            Validators.required,
            Validators.pattern(postalcodeRegex),
          ]),
        );
        if (this.insuredData.insurerCode == 134) {
          currentFormGroup.addControl(
            'mailcity',
            new FormControl(this.applicationData.mailingAddress.cityCode, Validators.required),
          );
          currentFormGroup.addControl(
            'mailstate',
            new FormControl(this.applicationData.mailingAddress.stateCode, Validators.required),
          );
        } else {
          currentFormGroup.addControl(
            'mailcity',
            new FormControl(this.applicationData.mailingAddress.city, Validators.required),
          );
          currentFormGroup.addControl(
            'mailstate',
            new FormControl(this.applicationData.mailingAddress.state, Validators.required),
          );
        }
      } else {
        currentFormGroup.addControl(
          'mailpostalcode',
          new FormControl('', [Validators.required, Validators.pattern(postalcodeRegex)]),
        );
        currentFormGroup.addControl('mailcity', new FormControl('', Validators.required));
        currentFormGroup.addControl('mailstate', new FormControl('', Validators.required));
      }
      if (this.insuredData.insurerCode == 134) {
        currentFormGroup.addControl('searchCtrl2', new FormControl(''));
      }
    }
  }

  createSummaryForm(index) {
    this.displayedColumns = ['SlNo', 'Comments', 'Date'];
    const currentFormGroup = this.stepperFormGroups[index + 1];
    currentFormGroup.addControl('consent', new FormControl(null));
    if (
      this.customerToken !== null &&
      (this.insuredData['productId'] === '113HL01I01' ||
        this.insuredData['productId'] === '113HL01F01' || this.insuredData['productId'] === '130N092V01')
    ) {
      currentFormGroup.addControl('consentCheck', new FormControl(null, Validators.requiredTrue));
    }
  }

  getValidatorsArray(formData): any[] {
    const validatorsArray = [];
    Object.keys(formData.validators).forEach((validatorKey) => {
      if (validatorKey === 'required') {
        validatorsArray.push(Validators.required);
      } else if (validatorKey === 'minLength') {
        validatorsArray.push(Validators.minLength(formData.validators.minLength));
      } else if (validatorKey === 'maxLength') {
        validatorsArray.push(Validators.maxLength(formData.validators.maxLength));
      } else if (validatorKey === 'min') {
        validatorsArray.push(Validators.min(formData.validators.min));
      } else if (validatorKey === 'max') {
        validatorsArray.push(Validators.max(formData.validators.max));
      } else if (validatorKey === 'email' && formData.validators[validatorKey]) {
        validatorsArray.push(Validators.email);
      } else if (validatorKey === 'pattern') {
        validatorsArray.push(Validators.pattern(formData.validators.pattern));
      } else if (validatorKey === 'maxValue') {
        validatorsArray.push(maxvalueVal(formData.validators[validatorKey]));
      }
    });
    return validatorsArray;
  }

  checkBmi() {
    let flag = false;
    const message =
      'Regret, policy cannot be issued online as BMI is not matching the requirements. Please contact our nearest branch';
    this.insuredDetails.forEach((insured) => {
      const heightFeet = Number(insured.heightFeet);
      const heightInches = Number(insured.heightInches);
      const weight = Number(insured.weight);
      const dob = new Date(insured.dob);
      const timeDiff = Math.abs(Date.now() - dob.getTime());
      const age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
      if (age > 16) {
        const height = 2.54 * (heightFeet * 12 + heightInches);
        const bmi = (10000.0 * weight) / (height * height);
        if (bmi < 18 || bmi > 32) {
          flag = true;
        }
      }
    });

    return flag ? message : '';
  }

  checkMaritalStatus() {
    let message = '';
    this.insuredDetails.forEach((insured) => {
      if (this.insuredData.productType === 'FF') {
        if (
          (insured.proposerRel === '4' ||
            insured.proposerRel === '5' ||
            insured.proposerRel === '9' ||
            insured.proposerRel === '12') &&
          (insured.maritalStatus === 'M' || insured.maritalStatus === '1')
        ) {
          message = 'For Floater Policies marital status of children cannot be ‘married’.';
        } else if (
          insured.proposerRel !== '4' &&
          insured.proposerRel !== '5' &&
          insured.proposerRel !== '9' &&
          insured.proposerRel !== '12' &&
          (insured.maritalStatus === 'S' || insured.maritalStatus === '0')
        ) {
          message = 'For Floater Policies marital status of adults cannot be ‘single’.';
        }
      } else if (
        this.insuredData.productType === 'PA' ||
        this.insuredData.productType === 'LTS' ||
        this.insuredData.productType === 'AMT' ||
        this.insuredData.productType === 'STDN'
      ) {
        if (
          (insured.proposerRel === '4' ||
            insured.proposerRel === '5' ||
            insured.proposerRel === '9' ||
            insured.proposerRel === '12') &&
          (insured.maritalStatus === 'M' || insured.maritalStatus === '1')
        ) {
          message = 'For Floater Policies marital status of children cannot be ‘married’.';
        }
      }
    });
    return message;
  }

  checkMedicalAnswers(index) {
    let message = '';
    const currentScreen = this.screens.screens[index];
    currentScreen.sections.forEach((section) => {
      section.formData.forEach((question) => {
        if (question.restrictOnNegative) {
          const answerForCurrentQuestion = this.applicationData.answers.find(
            (answer) => answer.questionId === question.questionId,
          );
          if (
            answerForCurrentQuestion.answerDetails[0].answer !== question.positiveAnswer &&
            question.restrictOnNegative
          ) {
            // message = 'Regret, policy cannot be issued online. Please contact  our nearest branch';
            //this is for SIB Manipal C..
            let insurerName = ''
            if(this.insuredData.insurerCode === 103){
              insurerName = 'Reliance General Insurance';
            
            } else if (this.insuredData.insurerCode === 151){
              insurerName = 'Manipal Cigna health insurance';

            }
            message = `We can not proceed with this proposal as it has to be referred to  ${insurerName} team for further processing.`;
          }
        }
      });
    });
    return message;
  }

  checkTotalSum(screen, index) {
    let totalSum = 0;
    screen.tagToCHeck.forEach((tag) => {
      if (this.stepperFormGroups[index].get(tag)) {
        totalSum += +this.stepperFormGroups[index].get(tag).value;
      }
    });
    const message =
      'Please note, total Sum Assured for all building and covers cannot exceed 5 crores';
    return totalSum > screen.maxValueAllowed ? message : '';
  }

  checkTitleValidations(screen, index) {
    let flag = false;
    let message = '';
    const currentFormGroup = this.stepperFormGroups[index];
    if (screen.screenName === 'Insured' && !screen.isArray) {
      this.insuredDetails.forEach((insured, i) => {
        this.screens.screens[index].sections.forEach((section) => {
          const title = section.formData.find(
            (form) => form.masterValue === 'title' || form.masterValue === 'Title',
          );
          const relationship = section.formData.find(
            (form) => form.label.indexOf('Relationship') > -1,
          );
          const gender = section.formData.find((form) => form.label.indexOf('Gender') > -1);
          if (title && relationship && gender && !flag) {
            const genderValue = currentFormGroup.get(gender.controlName + i).value;
            const titleGender = title.options.find(
              (eachTitle) => eachTitle.id === currentFormGroup.get(title.controlName + i).value,
            ).gender;
            const relationshipGender = relationship.options.find(
              (eachRel) => eachRel.id === currentFormGroup.get(relationship.controlName + i).value,
            ).gender;
            if (
              (titleGender !== genderValue && titleGender !== 'B') ||
              (relationshipGender !== genderValue && relationshipGender !== 'B')
            ) {
              flag = true;
              message =
                'Title, Gender and Relationship are not matching. Please enter correct values';
            }
          }
        });
      });
    } else if (screen.screenName === 'Insured' && screen.isArray) {
      this.screens.screens[index].sections.forEach((section) => {
        const title = section.formData.find(
          (form) => form.masterValue === 'title' || form.masterValue === 'Title',
        );
        const relationship = section.formData.find(
          (form) => form.label.indexOf('Relationship') > -1,
        );
        const gender = section.formData.find((form) => form.label.indexOf('Gender') > -1);
        if (title && relationship && gender && !flag) {
          const genderValue = currentFormGroup.get(gender.controlName + '-' + gender.key).value;
          const titleGender = title.options.find(
            (eachTitle) =>
              eachTitle.id === currentFormGroup.get(title.controlName + '-' + title.key).value,
          ).gender;
          const relationshipGender = relationship.options.find(
            (eachRel) =>
              eachRel.id ===
              currentFormGroup.get(relationship.controlName + '-' + relationship.key).value,
          ).gender;
          if (
            (titleGender !== genderValue && titleGender !== 'B') ||
            (relationshipGender !== genderValue && relationshipGender !== 'B')
          ) {
            flag = true;
            message =
              'Title, Gender and Relationship are not matching. Please enter correct values';
          }
        }
      });
    } else if (
      (screen.screenName === 'Proposer' || screen.screenName === 'Basic Info About Proposer') &&
      screen.component !== 'genral'
    ) {
      let titleKey;
      let genderKey;
      let relationshipKey;
      let nomineeRelationship;
      let relationshipGender;
      this.screens.screens[index].sections.forEach((section) => {
        const title = section.formData.find((form) => {
          if (form.masterValue) {
            titleKey = form.key ? '-' + form.key : '';
            return form.masterValue === 'Title' || form.masterValue === 'title';
          }
        });
        const gender = section.formData.find((form) => {
          if (form.label) {
            genderKey = form.key ? '-' + form.key : '';
            return form.label.indexOf('Gender') > -1;
          }
        });
        if (section.sectionName === 'Nominee Details') {
          nomineeRelationship = section.formData.find((form) => {
            if (form.masterValue) {
              relationshipKey = form.key ? '-' + form.key : '';
              return form.masterValue === 'NomineeRelationship';
            }
          });
        }
        if (title && gender && !flag) {
          const genderValue = currentFormGroup.get(gender.controlName + genderKey).value;
          if (nomineeRelationship) {
            relationshipGender = nomineeRelationship.options.find(
              (eachRelationship) =>
                eachRelationship.id ===
                currentFormGroup.get(nomineeRelationship.controlName + relationshipKey).value,
            ).gender;
          }
          const titleGender = title.options.find(
            (eachTitle) =>
              eachTitle.id === currentFormGroup.get(title.controlName + titleKey).value,
          ).gender;
          if (relationshipGender) {
            if (
              titleGender === 'B' &&
              relationshipGender !== 'B' &&
              genderValue !== relationshipGender
            ) {
              flag = true;
              message =
                'Title, Gender and Relationship are not matching. Please enter correct values';
            } else if (
              relationshipGender === 'B' &&
              titleGender !== 'B' &&
              titleGender !== genderValue
            ) {
              flag = true;
              message =
                'Title, Gender and Relationship are not matching. Please enter correct values';
            } else if (
              relationshipGender !== 'B' &&
              titleGender !== 'B' &&
              (titleGender !== relationshipGender || titleGender !== genderValue)
            ) {
              flag = true;
              message =
                'Title, Gender and Relationship are not matching. Please enter correct values';
            } else {
              flag = false;
              message = '';
            }
          } else {
            if (titleGender === genderValue && titleGender !== 'B') {
              flag = false;
              message = '';
            } else if (titleGender !== genderValue && titleGender === 'B') {
              flag = false;
              message = '';
            } else {
              flag = true;
              message =
                'Title, Gender and Relationship are not matching. Please enter correct values';
            }
          }
        }
      });
    } else if (
      screen.screenName === 'Primary Insured' ||
      screen.screenName === 'Secondary Insured' ||
      screen.component === 'genral'
    ) {
      this.screens.screens[index].sections.forEach((section) => {
        let titleKey;
        let genderKey;
        let relationshipKey;
        let nomineeRelationship;
        let relationshipGender;
        let title = section.formData.find((form) => {
          if (form.masterValue) {
            titleKey = form.key ? '-' + form.key : '';
            return form.masterValue === 'Title';
          }
        });
        const gender = section.formData.find((form) => {
          if (form.label) {
            genderKey = form.key ? '-' + form.key : '';
            return form.label.indexOf('Gender') > -1;
          }
        });
        if (section.sectionName === 'Nominee Details') {
          title = section.formData.find((form) => {
            if (form.masterValue) {
              titleKey = form.key ? '-' + form.key : '';
              return form.masterValue === 'NomineeTitle';
            }
          });
          nomineeRelationship = section.formData.find((form) => {
            if (form.masterValue) {
              relationshipKey = form.key ? '-' + form.key : '';
              return form.masterValue === 'NomineeRelationship';
            }
          });
        }
        if (title && gender && !flag) {
          const genderValue = currentFormGroup.get(gender.controlName + genderKey).value;
          const titleGender = title.options.find(
            (eachTitle) =>
              eachTitle.id === currentFormGroup.get(title.controlName + titleKey).value,
          ).gender;
          if (nomineeRelationship) {
            relationshipGender = nomineeRelationship.options.find(
              (eachRelationship) =>
                eachRelationship.id ===
                currentFormGroup.get(nomineeRelationship.controlName + relationshipKey).value,
            ).gender;
          }
          if (relationshipGender) {
            if (
              titleGender === 'B' &&
              relationshipGender !== 'B' &&
              genderValue !== relationshipGender
            ) {
              flag = true;
              message =
                'Title, Gender and Relationship are not matching. Please enter correct values';
            } else if (
              relationshipGender === 'B' &&
              titleGender !== 'B' &&
              titleGender !== genderValue
            ) {
              flag = true;
              message =
                'Title, Gender and Relationship are not matching. Please enter correct values';
            } else if (
              relationshipGender !== 'B' &&
              titleGender !== 'B' &&
              (titleGender !== relationshipGender || titleGender !== genderValue)
            ) {
              flag = true;
              message =
                'Title, Gender and Relationship are not matching. Please enter correct values';
            } else {
              flag = false;
              message = '';
            }
          } else {
            if (titleGender === genderValue && titleGender !== 'B') {
              flag = false;
              message = '';
            } else if (titleGender !== genderValue && titleGender === 'B') {
              flag = false;
              message = '';
            } else {
              flag = true;
              message =
                'Title, Gender and Relationship are not matching. Please enter correct values';
            }
          }
        }
      });
    }
    return message;
  }

  checkEducationValidation(screen) {
    let flag = false;
    let message = '';
    if (screen.validations.checkEducationValidation.isArray) {
      const key = 'insureds';
      const searchItem = 'education';
      this.applicationData[key].forEach((keyItem) => {
        const result =
          screen.validations.checkEducationValidation.educationsNotAllowed.indexOf(
            keyItem[searchItem],
          ) > -1;
        if (!flag && result) {
          flag = true;
          message = 'Education not valid';
        }
      });
    }
    return flag ? message : '';
  }

  checkOccupationValidation(screen) {
    let flag = false;
    let message = '';
    if (screen.validations.checkOccupationValidation.isArray) {
      const key = 'insureds';
      const searchItem = 'occupation';
      this.applicationData[key].forEach((keyItem) => {
        const result =
          screen.validations.checkOccupationValidation.occupationsNotAllowed.indexOf(
            keyItem[searchItem],
          ) > -1;
        if (!flag && result) {
          flag = true;
          message = 'Occupation not valid';
        }
      });
    }
    return flag ? message : '';
  }

  sendLeadToInsurer() {
    this.loaderService.showSpinner(true);
    this.proposalservice.sendLeadToInsurer(this.insuredData.applicationNo).subscribe(
      (insurers) => {
        this.loaderService.showSpinner(false);
        this.sendLeadToInsurerData = insurers;
        if (insurers['isExternalNavigation']) {
          const mapForm = document.createElement('form');
          mapForm.method = 'POST';
          mapForm.target = '_blank';
          mapForm.action = insurers['url'];
          mapForm.style.display = 'none';
          if (insurers['payload'] && Object.keys(insurers['payload']).length > 0) {
            Object.keys(insurers['payload']).forEach((key) => {
              const mapInput = document.createElement('input');
              mapInput.type = 'hidden';
              mapInput.name = key;
              mapInput.value = insurers['payload'][key];
              mapForm.appendChild(mapInput);
            });
            // const srcInput = document.createElement('input');
            // srcInput.type = 'hidden';
            // srcInput.name = 'source';
            // srcInput.value = insurers['sourceType'];
            // mapForm.appendChild(srcInput);
            // const jwtInput = document.createElement('input');
            // jwtInput.type = 'hidden';
            // jwtInput.name = 'jwtToken';
            // jwtInput.value = insurers['secretKey'];
            // mapForm.appendChild(jwtInput);
            document.body.appendChild(mapForm);
            mapForm.submit();
          }
        }
      },
      () => {
        this.loaderService.showSpinner(false);
      },
    );
  }

  setIndex(event) {
    if (event.selectedIndex < event.previouslySelectedIndex) {
      this.stepperFormGroups.splice(event.selectedIndex + 1);
    }
    if (this.insuredData.statusCode < 4) {
      if (this.customerToken == null) {
        this.proposalservice.saveApplication(this.insuredData).subscribe(
          (res) => {
            this.insuredData = res;
            if (res['responseCode'] === 0) {
              if (
                this.screens.screens[event.selectedIndex].validations &&
                this.screens.screens[event.selectedIndex].validations.sendLeadToInsurer
              ) {
                this.sendLeadToInsurer();
              }
              const app = 'applicationData';
              this.applicationData = res[app];
              this.insuredDetails = res[app].insureds;
              if (this.insuredDetails) {
                this.insurersNames = [];
                this.insuredDetails.forEach((insured) => {
                  this.insurersNames.push({
                    id: insured.memberId,
                    name: insured.firstName + ' ' + insured.lastName,
                  });
                });
              }
              if (this.screens.screens.length !== event.selectedIndex + 1 && this.hasEditAccess) {
                this.isFormEditable = true;
              }
            } else {
              this.stepper?.previous();
              this.verticalStepper?.previous();
              const message = res['responseMessage'];
              this.dialog.open(PolicyErrorModalComponent, {
                data: message,
                panelClass: 'dialog-width',
              });
            }
          },
          (error) => {
            console.log('error', error);
            this.stepper?.previous();
            this.verticalStepper?.previous();
            const message = error['error'];
            this.dialog.open(PolicyErrorModalComponent, {
              data: message,
              panelClass: 'dialog-width',
            });
          },
        );
      } else {
        this.proposalservice.saveConsent(this.insuredData, this.customerToken).subscribe(
          (res) => {
            this.insuredData = res;
            const app = 'applicationData';
            this.applicationData = res[app];
            this.insuredDetails = res[app].insureds;
            if (this.insuredDetails) {
              this.insurersNames = [];
              this.insuredDetails.forEach((insured) => {
                this.insurersNames.push({
                  id: insured.memberId,
                  name: insured.firstName + ' ' + insured.lastName,
                });
              });
            }
            // if (this.screens.screens.length !== event.selectedIndex + 1) {
            //   this.isFormEditable = true;
            // }
          },
          (error) => {
            console.log('error', error);
            this.stepper?.previous();
            this.verticalStepper?.previous();
            const message = error['error'];
            this.dialog.open(PolicyErrorModalComponent, {
              data: message,
              panelClass: 'dialog-width',
            });
          },
        );
      }
    }
    if (
      this.insuredData.statusCode < 4 &&
      this.screens.screens.length === event.selectedIndex + 1 &&
      !this.hasEditAccess
    ) {
      this.isFormEditable = false;
    } else if (
      this.insuredData.statusCode < 4 &&
      this.screens.screens.length !== event.selectedIndex + 1 &&
      this.hasEditAccess
    ) {
      this.isFormEditable = true;
    }
  }

  initiatePayment(stepper: MatStepper) {
    let instrumentDate;
    let instrumentNo;
    let ifscCode;
    const paymentType = this.stepperFormGroups[this.paymentIndex].get('paymentType').value;
    if (paymentType !== 'DBT' || this.stepperFormGroups[this.paymentIndex].get('chkOrDDDate')) {
      const checkDate = new Date(
        this.stepperFormGroups[this.paymentIndex].get('chkOrDDDate').value,
      );
      instrumentDate =
        checkDate.getFullYear() +
        '-' +
        ('0' + (checkDate.getMonth() + 1)).slice(-2) +
        '-' +
        ('0' + checkDate.getDate()).slice(-2);
    }
    if (paymentType !== 'DBT' || this.stepperFormGroups[this.paymentIndex].get('chequeOrDDNo')) {
      instrumentNo = this.stepperFormGroups[this.paymentIndex].get('chequeOrDDNo').value;
    }
    if (paymentType !== 'DBT' || this.stepperFormGroups[this.paymentIndex].get('ifscCode')) {
      ifscCode = this.stepperFormGroups[this.paymentIndex].get('ifscCode').value;
    }
    const paymentBody = {
      paymentType,
      cifNo: paymentType === 'DBT' ? this.customerAccountDetails[0].cifNo : undefined,
      accountNo:
        paymentType === 'DBT'
          ? this.stepperFormGroups[this.paymentIndex].get('accountNumber').value
          : undefined,
      instrumentDate,
      instrumentNo,
      ifscCode,
      micrCode:
        paymentType !== 'DBT'
          ? this.stepperFormGroups[this.paymentIndex].get('micrCode').value
          : undefined,
      insurerId: this.insuredData.insurerCode,
      premiumPayable: this.insuredData.premiumAmount,
      appNo: this.insuredData.applicationNo,
    };
    console.log('paymentBody', paymentBody);
    this.loaderService.showSpinner(true);
    this.proposalservice.initiatePayment(paymentBody).subscribe(
      (data) => {
        this.loaderService.showSpinner(false);
        if (data['responseCode'] === 0) {
          if (this.insuredData.insurerCode === 512 && this.insuredData.orgCode === 'KB') {
            stepper.next()
          } else {
            this.sendForSPApproval(stepper);
          }
        } else {
          const message = data['responseMessage'];
          this.dialog.open(PolicyErrorModalComponent, {
            data: message,
            panelClass: 'dialog-width',
          });
        }
      },
      () => {
        this.loaderService.showSpinner(false);
      },
    );
  }

  sendForSPApproval(stepper) {
    this.loaderService.showSpinner(true);
    this.proposalservice.sendForSPApproval(this.applicationNo).subscribe(
      (data) => {
        this.loaderService.showSpinner(false);
        this.insuredData = data;
        const app = 'applicationData';
        this.applicationData = data[app];
        this.insuredDetails = data[app].insureds;
        stepper.next();
      },
      () => {
        this.loaderService.showSpinner(false);
      },
    );
  }

  navigateToEditScreen(stepper: MatStepper, screenIndex) {
    if (this.insuredData.statusCode < 4) {
      this.isFormEditable = true;
    }
    stepper.selectedIndex = screenIndex;
  }

  onSubmitClicked() {
    if (this.insuredData.status !== 'INFORCE') {
      this.loaderService.showSpinner(true);
      if (this.customerToken == null) {
        this.proposalservice.submitApplication(this.insuredData).subscribe(
          (data: any) => {
            if (data.hasOwnProperty('responseCode')) {
              this.showSubmitErrorMessage = true;
              this.submitErrorMessage = data.responseMessage;
              this.loaderService.showSpinner(false);
            } else {
              this.getApplicationCheckResponse(data, this.customerToken);
            }
          },
          () => {
            this.showSubmitErrorMessage = true;
            this.submitErrorMessage = 'Error while submitting the form. Please try after sometime.';
            this.loaderService.showSpinner(false);
          },
        );
      } else {
        this.proposalservice.submitConsent(this.insuredData, this.customerToken).subscribe(
          (data: any) => {
            this.getApplicationCheckResponse(data, this.customerToken);
          },
          () => {
            this.showSubmitErrorMessage = true;
            this.submitErrorMessage = 'Error while submitting the form. Please try after sometime.';
            this.loaderService.showSpinner(false);
          },
        );
      }
    } else {
      const message = 'Policy has already been issued for this application.';
      const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
        data: message,
        panelClass: 'dialog-width',
      });
      dialogRef.afterClosed().subscribe(() => {
        // navigate
      });
    }
  }

  getApplicationCheckResponse(data, token) {
    this.checkProposalResponseApiSubscription = this.proposalservice
      .checkProposalResponses(data.appNo, token)
      .subscribe(
        (res) => {
          // console.log('response==',res,res['payload']['amount']);
          let amount;
            let currency;
            let receipt;
        if(this.insuredData.orgCode === 'SIB' && this.insuredData.insurerCode == 151){ 
          let newArrKey = [];
          Object.keys(res['payLoad'])?.forEach((key) => {
            console.log('newone',res['payLoad'][key],key);
            newArrKey.push({id:key,value:res['payLoad'][key]})
          });
          newArrKey.forEach(arr=>{
            if(arr.id == 'amount'){
              amount = arr.value;
            }
            if(arr.id == 'receipt'){
              receipt = arr.value;
            }
            if(arr.id == 'currency'){
              currency = arr.value;
            }
          });
        }
          // console.log('typecast-->',newArrKey);
          this.loaderService.showSpinner(false);
          if (
            res.hasOwnProperty('errorDescription') &&
            res.errorDescription === 'Premium Mismatch'
          ) {
            this.checkProposalResponseApiSubscription.unsubscribe();
            this.openPremiumMismatchDialog(res);
          } else if (
            res.hasOwnProperty('errorDescription') &&
            res.errorDescription !== 'Premium Mismatch'
          ) {
            this.checkProposalResponseApiSubscription.unsubscribe();
            this.showSubmitErrorMessage = true;
            this.submitErrorMessage = res.errorDescription;
          } else if (res.otpRequired === true) {
            this.checkProposalResponseApiSubscription.unsubscribe();
            const dialogRef = this.dialog.open(OtpModalComponent, {
              data: {
                appNo: this.insuredData.applicationNo,
              },
              panelClass: 'dialog-width',
            });
            dialogRef.afterClosed().subscribe((result) => {
              if (result === true) {
                this.showOtpError = false;
                if (this.customerToken !== null) {
                  const dialogRefPaymentOption = this.dialog.open(PaymentOptionModalComponent, {
                    data: {
                      productId: this.insuredData.productId,
                      paymentLink: this.insuredData.applicationData.paymentLink,
                    },
                    panelClass: 'dialog-width',
                  });
                  dialogRefPaymentOption.afterClosed().subscribe((btn) => {
                    // console.log('response==',res,res['payload']['amount']);
                    if (btn === 'Online') {
                      if(this.insuredData.orgCode === 'SIB' && this.insuredData.insurerCode == 151){
                        this.razorpayPg(amount,receipt,currency);
                      } else if(this.insuredData.orgCode === 'CSB' && this.insuredData.insurerCode == 103){
                      this.redirectToPaymentGateway(res);
                      }
                    } else if (btn === 'Bank') {
                      if (res.statusCode === 7) {
                        // const message =
                        //   'Please Provide appropriate Authorization to the Bank to debit your account for Premium Payment';
                        // const dialogRefMessage = this.dialog.open(
                        //   PolicyErrorModalComponent,
                        //   {
                        //     data: message,
                        //     panelClass: 'dialog-width',
                        //   }
                        // );
                        const messageStatus =
                          'Please sign the debit Authorization form to allow deduction from your bank account';
                        this.router.navigate(
                          [
                            '/Confirmation',
                            this.insuredData.insurerCode,
                            this.insuredData.applicationNo,
                          ],
                          {
                            queryParams: {
                              messageStatus,
                            },
                          },
                        );
                      } else if (res.statusCode === 4) {
                        const messageStatus =
                          'Your application has been send for Underwriting, Please download and sign the proposal form.';
                        this.router.navigate(
                          [
                            '/Confirmation',
                            this.insuredData.insurerCode,
                            this.insuredData.applicationNo,
                          ],
                          {
                            queryParams: {
                              messageStatus,
                            },
                          },
                        );
                      }
                      const message =
                        'Please sign the debit Authorization form to allow deduction from your bank account';
                      this.router.navigate(
                        [
                          '/Confirmation',
                          this.insuredData.insurerCode,
                          this.insuredData.applicationNo,
                        ],
                        {
                          queryParams: {
                            message,
                          },
                        },
                      );
                      // const dialogRefMessage = this.dialog.open(
                      //   PolicyErrorModalComponent,
                      //   {
                      //     data: message,
                      //     panelClass: 'dialog-width',
                      //   }
                      // );
                    }
                  });
                } else {
                  this.redirectToPaymentGateway(res);
                }
              } else {
                this.showOtpError = true;
              }
            });
          } else if (!res.isPGNavigation && res.url.length > 0) {
            this.checkProposalResponseApiSubscription.unsubscribe();
            let message = '';
            if (
              this.insuredData.productId === '122N116V01' &&
              this.applicationData.physicalSignature === 'Y'
            ) {
              if (res.statusCode < 2) {
                message = 'The Proposal has been sent to Customer for Review and Payment';
              }
              if (res.statusCode === 2) {
                message = 'Proposal has been sent for SP Approval';
              }
              if (res.statusCode === 3) {
                message = 'The Proposal has been sent to Customer for Review and Payment';
              }
              if (res.statusCode === 4) {
                message =
                  'Your application has been sent for Underwriting, Please download the proposal form and get it signed by the customer. Please retain the original with you for audit purposes and send a copy of the signed Proposal Form to <br>Aviva Life Insurance Company India Ltd.<br> 401A,4th Floor, Block A, DLF Cyber Park,<br>Sector-20, NH-8, Gurugram Haryana-122008.';
              }
              if (res.statusCode === 5 || res.statusCode === 6) {
                message =
                  'Your application has been send for Underwriting, Please download and sign the proposal form.';
              } else if (res.statusCode >= 7) {
                message =
                  'Please download the proposal form and get it signed by the customer. Please retain the original with you for audit purposes and send a copy of the signed Proposal Form to <br>Aviva Life Insurance Company India Ltd.<br> 401A,4th Floor, Block A, DLF Cyber Park,<br>Sector-20, NH-8, Gurugram Haryana-122008.';
              }
            } else if (res.statusCode === 2) {
              message = 'Proposal has been sent for SP Approval';
            } else if (res.statusCode === 7) {
              message = 'The proposal has been submitted, please collect payment';
            } else {
              message = 'The Proposal has been sent to Customer for Review and Payment';
            }
            const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
              data: message,
              panelClass: 'dialog-width',
            });
            dialogRef.afterClosed().subscribe(() => {
              this.router.navigateByUrl(res.url);
            });
          } else if (res.transactionId && res.transactionId.length > 0) {
            this.checkProposalResponseApiSubscription.unsubscribe();
            this.showOtpError = false;
            this.loaderService.showSpinner(false);
            this.redirectToPaymentGateway(res);
          } else if (res.status === 'failure') {
            this.checkProposalResponseApiSubscription.unsubscribe();
            this.showSubmitErrorMessage = true;
            this.submitErrorMessage = res.message;
            this.showOtpError = false;
            this.loaderService.showSpinner(false);
          }
        },
        () => {
          this.loaderService.showSpinner(false);
          this.checkProposalResponseApiSubscription.unsubscribe();
          this.showSubmitErrorMessage = true;
          this.submitErrorMessage = 'Error while submitting the form. Please try after sometime.';
        },
      );
  }

    razorpayPg(amount,receipt,currency){
     console.log('aaaa',amount,receipt);
      let payload = {
        amount : amount,
        currency:currency,
        receipt:receipt,
      };
      this.proposalservice.createRazorPayOrder(payload).subscribe(res=>{
        console.log('res-->',res);
        if(res['id']){
          this.razorCheckout(res);
        }
      });
    }

    razorCheckout(res){
      let insurerId = '151'
    let options = {
      key: 'rzp_test_iTmF6soqNfL0q6', 
      amount: res['amount'], 
      currency: res['currency'],
      name: 'Banca',
      description: 'Test Transaction',
      image: '',
      order_id: res.id, 
      callback_url:`https://dev.bancaedge.com/razorPgCallback/${insurerId}/${this.insuredData.applicationNo}`,
      prefill: {
          name: '',//Customer name 
          email:' gaurav.kumar@example.com',//Customer mail
          contact: ''//Customer mobile
      },
      notes: {
          address: 'Razorpay Corporate Office',
           agentId: '',
           applicationNo:'' 
      },
      theme: {
          color: '#c4161c'
      }
  };
  let rzp1 = new Razorpay(options);
   let rzpayOPen = function(){
      rzp1.open();
      rzp1.preventDefault();
     };
     rzpayOPen();
    }
  openPremiumMismatchDialog(res) {
    const dialogRef = this.dialog.open(MismatchDialogComponent, {
      data: {
        oldPremium: res.oldPremium,
        newPremium: res.newPremium,
        message: res.errorMessage ? res.errorMessage : res.errorDescription,
      },
      panelClass: 'dialog-width',
    });
    dialogRef.afterClosed().subscribe((response) => {
      if (response === 'yes') {
        this.insuredData.premiumAmount = res.newPremium;
        this.onSubmitClicked();
      }
    });
  }

  openErrorDisplayModal(message) {
    const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
      data: message,
      panelClass: 'dialog-width',
    });
    dialogRef.afterClosed().subscribe(() => {
      // navigate
    });
  }
  openErrorDisplayModalNew(message) {
    const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
      data: message,
      panelClass: 'dialog-width',
    });
    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(
        [
          '/policyvault',
         
        ]);
    });
  }

  redirectToPaymentGateway(response) {
    const mapForm = document.createElement('form');
    mapForm.method = 'POST';
    
    // mapForm.target = '_blank';
    mapForm.action = response.url;
    
    mapForm.style.display = 'none';
    if (response.payLoad && Object.keys(response.payLoad).length > 0) {
      const header = 
      response.payload = response.payload.filter(ele =>{
        ele !== 'keyId' || ele !== 'keySecrete'
      });
      Object.keys(response.payLoad).forEach((key) => {
        const mapInput = document.createElement('input');
        mapInput.type = 'hidden';
        mapInput.name = key;
        mapInput.value = response.payLoad[key];
  
        mapForm.appendChild(mapInput);
      });
    }
    document.body.appendChild(mapForm);

    mapForm.submit();
  }

  openConsentForm(index) {
    const currentFormGroup = this.stepperFormGroups[index];
    const dialogRef = this.dialog.open(ConsentModalComponent, {
      data: {
        insurerCode: this.insuredData.insurerCode,
        form: currentFormGroup,
      },
      panelClass: 'myapp-no-padding-dialog',
    });
    dialogRef.afterClosed().subscribe((data) => {
      currentFormGroup.get('consent').setValue(data);
    });
  }

  generateQRCode() {
    this.loaderService.showSpinner(true);
    this.proposalservice.generateQRCode(this.insuredData.applicationNo).subscribe(
      (result) => {
        this.loaderService.showSpinner(false);
        this.qrCodeError = false;
        this.dialog.open(QrCodeModalComponent, {
          data: result,
          panelClass: 'dialog-width',
        });
      },
      () => {
        this.loaderService.showSpinner(false);
        this.qrCodeError = true;
      },
    );
  }

  onRecalculatePremiumClicked(event) {
    if (event) {
      this.loaderService.showSpinner(true);
      this.proposalservice.recalculatePremium(this.insuredData).subscribe(
        (data) => {
          this.loaderService.showSpinner(false);
          const app = 'applicationData';
          const responseCode = 'responseCode';
          if (data[responseCode] === 0) {
            this.errorFromCovers = false;
            this.insuredData = data;
            this.applicationData = data[app];
          } else {
            this.errorFromCovers = true;
            const responseMessage = 'responseMessage';
            const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
              data: data[responseMessage],
              panelClass: 'dialog-width',
            });
            dialogRef.afterClosed().subscribe(() => {
              if (this.stepper) {
                if (data[responseCode] === 400) {
                  return null;
                } else {
                  this.stepper.previous();
                }
              } else if (this.verticalStepper) {
                if (data[responseCode] === 400) {
                  return null;
                } else {
                  this.verticalStepper.previous();
                }
              }
            });
          }
        },
        () => {
          this.loaderService.showSpinner(false);
        },
      );
    }
  }
}
