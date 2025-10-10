import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslatePipe, TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { MatStepper } from '@angular/material/stepper';
import { OfflinePoliciesService } from '@app/offline-policies/services/offline-policies.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { User } from '@app/_models';
import { AccountService } from '@app/_services';
import { LoaderService } from '@app/_services/loader.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ViewChild } from '@angular/core';
// import { CustomValidators } from '../../../_helpers/CustomValidators';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MY_FORMATS } from '../../../shared/utils/moment';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';
import { PolicyErrorModal2Component } from '@app/offline-policies/components/policy-error-modal/policy-error-modal.component';
import { ConsentModalComponent } from '@app/proposal/components/consent-modal/consent-modal.component';
import { MustMatch } from '@app/_helpers/must-match.validator';

@Component({
  selector: 'app-new-application',
  templateUrl: './new-application.component.html',
  styleUrls: ['./new-application.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class NewApplicationComponent implements OnInit {
  isInsuredAlsoProposer = false;
  isFormEditable = true;
  productId;
  customerId;
  customerDetails;
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
  insuredData;
  currentDate;
  applicationNo: string;
  showSubmitErrorMessage = false;
  submitErrorMessage = '';
  showOtpError = false;
  errorLoadingApplicationDetails = true;
  errorMessage = '';
  smallScreen;
  currentUser: User;
  isBranchUser = false;
  customerAccountDetails;
  paymentIndex: number;
  qrCodeError = false;
  masterCount = 0;
  formType = 'Long';
  customerToken;
  orgCode;
  checkProposalResponseApiSubscription: Subscription;
  public validationMessages = {};
  maxAdultDate: Date;
  insurerDropdown;
  productDropdown;
  spDropdown;
  selectedInsurerId;
  showProposer = false;
  showContactInfo = false;
  showSummary = false;
  quoteData;
  // lobDropdown;
  // productTypeDropdown;
  productKey;
  appNo;
  remainingField = false;
  // stepperFormGroups: FormGroup[] = [];
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  summaryFormGroup: FormGroup;
  paymentForm: FormGroup;
  // hi = 'Hiiiii';
  maritalStatusDropdown;
  momineeRelationshipDropdown;
  occupationDropdown;
  genderDropdown = [
    { id: 'M', value: 'Male' },
    { id: 'F', value: 'Female' },
  ];

  modeDropdown = [
    // { id: 0, value: 'Single' },
    { id: 1, value: 'Annual' },
    { id: 2, value: 'Half Yearly' },
    { id: 4, value: 'Quaterly' },
    { id: 12, value: 'Monthly' },
  ];

  statusDropDown = [
    { id: 1, value: 'LEAD' },
    { id: 2, value: 'LOGGED IN' },
    { id: 3, value: 'REJECTED BY CUSTOMER' },
    { id: 4, value: 'UW PENDING' },
    { id: 9, value: 'ISSUED/IN FORCE' },
    { id: 11, value: 'FOLLOW UP' },
    { id: 6, value: 'DECLINED/POSTPONED' },
    { id: 12, value: 'AWAITING DOCUMENTATION' },
  ];

  titleArray;
  maritalStatusArray;
  checkPaymentType = true;
  lgDropDown;
  lgName;

  insuranceProducts = [
    {
      name: 'Child Education',
      score: 0,
      lob: 'Life',
      productType: 'ENDW',
      value: 'childEducation',
      img: '../../../assets/images/Child_Education_ICON_og.svg',
    },
    {
      name: 'Critical Illness',
      score: 0,
      lob: 'Health',
      productType: 'CI',
      value: 'ci',
      img: '../../../assets/images/Critical_illness_ICON.svg',
    },
    {
      name: 'Cyber Theft',
      score: 0,
      lob: '',
      productType: '',
      value: 'cyber',
      img: '../../../assets/images/anon-hacker-behind-pc.svg',
    },
    {
      name: 'Health Insurance Individual',
      score: 0,
      lob: 'Health',
      productType: 'INDV',
      value: 'health',
      img: '../../../assets/images/Health_Hospi_ICON.svg',
    },
    {
      name: 'Health Insurance Family Floater',
      score: 0,
      lob: 'Health',
      productType: 'FF',
      value: 'health',
      img: '../../../assets/images/Health_Hospi_ICON.svg',
    },
    {
      name: 'Home Insurance',
      score: 0,
      lob: 'Fire',
      productType: 'Home',
      value: 'home',
      img: '../../../assets/images/Home_Insurance_ICON.svg',
    },
    {
      name: 'Fire Insurance',
      score: 0,
      lob: 'Fire',
      productType: 'SFSP',
      value: 'sme',
      img: '../../../assets/icons/quick-quote/standard_fire_special_perils.svg',
    },
    {
      name: 'Regular Income',
      score: 0,
      lob: '',
      productType: '',
      value: 'income',
      img: '../../../assets/images/Regular_Income_ICON.svg',
    },
    {
      name: 'Protection',
      score: 0,
      lob: 'Life',
      productType: 'Term',
      value: 'protection',
      img: '../../../assets/images/Protection_ICON.svg',
    },
    {
      name: 'Saving Traditional',
      score: 0,
      lob: 'Life',
      productType: 'ENDW',
      value: 'savings',
      img: '../../../assets/images/Savings Traditional_ICON.svg',
    },
    {
      name: 'Saving Unit Linked',
      score: 0,
      lob: 'Life',
      productType: 'Ulip',
      value: 'ulip',
      img: '../../../assets/images/Saving_Unit_Linked_ICON_og.svg',
    },
    {
      name: 'Personal Accident',
      score: 0,
      lob: 'Health',
      productType: 'PA',
      value: 'pa',
      img: '../../../assets/icons/quick-quote/personal_accident.svg',
    },
    {
      name: 'Motor Insurance',
      score: 0,
      lob: 'Motor',
      productType: 'PC',
      value: 'car',
      img: '../../../assets/images/Car_Insurance_ICON_og.svg',
    },
    {
      name: 'Two Wheeler',
      score: 0,
      lob: 'Motor',
      productType: 'TW',
      value: '2w',
      img: '../../../assets/icons/quick-quote/two_wheeler.svg',
    },
    {
      name: 'Travel',
      score: 0,
      lob: 'Travel',
      productType: 'Travel',
      value: 'travel',
      img: '../../../assets/icons/quick-quote/travel.svg',
    },
    {
      name: 'Offline Policies',
      score: 0,
      lob: '',
      productType: '',
      value: 'offline',
      img: '../../../assets/icons/quick-quote/offline_policies.svg',
    },
  ];
  paymentTypes = [
    { id: 'DBT', value: 'Direct Debit' },
    { id: 'CHQ', value: 'Cheque' },
    { id: 'DD', value: 'Demand Draft' },
  ];
  insuranceProductsCopy;
  lob;
  productType;
  productName;
  insurerId;
  insurerName;
  country;
  countryCode;
  lobProductDisplay;
  isIssued;
  uwStatus;
  past: Date;
  currentAndFutureday: Date;
  minEndDate: Date;
  showPaymentInfo = false;
  allApiLoaded: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  allApiLoadedSubscription: Subscription;
  accountDetails;
  threeMonthsBack: Date;
  todaysDate: Date;
  optionalField = true;
  isInsurerUser;
  statusCheckOnChange = false;
  // Endowment: 4.5%
  // ULIP: 0%
  // Rest : 18%
  policyState;
  mailingState;
  loggedIn = false;

  @ViewChild('stepper', { static: false }) myStepper: MatStepper;
  constructor(
    public dialog: MatDialog,
    public offlinePoliciesService: OfflinePoliciesService,
    private translateService: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private accountService: AccountService,
    private loaderService: LoaderService,
  ) {
    breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).subscribe((result) => {
      this.smallScreen = result.matches;
    });

    this.validationMessages = this.getValidationMsg();
    translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.validationMessages = this.getValidationMsg();
    });
  }

  ngOnInit() {
    this.currentDate = moment().format('YYYY-MM-DD');
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDate();
    this.todaysDate = new Date(currentYear, currentMonth, currentDay);
    console.log(this.currentDate);
    console.log(this.todaysDate);
    this.threeMonthsBack = new Date(currentYear, currentMonth - 3, currentDay);
    console.log(this.todaysDate);
    this.maxAdultDate = new Date(currentYear - 18, currentMonth, currentDay);
    this.past = new Date(currentYear - 5, currentMonth, currentDay);
    this.currentAndFutureday = new Date(currentYear + 5, currentMonth, currentDay);
    this.minEndDate = new Date(currentYear + 15, currentMonth, currentDay);
    this.loaderService.showSpinner(false);
    this.route.params.subscribe((params) => {
      console.log(params);
      if (params.customerId) {
        this.customerId = params.customerId;
      } else {
        this.customerId = null;
      }

      if (params.appNo) {
        this.appNo = params.appNo;
        this.getOfflineApplicationByAppNo();
      } else {
        this.appNo = null;
      }

      if (params.lob) {
        this.lob = params.lob;
      } else {
        this.lob = null;
      }

      if (params.productType) {
        this.productType = params.productType;
        this.getProducts();
      } else {
        this.productType = null;
      }

      if (params.productId) {
        this.productId = params.productId;
      } else {
        this.productId = null;
      }

      this.currentUser = this.accountService.userValue;
      this.isBranchUser =
        this.currentUser['bankCustomer'] === false && this.currentUser['insurerUser'] === false;
      this.customerId = params.customerId;
      this.isInsurerUser = this.currentUser['insurerUser'];
      this.loaderService.showSpinner(false);

      if (this.isBranchUser && this.appNo == null) {
        this.offlinePoliciesService.getCustomerById(this.customerId).subscribe((result) => {
          this.customerDetails = result;
          this.country = this.customerDetails?.addressList[0].country;
          this.countryCode = this.customerDetails?.addressList[0].countryCode;
          this.offlinePoliciesService.getOfflineInsurers().subscribe((result2) => {
            console.log('Printing Offline Insurers', result2);
            this.insurerDropdown = result2;
            this.getLOBAndProductType();
            this.getLGData();
            console.log('Printing CustomerDetails', this.customerDetails);
          });
        });
      }
    });
  }

  getOfflineApplicationByAppNo() {
    this.offlinePoliciesService.getOfflineApplicationByAppNo(this.appNo).subscribe((result) => {
      this.applicationData = result;
      this.offlinePoliciesService.getOfflineInsurers().subscribe((insurer) => {
        console.log('Printing INSURERS', insurer);
        this.insurerDropdown = insurer;
        this.offlinePoliciesService.getOfflinePlans().subscribe((data) => {
          this.loaderService.showSpinner(false);
          this.insuranceProductsCopy = data;
        });
        this.getProducts();
        this.getLGData();
        this.lob = this.applicationData?.lob;
        this.productType = this.applicationData?.productType;
        this.insurerId = this.applicationData?.insurerId;
        this.insurerName = this.applicationData?.insurerName;
        this.productName = this.applicationData?.productName;
        this.offlinePoliciesService.getSpDetailsForUser().subscribe((result2) => {
          this.spDropdown = result2;
          this.createPolicyForm();
          if (
            this.applicationData?.statusCode === 2 ||
            this.applicationData?.statusCode === 4 ||
            this.applicationData?.statusCode === 11 ||
            this.applicationData?.statusCode === 12
          ) {
            this.optionalField = false;
            this.createRemainingFormControl();
            this.remainingField = true;
          }
          this.fetchMasters(this.applicationData?.productId);
          if (
            this.applicationData?.statusCode === 3 ||
            this.applicationData?.statusCode === 6 ||
            this.applicationData?.statusCode === 9
          ) {
            this.loaderService.showSpinner(true);
            this.offlinePoliciesService
              .getCityAndState(this.applicationData?.applicationData.policyAddress.postalcode)
              .subscribe((result3) => {
                this.policyState = result3.stateName;
              });
            this.offlinePoliciesService
              .getCityAndState(this.applicationData?.applicationData.mailingAddress.postalcode)
              .subscribe((result4) => {
                this.mailingState = result4.stateName;
                this.optionalField = false;
                this.createRemainingFormControl();
                this.remainingField = true;
                setTimeout(() => {
                  const screen = this.applicationData?.statusCode === 9 ? 4 : 3;
                  for (let i = 0; i <= screen; i++) {
                    this.goToNextScreen(this.myStepper, i);
                  }
                }, 100);
              });
          }
          this.getAccountDetails();
          this.errorLoadingApplicationDetails = false;
        });
      });
    });
  }

  getAccountDetails() {
    this.offlinePoliciesService.getAccountDetails(this.applicationData?.bankCustomerId).subscribe(
      (data) => {
        this.loaderService.showSpinner(false);
        console.log('the account details', data);
        this.accountDetails = data;
      },
      (error) => {
        this.loaderService.showSpinner(false);
        this.accountDetails = [];
      },
    );
  }

  getLGData() {
    const request = {
      organizationCode: this.appNo
        ? this.applicationData?.orgCode
        : this.currentUser['organizationCode'],
      branchCode: this.appNo ? this.applicationData?.branchCode : this.currentUser['branchCode'],
    };
    this.offlinePoliciesService.getLGData(request).subscribe(
      (data) => {
        this.loaderService.showSpinner(false);
        this.lgDropDown = data;
      },
      (error) => {
        this.loaderService.showSpinner(false);
        this.lgDropDown = [];
      },
    );
  }

  onLGChange(event) {
    console.log(event.value);
    this.lgDropDown.forEach((item) => {
      if (item.id === event.value) {
        this.lgName = item.value;
      }
    });
  }

  getLOBAndProductType() {
    this.offlinePoliciesService.getOfflinePlans().subscribe(
      (data) => {
        this.loaderService.showSpinner(false);
        this.insuranceProductsCopy = data;

        this.offlinePoliciesService.getSpDetailsForUser().subscribe((result) => {
          this.spDropdown = result;
          this.createPolicyForm();
          console.log(this.lob);
          console.log(this.productType);
          console.log(this.productId);
          if (this.lob !== null && this.productType !== null) {
            this.firstFormGroup.get('product').disable();
          }
          this.errorLoadingApplicationDetails = false;
        });
      },
      (error) => {
        this.loaderService.showSpinner(false);
      },
    );
  }

  makeInputDisable2() {
    if (this.appNo) {
      if (this.applicationData?.statusCode === 1) {
        if (this.isInsurerUser) {
          return false;
        }
        return true;
      }
      return false;
    }
  }

  makeInputDisable() {
    if (this.appNo) {
      if (this.applicationData?.statusCode === 1) {
        return true;
      }
      return false;
    }
  }

  onStatusChange(event) {
    if (event.value !== '') {
      if (event.value !== 1) {
        this.showInputByStatus(event.value);
        this.remainingField = true;
        this.optionalField = false;
      } else {
        this.loggedIn = false;
        this.optionalField = true;
        this.showPaymentInfo = false;
        this.remainingField = false;
        this.firstFormGroup.removeControl('insurerApplicationNo');
        this.firstFormGroup.removeControl('policyNo');
        this.firstFormGroup.removeControl('policyStartDate');
        this.firstFormGroup.removeControl('policyEndDate');
        this.firstFormGroup.removeControl('confirmpt');
        this.firstFormGroup.removeControl('confirmppt');
        this.firstFormGroup.removeControl('confirmpremiumAmount');
        console.log('in initiated', this.statusCheckOnChange);
        if (this.statusCheckOnChange) {
          this.firstFormGroup.removeControl('pt');
          this.firstFormGroup.removeControl('ppt');
          this.firstFormGroup.removeControl('mode');
          this.firstFormGroup.removeControl('premiumAmount');
          this.firstFormGroup.removeControl('basePremium');
          this.firstFormGroup.removeControl('gst');
          this.firstFormGroup.addControl(
            'pt',
            new FormControl(this.applicationData?.pt === 0 ? null : this.applicationData?.pt, [
              Validators.pattern('^[1-9]\\d*$'),
              Validators.min(1),
              Validators.max(99),
            ]),
          );
          this.firstFormGroup.addControl(
            'ppt',
            new FormControl(
              this.applicationData?.ppt === 0
                ? this.applicationData?.lob !== 'Life'
                  ? 1
                  : null
                : this.applicationData?.ppt,
              [
                Validators.pattern('^[1-9]\\d*$'),
                Validators.min(1),
                Validators.max(
                  this.firstFormGroup?.get('pt').value ? this.firstFormGroup?.get('pt').value : 99,
                ),
              ],
            ),
          );
          this.firstFormGroup.addControl(
            'mode',
            new FormControl(this.applicationData?.mode === 0 ? null : this.applicationData?.mode),
          );
          this.firstFormGroup.addControl(
            'premiumAmount',
            new FormControl(
              this.applicationData?.premiumAmount === 0
                ? null
                : this.applicationData?.premiumAmount,
              [Validators.pattern('^[1-9]\\d*(.\\d{1,2})?$')],
            ),
          );
          this.firstFormGroup.addControl(
            'basePremium',
            new FormControl(
              this.applicationData?.basePremium === 0 ? null : this.applicationData?.basePremium,
              [
                Validators.pattern('^[1-9]\\d*(.\\d{1,2})?$'),
                Validators.max(this.firstFormGroup.get('premiumAmount').value),
              ],
            ),
          );
          this.firstFormGroup.addControl(
            'gst',
            new FormControl(this.applicationData?.gst === 0 ? null : this.applicationData?.gst, [
              Validators.pattern('^[1-9]\\d*(.\\d{1,2})?$'),
              Validators.max(this.firstFormGroup.get('basePremium').value),
            ]),
          );
          this.firstFormGroup.updateValueAndValidity();
        } else {
          this.firstFormGroup
            .get('pt')
            .setValidators([
              Validators.pattern('^[1-9]\\d*$'),
              Validators.min(1),
              Validators.max(99),
            ]);
          this.firstFormGroup
            .get('ppt')
            .setValidators([
              Validators.pattern('^[1-9]\\d*$'),
              Validators.min(1),
              Validators.max(
                this.firstFormGroup?.get('pt').value ? this.firstFormGroup?.get('pt').value : 99,
              ),
            ]);
          this.firstFormGroup
            .get('premiumAmount')
            .setValidators([Validators.pattern('^[1-9]\\d*(.\\d{1,2})?$')]);
          this.firstFormGroup.get('mode').clearValidators();
          this.firstFormGroup.get('basePremium').clearValidators();
          this.firstFormGroup.get('gst').clearValidators();
          this.firstFormGroup.updateValueAndValidity();
        }
        this.firstFormGroup.removeControl('remarks');
      }
    }
  }

  createRemainingThirdFormControl() {
    if (this.appNo) {
      this.loggedIn = true;
      this.summaryFormGroup.removeControl('summaryinsurerApplicationNo');
      this.summaryFormGroup.addControl(
        'summaryinsurerApplicationNo',
        new FormControl(
          this.firstFormGroup.get('status').value !== 1
            ? this.firstFormGroup?.get('insurerApplicationNo').value
            : null,
        ),
      );
    }

    if (
      this.firstFormGroup.get('status').value === 6 ||
      this.firstFormGroup.get('status').value === 3 ||
      this.firstFormGroup.get('status').value === 11
    ) {
      this.summaryFormGroup.removeControl('summaryPolicyNo');
      this.summaryFormGroup.removeControl('summaryPolicyStartDate');
      this.summaryFormGroup.removeControl('summaryPolicyEndDate');
      this.summaryFormGroup.removeControl('summaryPT');
      this.summaryFormGroup.removeControl('summaryPPT');
      this.summaryFormGroup.removeControl('summaryMode');
      this.summaryFormGroup.removeControl('summaryPremiumAmount');
      this.summaryFormGroup.removeControl('summaryBasePremium');
      this.summaryFormGroup.removeControl('summaryGST');
      this.summaryFormGroup.addControl(
        'summaryRemarks',
        new FormControl(this.firstFormGroup?.get('remarks').value),
      );
      this.isIssued = false;
      this.uwStatus = false;
    } else if (
      this.firstFormGroup.get('status').value === 2 ||
      this.firstFormGroup.get('status').value === 4 ||
      this.firstFormGroup.get('status').value === 12
    ) {
      if (this.firstFormGroup.get('status').value === 2) {
        this.loggedIn = true;
        this.summaryFormGroup.addControl(
          'summaryinsurerApplicationNo',
          new FormControl(this.firstFormGroup?.get('insurerApplicationNo').value),
        );
      }
      this.isIssued = false;
      this.uwStatus = true;
    } else if (this.firstFormGroup.get('status').value === 9) {
      this.summaryFormGroup.removeControl('summaryRemarks');
      this.summaryFormGroup.addControl(
        'summaryPolicyNo',
        new FormControl(this.firstFormGroup?.get('policyNo').value),
      );
      this.summaryFormGroup.addControl(
        'summaryPolicyStartDate',
        new FormControl(this.firstFormGroup?.get('policyStartDate').value),
      );
      this.summaryFormGroup.addControl(
        'summaryPolicyEndDate',
        new FormControl(this.firstFormGroup?.get('policyEndDate').value),
      );
      this.summaryFormGroup.addControl(
        'summaryPT',
        new FormControl(this.firstFormGroup?.get('pt').value),
      );
      this.summaryFormGroup.addControl(
        'summaryPPT',
        new FormControl(this.firstFormGroup?.get('ppt').value),
      );
      this.summaryFormGroup.addControl(
        'summaryMode',
        new FormControl(this.firstFormGroup?.get('mode').value),
      );
      this.summaryFormGroup.addControl(
        'summaryPremiumAmount',
        new FormControl(this.firstFormGroup?.get('premiumAmount').value),
      );
      this.summaryFormGroup.addControl(
        'summaryBasePremium',
        new FormControl(this.firstFormGroup?.get('basePremium').value),
      );
      this.summaryFormGroup.addControl(
        'summaryGST',
        new FormControl(this.firstFormGroup?.get('gst').value),
      );
      this.isIssued = true;
      this.uwStatus = false;
    }
  }

  showInputByStatus(id) {
    if (id !== '') {
      this.loggedIn = true;
      this.firstFormGroup.removeControl('insurerApplicationNo');
      this.firstFormGroup.addControl(
        'insurerApplicationNo',
        new FormControl(this.applicationData?.insurerApplicationNo),
      );
      if (id === 6) {
        this.statusCheckOnChange = true;
        this.firstFormGroup.removeControl('policyNo');
        this.firstFormGroup.removeControl('policyStartDate');
        this.firstFormGroup.removeControl('policyEndDate');
        this.firstFormGroup.removeControl('pt');
        this.firstFormGroup.removeControl('confirmpt');
        this.firstFormGroup.removeControl('ppt');
        this.firstFormGroup.removeControl('confirmppt');
        this.firstFormGroup.removeControl('mode');
        this.firstFormGroup.removeControl('premiumAmount');
        this.firstFormGroup.removeControl('confirmpremiumAmount');
        this.firstFormGroup.removeControl('basePremium');
        this.firstFormGroup.removeControl('gst');
        this.firstFormGroup.removeControl('remarks');
        this.firstFormGroup.addControl('remarks', new FormControl(null, Validators.required));
        this.showPaymentInfo = false;
        this.isIssued = false;
        this.uwStatus = false;
      } else if (id === 2 || id === 4 || id === 12) {
        if (id === 2) {
          this.loggedIn = true;
          this.firstFormGroup.removeControl('insurerApplicationNo');
          this.firstFormGroup.addControl(
            'insurerApplicationNo',
            new FormControl(this.applicationData?.insurerApplicationNo, Validators.required),
          );
        }
        this.statusCheckOnChange = true;
        this.isIssued = false;
        this.uwStatus = true;
        this.firstFormGroup.removeControl('policyNo');
        this.firstFormGroup.removeControl('policyStartDate');
        this.firstFormGroup.removeControl('policyEndDate');
        this.firstFormGroup.removeControl('pt');
        this.firstFormGroup.removeControl('confirmpt');
        this.firstFormGroup.removeControl('ppt');
        this.firstFormGroup.removeControl('confirmppt');
        this.firstFormGroup.removeControl('mode');
        this.firstFormGroup.removeControl('premiumAmount');
        this.firstFormGroup.removeControl('confirmpremiumAmount');
        this.firstFormGroup.removeControl('basePremium');
        this.firstFormGroup.removeControl('gst');
        this.firstFormGroup.removeControl('remarks');
        this.showPaymentInfo = false;
        this.isIssued = false;
      } else if (id === 3 || id === 11) {
        this.statusCheckOnChange = true;
        this.firstFormGroup.removeControl('policyNo');
        this.firstFormGroup.removeControl('policyStartDate');
        this.firstFormGroup.removeControl('policyEndDate');
        this.firstFormGroup.removeControl('pt');
        this.firstFormGroup.removeControl('confirmpt');
        this.firstFormGroup.removeControl('ppt');
        this.firstFormGroup.removeControl('confirmppt');
        this.firstFormGroup.removeControl('mode');
        this.firstFormGroup.removeControl('premiumAmount');
        this.firstFormGroup.removeControl('confirmpremiumAmount');
        this.firstFormGroup.removeControl('basePremium');
        this.firstFormGroup.removeControl('gst');
        this.firstFormGroup.removeControl('remarks');
        this.firstFormGroup.addControl('remarks', new FormControl(null));
        this.showPaymentInfo = false;
        this.isIssued = false;
        this.uwStatus = false;
      } else if (id === 9) {
        console.log('in inforce', this.statusCheckOnChange);
        this.generateFormFields();
        this.showPaymentInfo = true;
        this.firstFormGroup.removeControl('remarks');
        this.firstFormGroup.addControl(
          'policyStartDate',
          new FormControl(null, Validators.required),
        );
        this.firstFormGroup.addControl('policyEndDate', new FormControl(null, Validators.required));
        this.firstFormGroup.addControl('policyNo', new FormControl(null, Validators.required));
        this.firstFormGroup.addControl(
          'confirmpt',
          new FormControl(null, [Validators.required, Validators.pattern('^[1-9]\\d*$')]),
        );
        this.firstFormGroup.addControl(
          'confirmppt',
          new FormControl(null, [Validators.required, Validators.pattern('^[1-9]\\d*$')]),
        );
        this.firstFormGroup.addControl(
          'confirmpremiumAmount',
          new FormControl(null, [
            Validators.required,
            Validators.pattern('^[1-9]\\d*(.\\d{1,2})?$'),
          ]),
        );
        if (this.statusCheckOnChange) {
          this.firstFormGroup.removeControl('pt');
          this.firstFormGroup.removeControl('ppt');
          this.firstFormGroup.removeControl('mode');
          this.firstFormGroup.removeControl('premiumAmount');
          this.firstFormGroup.removeControl('basePremium');
          this.firstFormGroup.removeControl('gst');
          this.firstFormGroup.addControl(
            'pt',
            new FormControl(this.applicationData?.pt === 0 ? null : this.applicationData?.pt, [
              Validators.required,
              Validators.pattern('^[1-9]\\d*$'),
              Validators.min(1),
              Validators.max(99),
            ]),
          );
          this.firstFormGroup.addControl(
            'ppt',
            new FormControl(
              this.applicationData?.ppt === 0
                ? this.applicationData?.lob !== 'Life'
                  ? 1
                  : null
                : this.applicationData?.ppt,
              [
                Validators.required,
                Validators.pattern('^[1-9]\\d*$'),
                Validators.min(1),
                Validators.max(
                  this.firstFormGroup?.get('pt').value ? this.firstFormGroup?.get('pt').value : 99,
                ),
              ],
            ),
          );
          this.firstFormGroup.addControl(
            'mode',
            new FormControl(
              this.applicationData?.mode === 0 ? null : this.applicationData?.mode,
              Validators.required,
            ),
          );
          this.firstFormGroup.addControl(
            'premiumAmount',
            new FormControl(
              this.applicationData?.premiumAmount === 0
                ? null
                : this.applicationData?.premiumAmount,
              [Validators.required, Validators.pattern('^[1-9]\\d*(.\\d{1,2})?$')],
            ),
          );
          this.firstFormGroup.addControl(
            'basePremium',
            new FormControl(
              this.applicationData?.basePremium === 0 ? null : this.applicationData?.basePremium,
              [
                Validators.required,
                Validators.max(this.firstFormGroup.get('premiumAmount').value),
                Validators.pattern('^[1-9]\\d*(.\\d{1,2})?$'),
              ],
            ),
          );
          this.firstFormGroup.addControl(
            'gst',
            new FormControl(this.applicationData?.gst === 0 ? null : this.applicationData?.gst, [
              Validators.required,
              Validators.max(this.firstFormGroup.get('basePremium').value),
              Validators.pattern('^[1-9]\\d*(.\\d{1,2})?$'),
            ]),
          );
          this.firstFormGroup.updateValueAndValidity();
        } else {
          this.firstFormGroup.get('pt').clearValidators();
          this.firstFormGroup.get('ppt').clearValidators();
          this.firstFormGroup.get('mode').clearValidators();
          this.firstFormGroup.get('premiumAmount').clearValidators();
          this.firstFormGroup.get('basePremium').clearValidators();
          this.firstFormGroup.get('gst').clearValidators();
          this.firstFormGroup
            .get('pt')
            .setValidators([
              Validators.required,
              Validators.pattern('^[1-9]\\d*$'),
              Validators.min(1),
              Validators.max(99),
            ]);
          this.firstFormGroup
            .get('ppt')
            .setValidators([
              Validators.required,
              Validators.pattern('^[1-9]\\d*$'),
              Validators.min(1),
              Validators.max(
                this.firstFormGroup?.get('pt').value ? this.firstFormGroup?.get('pt').value : 99,
              ),
            ]);
          this.firstFormGroup.get('mode').setValidators([Validators.required]);
          this.firstFormGroup
            .get('premiumAmount')
            .setValidators([Validators.required, Validators.pattern('^[1-9]\\d*(.\\d{1,2})?$')]);
          this.firstFormGroup
            .get('basePremium')
            .setValidators([
              Validators.required,
              Validators.pattern('^[1-9]\\d*(.\\d{1,2})?$'),
              Validators.max(this.firstFormGroup.get('premiumAmount').value),
            ]);
          this.firstFormGroup
            .get('gst')
            .setValidators([
              Validators.required,
              Validators.pattern('^[1-9]\\d*(.\\d{1,2})?$'),
              Validators.max(this.firstFormGroup.get('basePremium').value),
            ]);
          this.firstFormGroup.updateValueAndValidity();
        }
        this.isIssued = true;
        this.uwStatus = false;
      }
    }
  }

  confirmCheck(event, index) {
    if (index === 1) {
      // tslint:disable-next-line: radix
      if (parseInt(event.target.value) !== parseInt(this.firstFormGroup.get('pt').value)) {
        this.firstFormGroup.get('confirmpt').setErrors({ mustMatch: true });
      } else {
        this.firstFormGroup.get('confirmpt').setErrors(null);
      }
    } else if (index === 2) {
      // tslint:disable-next-line: radix
      if (parseInt(event.target.value) !== parseInt(this.firstFormGroup.get('ppt').value)) {
        this.firstFormGroup.get('confirmppt').setErrors({ mustMatch: true });
      } else {
        this.firstFormGroup.get('confirmppt').setErrors(null);
      }
    } else if (index === 3) {
      // tslint:disable-next-line: radix
      if (
        parseInt(event.target.value) !== parseInt(this.firstFormGroup.get('premiumAmount').value)
      ) {
        this.firstFormGroup.get('confirmpremiumAmount').setErrors({ mustMatch: true });
      } else {
        this.firstFormGroup.get('confirmpremiumAmount').setErrors(null);
      }
    }
  }

  onChanged(event) {
    if (event.value && this.lob !== null && this.productType !== null) {
      const value = event.value;
      this.loaderService.showSpinner(true);
      this.offlinePoliciesService
        .getProductsByProductTypeInsurer(this.lob, this.productType, value)
        .subscribe(
          (result) => {
            this.productDropdown = result;
            this.loaderService.showSpinner(false);
          },
          (error) => {
            this.productDropdown = [{ id: 'Test', value: 'Test' }];
            this.loaderService.showSpinner(false);
          },
        );
    }
  }

  onInsurerChanged(event) {
    if (event.value && this.firstFormGroup.get('insurer').value) {
      const value = event.value.split('_');
      this.lob = value[0];
      this.productType = value[1];
      if (this.lob !== 'Life') {
        this.firstFormGroup.get('ppt').setValue(1);
      } else {
        this.firstFormGroup.get('ppt').setValue(null);
      }
      this.loaderService.showSpinner(true);
      this.offlinePoliciesService
        .getProductsByProductTypeInsurer(
          this.lob,
          this.productType,
          this.firstFormGroup.get('insurer').value,
        )
        .subscribe(
          (result) => {
            this.productDropdown = result;
            this.loaderService.showSpinner(false);
          },
          (error) => {
            this.productDropdown = [{ id: 'Test', value: 'Test' }];
            this.loaderService.showSpinner(false);
          },
        );
    }
  }

  getProducts() {
    this.offlinePoliciesService
      .getProductsByProductTypeInsurer(
        this.appNo ? this.applicationData.lob : this.lob,
        this.appNo ? this.applicationData.productType : this.productType,
        this.appNo ? this.applicationData.insurerId : this.insurerId,
      )
      .subscribe(
        (result) => {
          this.productDropdown = result;
          this.loaderService.showSpinner(false);
        },
        (error) => {
          this.productDropdown = [{ id: 'Test', value: 'Test' }];
          this.loaderService.showSpinner(false);
        },
      );
  }

  onProductSelect(event) {
    this.productDropdown.forEach((item) => {
      if (item.productId === event.value) {
        this.insurerId = item.insurerId;
        this.productName = item.productName;
        this.insurerName = item.insurerName;
        console.log(
          'PRINTING INSURERID, PRODUCNAME AND INSURERNAME',
          this.insurerId,
          this.productName,
          this.insurerName,
        );
      }
    });
    this.fetchMasters(event.value);
    // console.log(event.value);
  }

  goToNextScreen(stepper: MatStepper, index: number) {
    if (index === 0) {
      if (this.firstFormGroup.get('status').value === 9) {
        this.paymentForm
          .get('premiumPayable')
          .setValue(this.firstFormGroup.get('premiumAmount').value);
      }
      this.createProposerForm();
      this.showProposer = true;
      this.formDisableForInsurer(1);
    } else if (index === 1) {
      this.createContactInfoForm();
      this.showContactInfo = true;
      if (this.thirdFormGroup.get('policypostalcode').value) {
        this.fetchCityAndState(
          this.appNo
            ? this.applicationData?.applicationData?.policyAddress?.postalcode
            : this.customerDetails?.addressList[0].postalcode,
        );
      }
      this.formDisableForInsurer(2);
    } else {
      this.createSummaryForm();
      this.createRemainingThirdFormControl();
      this.createPaymentInfoSummary();
      this.showSummary = true;
      this.summaryFormGroup.disable();
    }
    stepper.next();
  }

  formDisableForInsurer(check) {
    if (this.appNo) {
      if (check === 1) {
        if (
          (this.isInsurerUser && this.applicationData?.statusCode === 1) ||
          this.applicationData?.statusCode === 2 ||
          this.applicationData?.statusCode === 4 ||
          this.applicationData?.statusCode === 11 ||
          this.applicationData?.statusCode === 12
        ) {
          this.secondFormGroup.get('title').enable();
          this.secondFormGroup.get('maritalStatus').enable();
        } else {
          this.secondFormGroup.get('title').disable();
          this.secondFormGroup.get('maritalStatus').disable();
        }
        this.secondFormGroup.get('firstName').disable();
        this.secondFormGroup.get('lastName').disable();
        this.secondFormGroup.get('dob').disable();
        this.secondFormGroup.get('gender').disable();
        this.secondFormGroup.get('email').disable();
        this.secondFormGroup.get('mobile').disable();
      } else if (check === 2) {
        if (
          (this.isInsurerUser && this.applicationData?.statusCode === 1) ||
          this.applicationData?.statusCode === 2 ||
          this.applicationData?.statusCode === 4 ||
          this.applicationData?.statusCode === 11 ||
          this.applicationData?.statusCode === 12
        ) {
          // contact info editable for insurer if status is iniated
        } else {
          this.thirdFormGroup.get('addressSame').disable();
          this.thirdFormGroup.get('policyaddressline1').disable();
          this.thirdFormGroup.get('policyaddressline2').disable();
          this.thirdFormGroup.get('policyaddressline3').disable();
          this.thirdFormGroup.get('policypostalcode').disable();
          this.thirdFormGroup.get('policycity').disable();
          if (this.thirdFormGroup.get('addressSame').value === 'no') {
            this.thirdFormGroup.get('mailingaddressline1').disable();
            this.thirdFormGroup.get('mailingaddressline2').disable();
            this.thirdFormGroup.get('mailingaddressline3').disable();
            this.thirdFormGroup.get('mailingpostalcode').disable();
            this.thirdFormGroup.get('mailingcity').disable();
          }
        }
      }
    }
  }

  fetchMasters(productId) {
    this.loaderService.showSpinner(true);
    this.offlinePoliciesService.getMaritalStatus(productId).subscribe((result) => {
      this.maritalStatusDropdown = result;
      this.maritalStatusArray = this.maritalStatusDropdown
        .map((val) => {
          return val.id;
        })
        .join('|');
      console.log(this.maritalStatusArray);
    });
    this.offlinePoliciesService.getTitle(productId).subscribe((result) => {
      this.titleDropdown = result;
      this.titleArray = this.titleDropdown
        .map((val) => {
          return val.id;
        })
        .join('|');
      console.log(this.titleArray);
    });
    this.offlinePoliciesService.getOccupation(productId).subscribe((result) => {
      this.occupationDropdown = result;
    });
    this.loaderService.showSpinner(false);
  }

  fetchCityAndState(pincode) {
    this.loaderService.showSpinner(true);
    this.offlinePoliciesService.getCityAndState(pincode).subscribe(
      (result) => {
        this.thirdFormGroup.get('policycity').setValue(result.city);
        this.thirdFormGroup.get('policystate').setValue(result.stateName);
        this.thirdFormGroup.get('mailingcity').setValue(result.city);
        this.thirdFormGroup.get('mailingstate').setValue(result.stateName);
        this.loaderService.showSpinner(false);
      },
      (error) => {
        this.thirdFormGroup.get('policycity').setValue(null);
        this.thirdFormGroup.get('policystate').setValue(null);
        this.thirdFormGroup.get('mailingcity').setValue(null);
        this.thirdFormGroup.get('mailingstate').setValue(null);
        this.loaderService.showSpinner(false);
      },
    );
  }

  createPolicyForm() {
    const mode = this.applicationData?.mode === 0 ? null : this.applicationData?.mode;
    const pt = this.applicationData?.pt === 0 ? null : this.applicationData?.pt;
    const ppt =
      this.applicationData?.ppt === 0
        ? this.applicationData?.lob !== 'Life'
          ? 1
          : null
        : this.applicationData?.ppt;
    const premiumAmount =
      this.applicationData?.premiumAmount === 0 ? null : this.applicationData?.premiumAmount;
    const basePremium =
      this.applicationData?.basePremium === 0 ? null : this.applicationData?.basePremium;
    const gst = this.applicationData?.gst === 0 ? null : this.applicationData?.gst;
    this.firstFormGroup = new FormGroup({
      insurer: new FormControl(this.appNo ? this.applicationData?.insurerId.toString() : null, [
        Validators.required,
      ]),
      product: new FormControl(
        this.appNo
          ? this.applicationData?.lob + '_' + this.applicationData?.productType
          : this.lob + '_' + this.productType,
        [Validators.required],
      ),
      productName: new FormControl(this.appNo ? this.applicationData?.productId : this.productId, [
        Validators.required,
      ]),
      sp: new FormControl(this.appNo ? this.applicationData?.spCode : null, [Validators.required]),
      status: new FormControl(this.appNo ? this.applicationData?.statusCode : 1, [
        Validators.required,
      ]),
      branchCode: new FormControl(
        this.appNo ? this.applicationData?.branchCode : this.currentUser['branchCode'],
      ),
      lgCode: new FormControl(
        this.appNo ? this.applicationData?.applicationData.agencyData?.lgCode : null,
        [Validators.required],
      ),
      searchCtrl1: new FormControl(''),
      mode: new FormControl(this.appNo ? mode : null),
      pt: new FormControl(this.appNo ? pt : null, [
        Validators.pattern('^[1-9]\\d*$'),
        Validators.min(1),
        Validators.max(99),
      ]),
      ppt: new FormControl(this.appNo ? ppt : null, [
        Validators.pattern('^[1-9]\\d*$'),
        Validators.min(1),
        Validators.max(
          this.firstFormGroup?.get('pt').value ? this.firstFormGroup?.get('pt').value : 99,
        ),
      ]),
      premiumAmount: new FormControl(this.appNo ? premiumAmount : null, [
        Validators.pattern('^[1-9]\\d*(.\\d{1,2})?$'),
      ]),
      basePremium: new FormControl(this.appNo ? basePremium : null, [
        Validators.pattern('^[1-9]\\d*$'),
      ]),
      gst: new FormControl(this.appNo ? gst : null, [Validators.pattern('^[1-9]\\d*$')]),
    });

    if (this.isBranchUser && this.appNo !== null) {
      this.firstFormGroup.get('pt').disable();
      this.firstFormGroup.get('ppt').disable();
      this.firstFormGroup.get('premiumAmount').disable();
      this.firstFormGroup.get('mode').disable();
    }
  }

  createProposerForm() {
    if (this.titleArray === '' || this.titleArray === null) {
      this.titleArray = 'No Data';
    }
    if (this.maritalStatusArray === '' || this.maritalStatusArray === null) {
      this.maritalStatusArray = 'No Data';
    }
    const title = this.customerDetails?.titleCode ? this.customerDetails?.titleCode : null;
    const maritalStatus = this.customerDetails?.maritalStatus
      ? this.customerDetails?.maritalStatus
      : null;
    const mobileNo = this.customerDetails?.mobileNo;
    this.secondFormGroup = new FormGroup({
      title: new FormControl(
        this.appNo ? this.applicationData?.applicationData?.proposer?.title : title,
        [Validators.required, Validators.pattern(this.titleArray)],
      ),
      firstName: new FormControl(
        this.appNo
          ? this.applicationData?.applicationData?.proposer?.firstName
          : this.customerDetails?.firstName,
        [Validators.required, Validators.minLength(1), Validators.maxLength(45)],
      ),
      lastName: new FormControl(
        this.appNo
          ? this.applicationData?.applicationData?.proposer?.lastName
          : this.customerDetails?.lastName,
        [Validators.required, Validators.minLength(1), Validators.maxLength(45)],
      ),
      dob: new FormControl(
        this.appNo
          ? this.applicationData?.applicationData?.proposer?.dob
          : this.customerDetails?.dob,
        [Validators.required],
      ),
      gender: new FormControl(
        this.appNo
          ? this.applicationData?.applicationData?.proposer?.gender
          : this.customerDetails?.gender,
        [Validators.required, Validators.pattern('M|F')],
      ),
      maritalStatus: new FormControl(
        this.appNo ? this.applicationData?.applicationData?.proposer?.maritalStatus : maritalStatus,
        [Validators.required, Validators.pattern(this.maritalStatusArray)],
      ),
      // occupation: new FormControl(this.appNo ? this.applicationData?.applicationData?.proposer?.occupation : null,[Validators.required]),
      email: new FormControl(
        this.appNo
          ? this.applicationData?.applicationData?.proposer?.email
          : this.customerDetails?.email,
        [Validators.required, Validators.email],
      ),
      mobile: new FormControl(
        this.appNo ? this.applicationData?.applicationData?.proposer?.mobile : mobileNo,
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ),
      panNo: new FormControl(
        this.appNo ? this.applicationData?.applicationData?.proposer?.panNo : null,
        [Validators.pattern('^[A-Z]{3}[ABCFGHLJPTK][A-Z][0-9]{4}[A-Z]$')],
      ),
    });
  }

  createContactInfoForm() {
    const postalcodeRegex: RegExp = /^[1-9]{1}[0-9]{5,5}$/;
    this.thirdFormGroup = new FormGroup({
      addressSame: new FormControl('no'),
      policyaddressline1: new FormControl(
        this.appNo
          ? this.applicationData?.applicationData?.policyAddress?.addressline1
          : this.customerDetails?.addressList[0].addressline1,
        [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
      ),
      policyaddressline2: new FormControl(
        this.appNo
          ? this.applicationData?.applicationData?.policyAddress?.addressline2
          : this.customerDetails?.addressList[0].addressline2,
        [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
      ),
      policyaddressline3: new FormControl(
        this.appNo
          ? this.applicationData?.applicationData?.policyAddress?.addressline3
          : this.customerDetails?.addressList[0].addressline3,
        [Validators.maxLength(50)],
      ),
      policypostalcode: new FormControl(
        this.appNo
          ? this.applicationData?.applicationData?.policyAddress?.postalcode.trim()
          : this.customerDetails?.addressList[0].postalcode.trim(),
        [Validators.required, Validators.pattern(postalcodeRegex)],
      ),
      policycity: new FormControl(
        this.appNo
          ? this.applicationData?.applicationData?.policyAddress?.city
          : this.customerDetails?.addressList[0].city,
        [Validators.required],
      ),
      policystate: new FormControl(null, [Validators.required]),
      mailingaddressline1: new FormControl(
        this.appNo
          ? this.applicationData?.applicationData?.mailingAddress?.addressline1
          : this.customerDetails?.addressList[0].addressline1,
        [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
      ),
      mailingaddressline2: new FormControl(
        this.appNo
          ? this.applicationData?.applicationData?.mailingAddress?.addressline2
          : this.customerDetails?.addressList[0].addressline2,
        [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
      ),
      mailingaddressline3: new FormControl(
        this.appNo
          ? this.applicationData?.applicationData?.mailingAddress?.addressline3
          : this.customerDetails?.addressList[0].addressline3,
        [Validators.maxLength(50)],
      ),
      mailingpostalcode: new FormControl(
        this.appNo
          ? this.applicationData?.applicationData?.mailingAddress?.postalcode.trim()
          : this.customerDetails?.addressList[0].postalcode.trim(),
        [Validators.required, Validators.pattern(postalcodeRegex)],
      ),
      mailingcity: new FormControl(
        this.appNo
          ? this.applicationData?.applicationData?.mailingAddress?.city
          : this.customerDetails?.addressList[0].city,
        [Validators.required],
      ),
      mailingstate: new FormControl(null, [Validators.required]),
    });
  }

  createSummaryForm() {
    console.log('status Code', this.applicationData?.statusCode);
    this.summaryFormGroup = new FormGroup({
      summaryInsurer: new FormControl(this.firstFormGroup.get('insurer').value.toString()),
      summaryProduct: new FormControl(this.lob + '_' + this.productType),
      summaryProductName: new FormControl(this.firstFormGroup.get('productName').value),
      summarySP: new FormControl(this.firstFormGroup.get('sp').value),
      summaryStatus: new FormControl(this.firstFormGroup.get('status').value),
      summaryBranchCode: new FormControl(this.firstFormGroup.get('branchCode').value),
      summaryLgCode: new FormControl(this.firstFormGroup.get('lgCode').value),
      summaryTitle: new FormControl(this.secondFormGroup.get('title').value),
      summaryFirstName: new FormControl(this.secondFormGroup.get('firstName').value),
      summaryLastName: new FormControl(this.secondFormGroup.get('lastName').value),
      summaryDOB: new FormControl(this.secondFormGroup.get('dob').value),
      summaryGender: new FormControl(this.secondFormGroup.get('gender').value),
      summaryMaritalStatus: new FormControl(this.secondFormGroup.get('maritalStatus').value),
      // summaryOccupation: new FormControl(this.secondFormGroup.get('occupation').value),
      summaryEmail: new FormControl(this.secondFormGroup.get('email').value),
      summaryMobile: new FormControl(this.secondFormGroup.get('mobile').value),
      summaryPanNo: new FormControl(this.secondFormGroup.get('panNo').value),
      summaryaddressSame: new FormControl(this.thirdFormGroup.get('addressSame').value),
      summaryPolicyaddressline1: new FormControl(
        this.thirdFormGroup.get('policyaddressline1').value,
      ),
      summaryPolicyaddressline2: new FormControl(
        this.thirdFormGroup.get('policyaddressline2').value,
      ),
      summaryPolicyaddressline3: new FormControl(
        this.thirdFormGroup.get('policyaddressline3').value,
      ),
      summaryPolicypostalcode: new FormControl(this.thirdFormGroup.get('policypostalcode').value),
      summaryPolicycity: new FormControl(this.thirdFormGroup.get('policycity').value),
      summaryPolicystate: new FormControl(
        this.applicationData?.statusCode === 3 ||
        this.applicationData?.statusCode === 6 ||
        (this.applicationData?.statusCode === 9 && this.applicationData?.statusCode !== undefined)
          ? this.policyState
          : this.thirdFormGroup.get('policystate').value,
      ),
      summaryMailingaddressline1: new FormControl(
        this.thirdFormGroup.get('addressSame').value === 'no'
          ? this.thirdFormGroup.get('mailingaddressline1').value
          : this.thirdFormGroup.get('policyaddressline1').value,
      ),
      summaryMailingaddressline2: new FormControl(
        this.thirdFormGroup.get('addressSame').value === 'no'
          ? this.thirdFormGroup.get('mailingaddressline2').value
          : this.thirdFormGroup.get('policyaddressline2').value,
      ),
      summaryMailingaddressline3: new FormControl(
        this.thirdFormGroup.get('addressSame').value === 'no'
          ? this.thirdFormGroup.get('mailingaddressline3').value
          : this.thirdFormGroup.get('policyaddressline3').value,
      ),
      summaryMailingpostalcode: new FormControl(
        this.thirdFormGroup.get('addressSame').value === 'no'
          ? this.thirdFormGroup.get('mailingpostalcode').value
          : this.thirdFormGroup.get('policypostalcode').value,
      ),
      summaryMailingcity: new FormControl(
        this.thirdFormGroup.get('addressSame').value === 'no'
          ? this.thirdFormGroup.get('mailingcity').value
          : this.thirdFormGroup.get('policycity').value,
      ),
      summaryMailingstate: new FormControl(
        this.applicationData?.statusCode === 3 ||
        this.applicationData?.statusCode === 6 ||
        (this.applicationData?.statusCode === 9 && this.applicationData?.statusCode !== undefined)
          ? this.mailingState
          : this.thirdFormGroup.get('addressSame').value === 'no'
          ? this.thirdFormGroup.get('mailingstate').value
          : this.thirdFormGroup.get('policystate').value,
      ),
    });

    console.log(this.firstFormGroup.get('status').value);

    if (
      this.firstFormGroup.get('status').value === 1 ||
      this.firstFormGroup.get('status').value === 9
    ) {
      this.summaryFormGroup.addControl(
        'summaryPT',
        new FormControl(this.firstFormGroup?.get('pt').value),
      );
      this.summaryFormGroup.addControl(
        'summaryPPT',
        new FormControl(this.firstFormGroup?.get('ppt').value),
      );
      this.summaryFormGroup.addControl(
        'summarymode',
        new FormControl(this.firstFormGroup?.get('mode').value),
      );
      this.summaryFormGroup.addControl(
        'summarypremiumAmount',
        new FormControl(this.firstFormGroup?.get('premiumAmount').value),
      );
      this.summaryFormGroup.addControl(
        'summarybasePremium',
        new FormControl(this.firstFormGroup?.get('basePremium').value),
      );
      this.summaryFormGroup.addControl(
        'summarygst',
        new FormControl(this.firstFormGroup?.get('gst').value),
      );
    }
  }

  makeReadOnly() {
    return this.appNo === null ? false : true;
  }

  createRemainingFormControl() {
    console.log('hi inside create remaining control');
    this.firstFormGroup.get('insurer').disable();
    this.firstFormGroup.get('product').disable();
    this.firstFormGroup.get('productName').disable();
    this.firstFormGroup.get('sp').disable();
    this.firstFormGroup.get('status').disable();
    this.firstFormGroup.get('lgCode').disable();
    this.firstFormGroup.removeControl('remarks');
    this.loggedIn = true;
    this.firstFormGroup.addControl(
      'insurerApplicationNo',
      new FormControl({ value: this.applicationData?.insurerApplicationNo, disabled: true }),
    );
    if (this.applicationData?.statusCode === 6) {
      this.isIssued = false;
      this.firstFormGroup.addControl(
        'remarks',
        new FormControl(
          { value: this.applicationData?.remarks, disabled: true },
          Validators.required,
        ),
      );
    } else if (this.applicationData?.statusCode === 3) {
      this.isIssued = false;
      this.firstFormGroup.addControl(
        'remarks',
        new FormControl({ value: this.applicationData?.remarks, disabled: true }),
      );
    } else if (this.applicationData?.statusCode === 11) {
      this.firstFormGroup.get('product').enable();
      this.firstFormGroup.get('productName').enable();
      this.firstFormGroup.get('status').enable();
      this.isIssued = false;
      this.firstFormGroup.addControl(
        'remarks',
        new FormControl({ value: this.applicationData?.remarks, disabled: false }),
      );
    } else if (
      this.applicationData?.statusCode === 2 ||
      this.applicationData?.statusCode === 4 ||
      this.applicationData?.statusCode === 12
    ) {
      this.firstFormGroup.get('product').enable();
      this.firstFormGroup.get('productName').enable();
      this.firstFormGroup.get('status').enable();
      this.isIssued = false;
    } else if (this.applicationData?.statusCode === 9) {
      this.showPaymentInfo = true;
      this.isIssued = true;
      this.generateFormFields();
      this.firstFormGroup.addControl(
        'policyStartDate',
        new FormControl(
          { value: this.applicationData?.policyStartDate, disabled: true },
          Validators.required,
        ),
      );
      this.firstFormGroup.addControl(
        'policyEndDate',
        new FormControl(
          { value: this.applicationData?.policyEndDate, disabled: true },
          Validators.required,
        ),
      );
      this.firstFormGroup.addControl(
        'policyNo',
        new FormControl(
          { value: this.applicationData?.policyNo, disabled: true },
          Validators.required,
        ),
      );
      this.firstFormGroup.addControl(
        'pt',
        new FormControl({ value: this.applicationData?.pt, disabled: true }, [
          Validators.required,
          Validators.pattern('^[1-9]*$'),
        ]),
      );
      this.firstFormGroup.addControl(
        'confirmpt',
        new FormControl({ value: this.applicationData?.pt, disabled: true }, [
          Validators.required,
          Validators.pattern('^[1-9]*$'),
        ]),
      );
      this.firstFormGroup.addControl(
        'ppt',
        new FormControl({ value: this.applicationData?.ppt, disabled: true }, [
          Validators.required,
          Validators.pattern('^[1-9]*$'),
          Validators.max(this.applicationData?.pt),
        ]),
      );
      this.firstFormGroup.addControl(
        'confirmppt',
        new FormControl({ value: this.applicationData?.ppt, disabled: true }, [
          Validators.required,
        ]),
      );
      this.firstFormGroup.addControl(
        'mode',
        new FormControl({ value: this.applicationData?.mode, disabled: true }, Validators.required),
      );
      this.firstFormGroup.addControl(
        'premiumAmount',
        new FormControl({ value: this.applicationData?.premiumAmount, disabled: true }, [
          Validators.required,
          Validators.pattern('^[1-9]\\d*(.\\d{1,2})?$'),
        ]),
      );
      this.firstFormGroup.addControl(
        'confirmpremiumAmount',
        new FormControl({ value: this.applicationData?.premiumAmount, disabled: true }, [
          Validators.required,
        ]),
      );
      this.firstFormGroup.addControl(
        'basePremium',
        new FormControl({ value: this.applicationData?.basePremium, disabled: true }, [
          Validators.required,
          Validators.pattern('^[1-9]\\d*(.\\d{1,2})?$'),
        ]),
      );
      this.firstFormGroup.addControl(
        'gst',
        new FormControl({ value: this.applicationData?.gst, disabled: true }, [
          Validators.required,
          Validators.pattern('^[1-9]\\d*(.\\d{1,2})?$'),
        ]),
      );

      this.firstFormGroup.get('pt').disable();
      this.firstFormGroup.get('ppt').disable();
      this.firstFormGroup.get('mode').disable();
      this.firstFormGroup.get('premiumAmount').disable();
      this.firstFormGroup.get('basePremium').disable();
      this.firstFormGroup.get('gst').disable();
      // console.log('hiiii after status update');
      // payment Info Form
    }
  }

  calculateGST(value) {
    // if (value.length > 2){
    //   const decimalReg = /[.,]00$/;
    //   let gst = 0;
    //   if (this.productType === 'ENDW'){
    //     gst = value * 0.045;
    //   }else if (this.productType === 'Ulip'){
    //     gst = 0;
    //   }else {
    //     gst = value * 0.18;
    //   }
    //   const baseP = value - gst;
    //   this.firstFormGroup.get('basePremium').setValue(baseP.toFixed(2).replace(decimalReg, ''));
    //   this.firstFormGroup.get('gst').setValue(gst.toFixed(2).replace(decimalReg, ''));
    // } else{
    //   this.firstFormGroup.get('basePremium').setValue(null);
    //   this.firstFormGroup.get('gst').setValue(null);
    // }
    // const baseP = this.firstFormGroup.get('basePremium').value;
    // const gst = this.firstFormGroup.get('gst').value;
    // if(baseP)
    if (value.length > 2) {
      // tslint:disable-next-line: radix
      if (parseInt(value) < parseInt(this.firstFormGroup.get('basePremium').value)) {
        this.firstFormGroup.get('premiumAmount').setErrors({ checkTotal: true });
      } else {
        this.firstFormGroup.get('premiumAmount').setErrors(null);
      }
    }
  }

  checkBasePremium(value) {
    if (value.length > 2) {
      // tslint:disable-next-line: radix
      if (parseInt(value) > parseInt(this.firstFormGroup.get('premiumAmount').value)) {
        this.firstFormGroup.get('basePremium').setErrors({ max: true });
      } else {
        this.firstFormGroup.get('basePremium').setErrors(null);
      }
    }
  }

  checkGST(value) {
    if (value.length > 1) {
      // tslint:disable-next-line: radix
      if (parseInt(value) > parseInt(this.firstFormGroup.get('basePremium').value)) {
        this.firstFormGroup.get('gst').setErrors({ max: true });
      } else {
        // tslint:disable-next-line: radix
        const total = parseInt(value) + parseInt(this.firstFormGroup.get('basePremium').value);
        // tslint:disable-next-line: radix
        if (parseInt(this.firstFormGroup.get('premiumAmount').value) === total) {
          this.firstFormGroup.get('gst').setErrors(null);
        } else {
          this.firstFormGroup.get('gst').setErrors({ mustMatch: true });
        }
      }
    }
  }

  checkStatus() {
    if (this.isBranchUser) {
      return true;
    }
    return false;
  }

  onSubmitClicked() {
    if (this.appNo) {
      console.log('hi');
      if (
        this.applicationData?.statusCode === 1 ||
        this.applicationData.statusCode === 2 ||
        this.applicationData.statusCode === 4 ||
        this.applicationData.statusCode === 11 ||
        this.applicationData.statusCode === 12
      ) {
        if (this.isBranchUser) {
          const message = 'Only Insurer RM can modify the application.';
          const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
            data: message,
            panelClass: 'dialog-width',
          });
          dialogRef.afterClosed().subscribe((data) => {
            // navigate
          });
        } else if (this.currentUser['insurerUser']) {
          this.updateApplication();
        }
      } else if (
        this.applicationData.statusCode === 6 ||
        this.applicationData.statusCode === 9 ||
        this.applicationData.statusCode === 3
      ) {
        const message =
          this.applicationData.statusCode === 9
            ? 'Policy has already been issued for this application.'
            : 'Policy has already been rejected for this application.';
        const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
          data: message,
          panelClass: 'dialog-width',
        });
        dialogRef.afterClosed().subscribe((data) => {
          // navigate
        });
      }
    } else if (this.customerId) {
      if (this.isBranchUser) {
        this.submitApplication();
      } else {
        const message = 'Only Branch user can submit the application.';
        const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
          data: message,
          panelClass: 'dialog-width',
        });
        dialogRef.afterClosed().subscribe((data) => {
          // navigate
        });
      }
    }
  }

  submitApplication() {
    const createApplicationData = {
      customerId: this.customerId,
      lob: this.lob,
      productType: this.productType,
      productId: this.summaryFormGroup.get('summaryProductName').value,
      productName: this.productName,
      insurerId: this.insurerId,
      insurerName: this.insurerName,
      spCode: this.summaryFormGroup.get('summarySP').value,
      statusCode: 1,
      pt: this.firstFormGroup.get('pt').value,
      ppt: this.firstFormGroup.get('ppt').value,
      mode: this.firstFormGroup.get('mode').value,
      premiumAmount: this.firstFormGroup.get('premiumAmount').value,
      basePremium: this.firstFormGroup.get('basePremium').value,
      gst: this.firstFormGroup.get('gst').value,
      applicationData: {
        proposer: {
          title: this.summaryFormGroup.get('summaryTitle').value,
          firstName: this.summaryFormGroup.get('summaryFirstName').value,
          lastName: this.summaryFormGroup.get('summaryLastName').value,
          dob: this.summaryFormGroup.get('summaryDOB').value,
          gender: this.summaryFormGroup.get('summaryGender').value,
          maritalStatus: this.summaryFormGroup.get('summaryMaritalStatus').value,
          occupation: '',
          email: this.summaryFormGroup.get('summaryEmail').value,
          mobile: this.summaryFormGroup.get('summaryMobile').value,
          panNo: this.summaryFormGroup.get('summaryPanNo').value,
        },
        policyAddress: {
          addressType: 'PERMANENT',
          addressline1: this.summaryFormGroup.get('summaryPolicyaddressline1').value,
          addressline2: this.summaryFormGroup.get('summaryPolicyaddressline2').value,
          addressline3: this.summaryFormGroup.get('summaryPolicyaddressline3').value,
          city: this.summaryFormGroup.get('summaryPolicycity').value,
          country: this.country,
          countryCode: this.countryCode,
          postalcode: this.summaryFormGroup.get('summaryPolicypostalcode').value,
        },
        mailingAddress: {
          addressType: 'PERMANENT',
          addressline1: this.summaryFormGroup.get('summaryMailingaddressline1').value,
          addressline2: this.summaryFormGroup.get('summaryMailingaddressline2').value,
          addressline3: this.summaryFormGroup.get('summaryMailingaddressline3').value,
          city: this.summaryFormGroup.get('summaryMailingcity').value,
          country: this.country,
          countryCode: this.countryCode,
          postalcode: this.summaryFormGroup.get('summaryMailingpostalcode').value,
        },
        agencyData: {
          lgCode: this.summaryFormGroup.get('summaryLgCode').value,
          lgName: this.lgName,
        },
      },
    };
    // console.log('Request Data', createApplicationData);
    this.loaderService.showSpinner(true);
    this.offlinePoliciesService.submitApplication(createApplicationData).subscribe(
      (result: any) => {
        this.loaderService.showSpinner(false);
        const dialogRef = this.dialog.open(PolicyErrorModal2Component, {
          data: result,
          panelClass: 'dialog-width',
        });
        dialogRef.afterClosed().subscribe((data) => {
          // navigate
          this.router.navigate(['/offline-policies']);
        });
      },
      (error) => {
        this.showSubmitErrorMessage = true;
        this.submitErrorMessage = 'Error while submitting the form. Please try after sometime.';
        this.loaderService.showSpinner(false);
      },
    );
  }

  updateApplication() {
    console.log('update application');
    console.log(this.firstFormGroup.get('status').value);
    if (this.firstFormGroup.get('status').value !== 1) {
      console.log('inside insurer application no submit');
      this.applicationData.insurerApplicationNo =
        this.firstFormGroup.get('insurerApplicationNo').value;
    }
    if (this.firstFormGroup.get('status').value === 9) {
      this.applicationData.policyNo = this.firstFormGroup.get('policyNo').value;
      this.applicationData.policyStartDate = this.firstFormGroup.get('policyStartDate').value;
      this.applicationData.policyEndDate = this.firstFormGroup.get('policyEndDate').value;
      this.applicationData.pt = this.firstFormGroup.get('pt').value;
      this.applicationData.ppt = this.firstFormGroup.get('ppt').value;
      this.applicationData.mode = this.firstFormGroup.get('mode').value;
      this.applicationData.premiumAmount = this.firstFormGroup.get('premiumAmount').value;
      this.applicationData.basePremium = this.firstFormGroup.get('basePremium').value;
      this.applicationData.gst = this.firstFormGroup.get('gst').value;
      this.initiatePayment();
    } else if (
      this.firstFormGroup.get('status').value === 6 ||
      this.firstFormGroup.get('status').value === 3 ||
      this.firstFormGroup.get('status').value === 11
    ) {
      this.applicationData.remarks = this.firstFormGroup.get('remarks').value;
    }

    (this.applicationData.lob = this.lob),
      (this.applicationData.productType = this.productType),
      (this.applicationData.productId = this.firstFormGroup.get('productName').value);
    this.applicationData.productName = this.productName;
    (this.applicationData.insurerId = this.insurerId),
      (this.applicationData.insurerName = this.insurerName),
      (this.applicationData.statusCode = this.firstFormGroup.get('status').value);
    // this.applicationData.applicationData.policyAddress.addressType = 'PERMANENT',
    (this.applicationData.applicationData.policyAddress.addressline1 = this.summaryFormGroup.get(
      'summaryPolicyaddressline1',
    ).value),
      (this.applicationData.applicationData.policyAddress.addressline2 = this.summaryFormGroup.get(
        'summaryPolicyaddressline2',
      ).value),
      (this.applicationData.applicationData.policyAddress.addressline3 = this.summaryFormGroup.get(
        'summaryPolicyaddressline3',
      ).value),
      (this.applicationData.applicationData.policyAddress.city =
        this.summaryFormGroup.get('summaryPolicycity').value),
      // this.applicationData.applicationData.policyAddress.country = this.country,
      // this.applicationData.applicationData.policyAddress.countryCode = this.countryCode,
      (this.applicationData.applicationData.policyAddress.postalcode =
        this.summaryFormGroup.get('summaryPolicypostalcode').value);
    (this.applicationData.applicationData.mailingAddress.addressline1 = this.summaryFormGroup.get(
      'summaryMailingaddressline1',
    ).value),
      (this.applicationData.applicationData.mailingAddress.addressline2 = this.summaryFormGroup.get(
        'summaryMailingaddressline2',
      ).value),
      (this.applicationData.applicationData.mailingAddress.addressline3 = this.summaryFormGroup.get(
        'summaryMailingaddressline3',
      ).value),
      (this.applicationData.applicationData.mailingAddress.city =
        this.summaryFormGroup.get('summaryMailingcity').value),
      // this.applicationData.applicationData.mailingAddress.country = this.country,
      // this.applicationData.applicationData.mailingAddress.countryCode = this.countryCode,
      (this.applicationData.applicationData.mailingAddress.postalcode = this.summaryFormGroup.get(
        'summaryMailingpostalcode',
      ).value);
    // console.log(this.applicationData);
    this.loaderService.showSpinner(true);
    this.offlinePoliciesService.updateOfflineApplication(this.applicationData).subscribe(
      (result: any) => {
        this.loaderService.showSpinner(false);
        const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
          data: 'Lead Status Updated Successfully',
          panelClass: 'dialog-width',
        });
        dialogRef.afterClosed().subscribe((data) => {
          // navigate
          this.router.navigate(['/offline-policies']);
        });
      },
      (error) => {
        this.showSubmitErrorMessage = true;
        this.submitErrorMessage = 'Error while submitting the form. Please try after sometime.';
        this.loaderService.showSpinner(false);
      },
    );
  }

  initiatePayment() {
    let instrumentDate;
    const paymentType = this.paymentForm.get('paymentType').value;
    if (paymentType !== 'DBT') {
      const checkDate = new Date(this.paymentForm.get('chkOrDDDate').value);
      instrumentDate =
        checkDate.getFullYear() +
        '-' +
        ('0' + (checkDate.getMonth() + 1)).slice(-2) +
        '-' +
        ('0' + checkDate.getDate()).slice(-2);
    }
    paymentType === 'CHQ' ? console.log() : console.log('hi');
    const paymentBody = {
      paymentType,
      cifNo: paymentType === 'DBT' ? this.accountDetails[0].cifNo : undefined,
      accountNo: paymentType === 'DBT' ? this.paymentForm.get('accountNumber').value : undefined,
      instrumentDate,
      instrumentNo: paymentType !== 'DBT' ? this.paymentForm.get('chequeOrDDNo').value : undefined,
      ifscCode: paymentType !== 'DBT' ? this.paymentForm.get('ifscCode').value : undefined,
      micrCode: paymentType !== 'DBT' ? this.paymentForm.get('micrCode').value : undefined,
      paymentRefNo: paymentType === 'DBT' ? this.paymentForm.get('referenceNo').value : undefined,
      insurerId: this.applicationData.insurerCode,
      premiumPayable: this.firstFormGroup.get('premiumAmount').value,
      appNo: this.applicationData.applicationNo,
      paymentDate: this.paymentForm.get('dateOfPayment').value,
    };

    this.applicationData.applicationData.paymentInfo = paymentBody;
  }

  navigateToEditScreen(stepper: MatStepper, screenIndex, screenIndex2) {
    if (this.showPaymentInfo) {
      stepper.selectedIndex = screenIndex2;
    } else {
      stepper.selectedIndex = screenIndex;
    }
  }

  inputEvent(event) {
    // tslint:disable-next-line: no-shadowed-variable
    const moment = require('moment');
    const newDate = new Date(event.value);
    this.secondFormGroup.get('dob').setValue(moment(newDate).format('YYYY-MM-DD'));
  }

  inputEvent2(event) {
    // tslint:disable-next-line: no-shadowed-variable
    const moment = require('moment');
    const newDate = new Date(event.value);
    this.firstFormGroup.get('policyStartDate').setValue(moment(newDate).format('YYYY-MM-DD'));
    if (this.firstFormGroup.get('pt').value !== null) {
      // this.firstFormGroup.get('policyEndDate').setValue(null);
      this.onPTChanged(this.firstFormGroup.get('pt').value);
    } else {
      this.firstFormGroup.get('policyEndDate').setValue(null);
    }
    // this.minEndDate = new Date(policyStartYear, policyStartMonth, policyStartDay);
    this.minEndDate = new Date(event.value);
    // console.log('minimum policy end date', this.minEndDate);
  }

  inputEvent3(event) {
    // tslint:disable-next-line: no-shadowed-variable
    const moment = require('moment');
    const newDate = new Date(event.value);
    this.firstFormGroup.get('policyEndDate').setValue(moment(newDate).format('YYYY-MM-DD'));
  }

  generateFormFields() {
    console.log('coming here');
    if (this.applicationData?.statusCode === 9) {
      this.paymentForm = new FormGroup({});
      this.paymentForm.addControl(
        'paymentType',
        new FormControl({
          value: this.applicationData.applicationData?.paymentInfo?.paymentType,
          disabled: true,
        }),
      );
      this.paymentForm.addControl(
        'accountNumber',
        new FormControl({
          value: this.applicationData.applicationData?.paymentInfo?.accountNo,
          disabled: true,
        }),
      );
      this.paymentForm.addControl(
        'chequeOrDDNo',
        new FormControl({
          value: this.applicationData.applicationData?.paymentInfo?.instrumentNo,
          disabled: true,
        }),
      );
      this.paymentForm.addControl(
        'chkOrDDDate',
        new FormControl({
          value: this.applicationData.applicationData?.paymentInfo?.instrumentDate,
          disabled: true,
        }),
      );
      this.paymentForm.addControl(
        'ifscCode',
        new FormControl({
          value: this.applicationData.applicationData?.paymentInfo?.ifscCode,
          disabled: true,
        }),
      );
      this.paymentForm.addControl(
        'micrCode',
        new FormControl({
          value: this.applicationData.applicationData?.paymentInfo?.micrCode,
          disabled: true,
        }),
      );
      this.paymentForm.addControl(
        'referenceNo',
        new FormControl({
          value: this.applicationData?.applicationData?.paymentInfo?.paymentRefNo,
          disabled: true,
        }),
      );
      this.paymentForm.addControl(
        'premiumPayable',
        new FormControl(this.applicationData.premiumAmount),
      );
      this.paymentForm.addControl('insurerName', new FormControl(this.applicationData.insurerName));
      this.paymentForm.addControl(
        'customerName',
        new FormControl(
          this.applicationData.applicationData.proposer?.firstName +
            ' ' +
            this.applicationData.applicationData.proposer?.lastName,
        ),
      );
      this.paymentForm.addControl(
        'dateOfPayment',
        new FormControl({
          value: this.applicationData.applicationData.paymentInfo?.paymentDate,
          disabled: true,
        }),
      );
    } else {
      const today = new Date();
      if (this.accountDetails && this.accountDetails.length > 0) {
        console.log('step 1');
        this.paymentForm = new FormGroup({});
        this.paymentForm.addControl('paymentType', new FormControl('DBT', Validators.required));
        this.paymentForm.addControl(
          'accountNumber',
          new FormControl(this.accountDetails[0].accountNo),
        );
        this.paymentForm.addControl(
          'referenceNo',
          new FormControl(this.applicationData.applicationData?.paymentInfo?.referenceNo),
        );
        // console.log('step 2');
      } else {
        this.checkPaymentType = false;
        console.log('step 2');
        this.paymentForm = new FormGroup({});
        this.paymentForm.addControl('paymentType', new FormControl('CHQ', [Validators.required]));
        this.paymentForm.addControl(
          'chequeOrDDNo',
          new FormControl('', [Validators.required, Validators.pattern(/[0-9]{6}/)]),
        );
        this.paymentForm.addControl('chkOrDDDate', new FormControl('', [Validators.required]));
        this.paymentForm.addControl(
          'ifscCode',
          new FormControl('', [Validators.required, Validators.pattern(/^[A-Z]{4}0[0-9]{6}$/)]),
        );
        this.paymentForm.addControl(
          'micrCode',
          new FormControl('', [Validators.required, Validators.pattern(/[0-9]{9}/)]),
        );
        // console.log('step 4');
      }
      // console.log('checked', this.applicationDetails);
      // this.paymentForm.addControl('confirmationConsent', new FormControl(null, Validators.required));
      this.paymentForm.addControl(
        'premiumPayable',
        new FormControl(this.applicationData.premiumAmount),
      );
      this.paymentForm.addControl('insurerName', new FormControl(this.applicationData.insurerName));
      this.paymentForm.addControl(
        'customerName',
        new FormControl(
          this.applicationData.applicationData.proposer?.firstName +
            ' ' +
            this.applicationData.applicationData.proposer?.lastName,
        ),
      );
      this.paymentForm.addControl(
        'dateOfPayment',
        new FormControl(today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear()),
      );
      console.log('last step is aslo working fine..', this.paymentForm);
    }
  }

  onPaymentMethodChange(event) {
    // let check = true;
    if (event.value === 'DBT') {
      console.log('check value', this.checkPaymentType);
      this.paymentForm.addControl(
        'accountNumber',
        new FormControl(this.accountDetails[0].accountNo, Validators.required),
      );
      this.paymentForm.removeControl('chequeOrDDNo');
      this.paymentForm.removeControl('chkOrDDDate');
      this.paymentForm.removeControl('ifscCode');
      this.paymentForm.removeControl('micrCode');
    } else if (event.value === 'CHQ') {
      this.paymentForm.removeControl('accountNumber');
      this.paymentForm.removeControl('chequeOrDDNo');
      this.paymentForm.removeControl('chkOrDDDate');
      this.paymentForm.removeControl('ifscCode');
      this.paymentForm.removeControl('micrCode');
      this.paymentForm.addControl(
        'chequeOrDDNo',
        new FormControl('', [Validators.required, Validators.pattern(/[0-9]{6}/)]),
      );
      this.paymentForm.addControl('chkOrDDDate', new FormControl('', [Validators.required]));
      this.paymentForm.addControl(
        'ifscCode',
        new FormControl('', [Validators.required, Validators.pattern(/^[A-Z]{4}0[0-9]{6}$/)]),
      );
      this.paymentForm.addControl(
        'micrCode',
        new FormControl('', [Validators.required, Validators.pattern(/[0-9]{9}/)]),
      );
    } else {
      this.paymentForm.removeControl('accountNumber');
      this.paymentForm.removeControl('chequeOrDDNo');
      this.paymentForm.removeControl('chkOrDDDate');
      this.paymentForm.removeControl('ifscCode');
      this.paymentForm.removeControl('micrCode');
      this.paymentForm.addControl(
        'chequeOrDDNo',
        new FormControl('', [Validators.required, Validators.pattern(/[0-9]{6}/)]),
      );
      this.paymentForm.addControl('chkOrDDDate', new FormControl('', [Validators.required]));
      this.paymentForm.addControl(
        'ifscCode',
        new FormControl('', [Validators.pattern(/^[A-Z]{4}0[0-9]{6}$/)]),
      );
      this.paymentForm.addControl(
        'micrCode',
        new FormControl('', [Validators.pattern(/[0-9]{9}/)]),
      );
    }
  }

  createPaymentInfoSummary() {
    if (this.firstFormGroup.get('status').value === 9) {
      this.summaryFormGroup.addControl(
        'summarypaymentType',
        new FormControl(this.paymentForm.get('paymentType').value),
      );
      if (this.paymentForm.get('paymentType').value === 'DBT') {
        this.summaryFormGroup.addControl(
          'summaryaccountNumber',
          new FormControl(this.paymentForm.get('accountNumber').value),
        );
        this.summaryFormGroup.addControl(
          'summaryreferenceNo',
          new FormControl(this.paymentForm.get('referenceNo').value),
        );
        this.summaryFormGroup.removeControl('summarychequeOrDDNo');
        this.summaryFormGroup.removeControl('summarychkOrDDDate');
        this.summaryFormGroup.removeControl('summaryifscCode');
        this.summaryFormGroup.removeControl('summarymicrCode');
      } else {
        this.summaryFormGroup.removeControl('summaryaccountNumber');
        this.summaryFormGroup.removeControl('summaryreferenceNo');
        this.summaryFormGroup.addControl(
          'summarychequeOrDDNo',
          new FormControl(this.paymentForm.get('chequeOrDDNo').value),
        );
        this.summaryFormGroup.addControl(
          'summarychkOrDDDate',
          new FormControl(moment(this.paymentForm.get('chkOrDDDate').value).format('YYYY-MM-DD')),
        );
        this.summaryFormGroup.addControl(
          'summaryifscCode',
          new FormControl(this.paymentForm.get('ifscCode').value),
        );
        this.summaryFormGroup.addControl(
          'summarymicrCode',
          new FormControl(this.paymentForm.get('micrCode').value),
        );
      }
      this.summaryFormGroup.addControl(
        'summarypremiumPayable',
        new FormControl(this.paymentForm.get('premiumPayable').value),
      );
      this.summaryFormGroup.addControl(
        'summaryinsurerName',
        new FormControl(this.paymentForm.get('insurerName').value),
      );
      this.summaryFormGroup.addControl(
        'summarycustomerName',
        new FormControl(this.paymentForm.get('customerName').value),
      );
      this.summaryFormGroup.addControl(
        'summarydateOfPayment',
        new FormControl(moment(this.paymentForm.get('dateOfPayment').value).format('YYYY-MM-DD')),
      );
    } else {
      this.summaryFormGroup.removeControl('summarypaymentType');
      this.summaryFormGroup.removeControl('summaryaccountNumber');
      this.summaryFormGroup.removeControl('summarychequeOrDDNo');
      this.summaryFormGroup.removeControl('summarychkOrDDDate');
      this.summaryFormGroup.removeControl('summaryifscCode');
      this.summaryFormGroup.removeControl('summarymicrCode');
      this.summaryFormGroup.removeControl('summaryreferenceNo');
      this.summaryFormGroup.removeControl('summarypremiumPayable');
      this.summaryFormGroup.removeControl('summaryinsurerName');
      this.summaryFormGroup.removeControl('summarycustomerName');
      this.summaryFormGroup.removeControl('summarydateOfPayment');
    }
  }

  onPTChanged(value) {
    if (this.isInsurerUser) {
      if (value !== '' && this.firstFormGroup.get('policyStartDate').value !== null) {
        // tslint:disable-next-line: no-shadowed-variable
        const moment = require('moment');
        const newDate = new Date(this.firstFormGroup.get('policyStartDate').value);
        // var currentDate = moment('2015-10-30');
        const endDate = moment(newDate).add(value, 'Y');
        endDate.subtract(1, 'days');
        console.log(endDate);
        this.firstFormGroup.get('policyEndDate').setValue(moment(endDate).format('YYYY-MM-DD'));
      }
    }
  }

  onPPTChanged(value) {
    if (value !== '' && this.firstFormGroup.get('pt').value !== '') {
      const ptValue = this.firstFormGroup.get('pt').value;
      console.log(typeof value);
      console.log(typeof ptValue);
      if (this.isInsurerUser) {
        // tslint:disable-next-line: radix
        if (parseInt(value) > parseInt(ptValue)) {
          this.firstFormGroup
            .get('ppt')
            .setValidators([
              Validators.required,
              Validators.pattern('^[1-9]\\d*$'),
              Validators.max(ptValue),
            ]);
        } else {
          this.firstFormGroup
            .get('ppt')
            .setValidators([
              Validators.required,
              Validators.pattern('^[1-9]\\d*$'),
              Validators.max(99),
            ]);
        }
        this.firstFormGroup.get('ppt').updateValueAndValidity();
      } else if (this.isBranchUser) {
        // tslint:disable-next-line: radix
        if (parseInt(value) > parseInt(ptValue)) {
          this.firstFormGroup
            .get('ppt')
            .setValidators([Validators.pattern('^[1-9]\\d*$'), Validators.max(ptValue)]);
        } else {
          this.firstFormGroup
            .get('ppt')
            .setValidators([Validators.pattern('^[1-9]\\d*$'), Validators.max(99)]);
        }
      }
      this.firstFormGroup.get('ppt').updateValueAndValidity();
    }
  }

  onPostalCodeChange(pincode, index) {
    if (pincode.length === 6) {
      this.loaderService.showSpinner(true);
      this.offlinePoliciesService.getCityAndState(pincode).subscribe(
        (postalcode) => {
          if (!index) {
            this.thirdFormGroup.get('policycity').setValue(postalcode.city);
            this.thirdFormGroup.get('policystate').setValue(postalcode.stateName);
          } else {
            this.thirdFormGroup.get('mailingcity').setValue(postalcode.city);
            this.thirdFormGroup.get('mailingstate').setValue(postalcode.stateName);
          }
          this.loaderService.showSpinner(false);
        },
        (err) => {
          this.loaderService.showSpinner(false);
        },
      );
    } else {
      if (!index) {
        this.thirdFormGroup.get('policycity').setValue(null);
        this.thirdFormGroup.get('policystate').setValue(null);
      } else {
        this.thirdFormGroup.get('mailingcity').setValue(null);
        this.thirdFormGroup.get('mailingstate').setValue(null);
      }
    }
  }

  onRadioChange(event) {
    const postalcodeRegex: RegExp = /^[1-9]{1}[0-9]{5,5}$/;
    if (event.value === 'yes') {
      this.thirdFormGroup.removeControl('mailingaddressline1');
      this.thirdFormGroup.removeControl('mailingaddressline2');
      this.thirdFormGroup.removeControl('mailingaddressline3');
      this.thirdFormGroup.removeControl('mailingpostalcode');
      this.thirdFormGroup.removeControl('mailingcity');
      this.thirdFormGroup.removeControl('mailingstate');
    } else {
      this.thirdFormGroup.addControl(
        'mailingaddressline1',
        new FormControl(this.thirdFormGroup.get('policyaddressline1').value, Validators.required),
      );
      this.thirdFormGroup.addControl(
        'mailingaddressline2',
        new FormControl(this.thirdFormGroup.get('policyaddressline2').value, Validators.required),
      );
      this.thirdFormGroup.addControl(
        'mailingaddressline3',
        new FormControl(this.thirdFormGroup.get('policyaddressline3').value),
      );
      this.thirdFormGroup.addControl(
        'mailingpostalcode',
        new FormControl(this.thirdFormGroup.get('policypostalcode').value, [
          Validators.required,
          Validators.pattern(postalcodeRegex),
        ]),
      );
      this.thirdFormGroup.addControl(
        'mailingcity',
        new FormControl(this.thirdFormGroup.get('policycity').value, Validators.required),
      );
      this.thirdFormGroup.addControl(
        'mailingstate',
        new FormControl(this.thirdFormGroup.get('policystate').value, Validators.required),
      );
    }
  }

  MinDate(): Date {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDay();

    return new Date(currentYear - 100, currentMonth, currentDay);
  }

  loadData() {}

  private getValidationMsg() {
    return {
      pt: [
        { type: 'required', message: 'Policy Term is required' },
        { type: 'pattern', message: 'Policy Term cannot be zero: Start from 1 not zero' },
        // { type: 'min', message: 'Policy Term cannot be zero: Start from 1 not zero' },
        { type: 'max', message: 'Policy Term cannot be greater than 99 years' },
      ],
      confirmpt: [
        { type: 'mustMatch', message: 'Confirm Policy Term should match with Policy Term' },
      ],
      ppt: [
        { type: 'required', message: 'Premium Paying Term is required' },
        { type: 'pattern', message: 'Premium Paying Term cannot be zero: Start from 1 not zero' },
        // { type: 'min', message: 'Premium Paying Term cannot be zero: Start from 1 not zero' },
        {
          type: 'max',
          message:
            'Premium Paying Term cannot be more than Policy Term/Premium Paying Term cannot be greater than 99 years',
        },
      ],
      confirmppt: [
        {
          type: 'mustMatch',
          message: 'Confirm Premium Paying Term should match with Premium Paying Term',
        },
      ],
      policyNo: [{ type: 'required', message: 'Policy Number is required' }],
      policyStartDate: [{ type: 'required', message: 'Policy Start Date is required' }],
      policyEndDate: [{ type: 'required', message: 'Policy End Date is required' }],
      remarks: [{ type: 'required', message: 'Remarks is required' }],
      status: [{ type: 'required', message: 'Status is required' }],
      insurerApplicationNo: [{ type: 'required', message: 'Insurer Application No is required' }],
      insurer: [{ type: 'required', message: 'Insurer is required' }],
      product: [{ type: 'required', message: 'Product is required' }],
      productName: [{ type: 'required', message: 'Product Name is required' }],
      sp: [{ type: 'required', message: 'SP is required' }],
      lgCode: [{ type: 'required', message: 'Lead Generator is required' }],
      mode: [{ type: 'required', message: 'Mode is required' }],
      premiumAmount: [
        { type: 'required', message: 'Total Premium is required' },
        { type: 'pattern', message: 'Total Premium is invalid' },
        { type: 'checkTotal', message: 'Total Premium cannot be less than Base Premium' },
      ],
      confirmpremiumAmount: [
        { type: 'mustMatch', message: 'Confirm Total Premium should match with Total Premium ' },
      ],
      basePremium: [
        { type: 'required', message: 'Base Premium is required' },
        { type: 'pattern', message: 'Base Premium is invalid' },
        { type: 'max', message: 'Base Premium cannot be more than Total Premium' },
      ],
      gst: [
        { type: 'required', message: 'GST is required' },
        { type: 'pattern', message: 'GST is invalid' },
        { type: 'max', message: 'GST cannot be more than Base Premium or Total Premium' },
        { type: 'mustMatch', message: 'Total Premium should match with Base Premium and GST' },
      ],
      branchCode: [{ type: 'required', message: 'Branch Code is required' }],
      title: [
        { type: 'required', message: 'Title is required' },
        { type: 'pattern', message: 'Ttile is invalid' },
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
      mobile: [
        { type: 'required', message: this.translateService.instant('error.MOBILE_REQUIRED') },
        { type: 'pattern', message: this.translateService.instant('error.MOBILE_INVALID') },
        { type: 'minlength', message: this.translateService.instant('error.MOBILE_MIN') },
        { type: 'maxlength', message: this.translateService.instant('error.MOBILE_MAX') },
      ],
      email: [
        { type: 'required', message: this.translateService.instant('error.EMAIL_REQUIRED') },
        { type: 'email', message: this.translateService.instant('error.EMAIL_INVALID') },
      ],
      maritalStatus: [
        { type: 'required', message: 'Marital Status is required' },
        { type: 'pattern', message: 'Marital Status is invalid' },
      ],
      occupation: [{ type: 'required', message: 'Occupation is required' }],
      panNo: [
        { type: 'required', message: 'Pan Card is required' },
        { type: 'pattern', message: 'Pan Card is invalid' },
      ],
      nomineeTitle: [{ type: 'required', message: 'Title is required' }],
      nomineeFirstName: [
        { type: 'required', message: this.translateService.instant('error.FIRST_NAME_REQUIRED') },
        { type: 'minlength', message: this.translateService.instant('error.FIRST_NAME_MAX') },
        { type: 'maxlength', message: this.translateService.instant('error.FIRST_NAME_MAX') },
      ],
      nomineeLastName: [
        { type: 'required', message: this.translateService.instant('error.LAST_NAME_REQUIRED') },
        { type: 'minlength', message: this.translateService.instant('error.LAST_NAME_MIN') },
        { type: 'maxlength', message: this.translateService.instant('error.LAST_NAME_MAX') },
      ],
      nomineeDOB: [
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
      nomineeGender: [
        { type: 'required', message: this.translateService.instant('error.GENDER_REQUIRED') },
        { type: 'pattern', message: this.translateService.instant('error.GENDER_INVALID') },
      ],
      nomineeRelationship: [{ type: 'required', message: 'Nominee Relationship is required' }],
      addressSame: [
        { type: 'required', message: this.translateService.instant('error.ADDRESS_TYPE') },
      ],
      policyaddressline1: [
        {
          type: 'required',
          message: this.translateService.instant('error.ADDRESS_LINE1_REQUIRED'),
        },
        { type: 'minlength', message: 'Address Line should have minimum of 1 Character' },
        { type: 'maxlength', message: this.translateService.instant('error.ADDRESS_LINE1_MAX') },
      ],
      policyaddressline2: [
        {
          type: 'required',
          message: this.translateService.instant('error.ADDRESS_LINE2_REQUIRED'),
        },
        { type: 'minlength', message: 'Address Line should have minimum of 1 Character' },
        { type: 'maxlength', message: this.translateService.instant('error.ADDRESS_LINE2_MAX') },
      ],
      policyaddressline3: [
        { type: 'maxlength', message: this.translateService.instant('error.ADDRESS_LINE3_MAX') },
      ],
      policypostalcode: [
        { type: 'required', message: this.translateService.instant('error.POSTALCODE_REQUIRED') },
        { type: 'pattern', message: this.translateService.instant('error.POSTALCODE_INVALID') },
      ],
      policycity: [
        { type: 'required', message: this.translateService.instant('error.CITY_REQUIRED') },
      ],
      policystate: [
        { type: 'required', message: this.translateService.instant('error.STATE_REQUIRED') },
      ],
      mailingaddressline1: [
        {
          type: 'required',
          message: this.translateService.instant('error.ADDRESS_LINE1_REQUIRED'),
        },
        { type: 'minlength', message: 'Address Line should have minimum of 1 Character' },
        { type: 'maxlength', message: this.translateService.instant('error.ADDRESS_LINE1_MAX') },
      ],
      mailingaddressline2: [
        {
          type: 'required',
          message: this.translateService.instant('error.ADDRESS_LINE2_REQUIRED'),
        },
        { type: 'minlength', message: 'Address Line should have minimum of 1 Character' },
        { type: 'maxlength', message: this.translateService.instant('error.ADDRESS_LINE2_MAX') },
      ],
      mailingaddressline3: [
        { type: 'maxlength', message: this.translateService.instant('error.ADDRESS_LINE3_MAX') },
      ],
      mailingpostalcode: [
        { type: 'required', message: this.translateService.instant('error.POSTALCODE_REQUIRED') },
        { type: 'pattern', message: this.translateService.instant('error.POSTALCODE_INVALID') },
      ],
      mailingcity: [
        { type: 'required', message: this.translateService.instant('error.CITY_REQUIRED') },
      ],
      mailingstate: [
        { type: 'required', message: this.translateService.instant('error.STATE_REQUIRED') },
      ],
    };
  }
}
