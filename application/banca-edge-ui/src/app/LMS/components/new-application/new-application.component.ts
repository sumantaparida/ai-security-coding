import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, PatternValidator } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslatePipe, TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { User } from '@app/_models';
import { AccountService, TokenService } from '@app/_services';
import { LoaderService } from '@app/_services/loader.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ViewChild } from '@angular/core';

import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MY_FORMATS } from '../../../shared/utils/moment';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';
import { LmsService } from '@app/LMS/services/lms.service';
import { OtpModalComponent } from '@app/shared/components/otp-modal/otp-modal.component';
import { ModalComponent } from '@app/LMS/lms/modal-comnponent/modal.component';
import { ConsentModalComponent } from '../consent-modal/consent-modal.component';
import { FormBuilder } from '@angular/forms';

import { NeedInvestmentComponent } from '../need-investment/need-investment.component';
import { DOC_ORIENTATION, NgxImageCompressService } from 'ngx-image-compress';

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

  isHdfcLife;

  submitDisable = false;

  insuredTitleDropdown;

  checkProposalResponseApiSubscription: Subscription;

  public validationMessages = {};

  maxAdultDate: Date;

  flsDropDown;

  insurerDropdown;

  productDropdown;

  spDropdown;

  selectedInsurerId;

  showProposer = false;

  showContactInfo = false;

  showSummary = false;

  quoteData;

  productKey;

  appNo;

  remainingField = false;

  panCardReadOnly = false;

  firstFormGroup: FormGroup;

  secondFormGroup: FormGroup;

  thirdFormGroup: FormGroup;

  summaryFormGroup: FormGroup;

  paymentForm: FormGroup;

  miscellaneousForm: FormGroup;

  maritalStatusDropdown;

  momineeRelationshipDropdown;

  occupationDropdown;

  riskApetite;

  annualIncomeMandatory = false;

  genderDropDown;

  askFormC = false;

  askLeadConverted = false;

  showCIDFOnlyForLife = false;

  modeDropdown = [
    { id: '1', value: 'Annual' },
    { id: '2', value: 'Half Yearly' },
    { id: '4', value: 'Quarterly' },
    { id: '12', value: 'Monthly' },
  ];

  statusDropDown: any[] = [];

  statusDropDownVal = [
    { id: 1, value: 'LEAD' },
    { id: 2, value: 'LOGGED IN' },
    { id: 3, value: 'REJECTED BY CUSTOMER' },
    { id: 4, value: 'UW PENDING' },
    { id: 9, value: 'ISSUED/IN FORCE' },
    { id: 11, value: 'FOLLOW UP' },
    { id: 6, value: 'DECLINED/POSTPONED' },
    { id: 12, value: 'AWAITING DOCUMENTATION' },
    { id: 24, value: 'AWAITING CUSTOMER CONSENT' },
  ];

  csbStatusDropDownVal = [
    { id: 2, value: 'LOGGED IN' },
    { id: 4, value: 'UW PENDING' },
    { id: 9, value: 'ISSUED/IN FORCE' },
    { id: 12, value: 'AWAITING DOCUMENTATION' },
  ];

  csbDefaultStatus = "";

  titleArray;

  maritalStatusArray;

  checkPaymentType = true;

  lgDropDown;

  lgName;

  spName;

  files = [];

  insuranceProducts;
  leadbatchMli = false;

  paymentTypes = [
    { id: 'DBT', value: 'Direct Debit' },
    { id: 'CHQ', value: 'Cheque' },
    { id: 'DD', value: 'Demand Draft' },
    { id: 'OP', value: 'Online Payment' },
  ];

  paymentMethods = [
    { id: 1, value: 'Credit Card' },
    { id: 1, value: 'Debit Card' },
    { id: 1, value: 'Net Banking' },
    { id: 4, value: 'Payment Wallets' },
    { id: 5, value: 'NEFT/RTGS/IMPS' },
    { id: 6, value: 'UPI' },
    { id: 7, value: 'EMI' },
  ];

  insuranceProductsCopy;

  lob;

  proposerRelationShip;

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

  isDcbUser;

  isSbUser;

  policyMailingAddressSame;

  statusCheckOnChange = false;

  frmData = new FormData();

  policyState;

  mailingState;

  loggedIn = false;

  notSame = false;

  isProposerInsured = true;

  agentCode;

  createFormData;

  rowId;

  isSumAssured = false;

  isBom = false;

  checkboxForm;

  flsName;

  newFiles;

  physicalJourney;

  physicalJourneyNonLife;

  @ViewChild('stepper', { static: false }) myStepper: MatStepper;

  myFiles = [];

  totalSize = 0;

  fileUploadError = false;

  riskProfile = '';

  displayFileName = [];

  user;

  pptLabel = 'Premium Paying Term';

  confirmPptLabel = 'Confirm Premium Paying Term';

  lobLabel = 'LOB';

  modeLable = 'Mode';

  ddNumberLabel = 'DD Number';

  ddDateLabel = 'DD Date';

  isSingleMode = false;

  panMandatory = false;

  onlySib = false;

  isOdFields = false;

  isCsbUser;

  lgTag;

  flsNotRequired = false;

  isMli = false;

  submitClicked = false;

  planCompleted;

  isIndividual = true;

  allFile;

  newPdf;

  insurerIdWhileCreatingLead;

  lifeType;

  showSubmitBtn = true;

  proposerRelationShipCopy;

  flsNotRequiredArr = { DCB: ['104', '109', '115', '102', '153','113'], CSB: ['104'], SIB: ['104'] };

  retryCount = 0;

  maxRetries = 3;

  intervalTime = 3000;

  customerConsent = false;

  panNoNewRegex = '[A-Z]{5}[0-9]{4}[A-Z]{1}';

  panNoOldRegex = '^[A-Za-z]{3}[ABCFGHLJPTKabcfghljptk][A-Za-z][0-9]{4}[A-Za-z]$';

  isDownloadCIDF;

  LeadTagDropdown = [
    { id: 'FLS Lead', value: 'FLS Lead' },
    { id: 'Branch Lead', value: 'Branch Lead' },
  ];

  showLeadTag = false;
  showMiddleName = true;

  showRemarks = true;
  rfActive = false;

  consentAlreadySubmitted = false;
  constructor(
    public dialog: MatDialog,
    public lmsService: LmsService,
    private translateService: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private accountService: AccountService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private imageCompress: NgxImageCompressService,
    private tokenService: TokenService,
  ) {
    breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).subscribe((result) => {
      this.smallScreen = result.matches;
    });

    this.validationMessages = this.getValidationMsg();
    translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.validationMessages = this.getValidationMsg();
    });
    this.accountService.user.subscribe((x) => (this.user = x));
    // if (this.user?.organizationCode === 'DCB') {
    //   this.lgTag = 'Buddy';
    // } else this.lgTag = 'Lead Generator';
  }

  ngOnInit() {
    // document.getElementById('nextBtnId').style.backgroundColor = 'green';
    // console.log('time', moment(new Date()).format('YYYY-MM-DD hh:mm:ss'));

    this.currentDate = moment().format('YYYY-MM-DD');
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDate();
    this.todaysDate = new Date(currentYear, currentMonth, currentDay);
    console.log(`Current Date`, this.currentDate);
    console.log(`Todays Date`, this.todaysDate);
    this.threeMonthsBack = new Date(currentYear, currentMonth - 3, currentDay);
    console.log(this.todaysDate);

    this.past = new Date(currentYear - 5, currentMonth, currentDay);
    this.currentAndFutureday = new Date(currentYear + 5, currentMonth, currentDay);
    this.minEndDate = new Date(currentYear + 15, currentMonth, currentDay);
    this.orgCode = this.user?.organizationCode;


    

    if (this.orgCode === 'DCB') {
      this.maxAdultDate = new Date(currentYear, currentMonth, currentDay);
      this.lgTag = 'Buddy';
    } else {
      this.maxAdultDate = new Date(currentYear - 1, currentMonth, currentDay);
      this.lgTag = 'Lead Generator';
    }
    if (this.orgCode !== 'DCB') {
      this.modeDropdown.push({ id: '0', value: 'Single' });
    }
    if (this.orgCode === 'SIB') {
      this.statusDropDown.push({ id: 7, value: 'PAYMENT PENDING' });
      this.pptLabel = 'Tenor(PPT)';
      this.confirmPptLabel = 'Confirm Tenor(PPT)';
      this.lobLabel = 'CATEGORY';
      this.modeLable = 'Payment Frequency';
      this.paymentTypes.forEach((arr) => {
        if (arr.id === 'CHQ') {
          arr.value = 'SIB Cheque';
        } else if (arr.id === 'DD') {
          arr.value = 'Other Bank Cheque';
        } else if (arr.id === 'OP') {
          arr.value = 'Online';
        }
      });
      this.ddNumberLabel = 'Cheque Number';
      this.ddDateLabel = 'Cheque Date';
    }
    this.loaderService.showSpinner(true);
    this.route.params.subscribe((params) => {
      console.log(`PARAMS`, params);
      if (params.customerId) {
        this.customerId = params.customerId;
      } else {
        this.customerId = null;
      }
      if (params.sibConsent) {
        console.log('trueeeeSIB');
        this.orgCode = params.orgCode;
        this.isBranchUser = true;
        this.customerConsent = true;
        this.isInsurerUser = false;
        this.panCardReadOnly = true;
        this.optionalField = false;
      }
      
      if (params.appNo) {
        console.log('APPNO');

        this.appNo = params.appNo;
        this.showSubmitBtn = this.orgCode === 'DCB' ? false : true;
        if(this.orgCode === 'CSB'){
            this.statusDropDown = [];
        }else{
            this.statusDropDown = this.statusDropDownVal;
        }
        
        this.getOfflineApplicationByAppNo();
        // commented as per SIB requiremnet , they may want this again
        // if (this.orgCode === 'SIB') {
        //   this.isInsurerUser = true;
        // }
      } else {
        this.appNo = null;
        if(this.orgCode != "CSB"){
          this.statusDropDown = this.statusDropDownVal;
        }else{
          this.fetchStatusDropDown();
        }
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
      if (params.journey === 'physical') {
        this.physicalJourney = true;
      } else {
        this.physicalJourney = false;
      }

      if (params.isLife) {
        this.lifeType = params?.isLife;
      }

      if (params.journey === 'physical' && params.isLife === 'nonLife') {
        this.physicalJourneyNonLife = true;
      }

      this.currentUser = this.accountService.userValue;

      console.log("check this user value = ", this.currentUser);
      // if (this.orgCode !== 'SIB') {
      if (this.currentUser['bankCustomer'] == 'false') {
        this.isBranchUser =
          this.currentUser['bankCustomer'] == 'false' && this.currentUser['insurerUser'] == 'false';
      } else if (this.currentUser['bankCustomer'] == false) {
        this.isBranchUser =
          this.currentUser['bankCustomer'] === false && this.currentUser['insurerUser'] === false;
      }
      // }

      // if (this.orgCode !== 'SIB') {
      if (this.currentUser['insurerUser'] == true || this.currentUser['insurerUser'] == 'true') {
        this.isInsurerUser = true;
      } else {
        this.isInsurerUser = false;
      }
      // }

      this.isDcbUser = this.currentUser?.organizationCode === 'DCB';
      this.isSbUser = this.currentUser?.organizationCode === 'SB';
      this.isCsbUser = this.currentUser?.organizationCode === 'CSB';

      this.showLeadTag = (this.isCsbUser && this.currentUser.userGroups.includes("CALL_CENTER"));
      
      this.showMiddleName = (this.isCsbUser || this.isDcbUser);

      

      // this.loaderService.showSpinner(false);

      if (
        (this.isBranchUser && this.appNo == null) ||
        (this.orgCode === 'SIB' && this.appNo == null)
      ) {
        this.lmsService.getCustomerById(this.customerId).subscribe((result) => {
          this.customerDetails = result;
          this.isIndividual = this.customerDetails?.isIndividual;
          this.planCompleted = this.customerDetails?.planCompleted;
          console.log('plan=', this.planCompleted, this.customerDetails);
          this.orgCode = this.customerDetails?.organizationCode;
          this.country = this.customerDetails?.addressList[0].country;
          if (this.customerDetails?.mobileNo === '') {
            // this.physicalJourney = true;
          } else {
            // this.physicalJourney = false;
          }
          console.log('physicalJourney=', this.physicalJourney);
          this.countryCode = this.customerDetails?.addressList[0].countryCode;
          // Getting Offline Insurers
          if (this.orgCode === 'DCB') {
            this.lmsService.getOfflineInsurersDcb(this.lifeType).subscribe((result2) => {
              console.log('Printing Offline Insurers', result2);
              this.insurerDropdown = result2;
              this.getLOBAndProductType();
              this.getLGData();
              console.log('Printing CustomerDetails', this.customerDetails);
            });
          } else {
            this.lmsService.getOfflineInsurers().subscribe((result2) => {
              console.log('Printing Offline Insurers', result2);
              this.insurerDropdown = result2;
              this.getLOBAndProductType();
              this.getLGData();
              console.log('Printing CustomerDetails', this.customerDetails);
            });
          }
        });
      }
    });
  }

  getOfflinePlans(insurer) {
    this.lmsService.getOfflinePlans(insurer).subscribe((data) => {
      this.loaderService.showSpinner(false);
      this.insuranceProductsCopy = data;
    });
  }

  getOfflineApplicationByAppNo() {
    this.lmsService.getOfflineApplicationByAppNo(this.appNo).subscribe(
      (result) => {
        this.applicationData = result;
        //check DCB concent already submitted

        this.consentAlreadySubmitted = !!this.applicationData?.applicationData?.consentSubmittedTime;
        // const spCode = this.applicationData.agencyData.spCode;
        this.rfActive = this.applicationData?.applicationData?.active;
        if (this.applicationData?.statusCode && this.orgCode == "CSB") {
          if(!this.rfActive && (this.applicationData?.statusCode === 26 || this.applicationData?.statusCode === 2 || this.applicationData?.statusCode === 4 || this.applicationData?.statusCode === 9 || this.applicationData?.statusCode === 12)){
            this.statusDropDown = this.csbStatusDropDownVal;
          }else{
            this.fetchStatusDropDown();
          }

          const exists = this.statusDropDown.some(
            (item) => item.id.toString() === this.applicationData.statusCode.toString()
          );
          
          if (!exists) {
            this.statusDropDown.unshift({
              id: this.applicationData.statusCode,
              value: this.applicationData.status
            });
          }
        }

        console.log("check this value status = ", this.statusDropDown);
       

        
        this.physicalJourney = this.applicationData?.applicationData?.physicalJourney;
        this.physicalJourneyNonLife = this.applicationData?.applicationData?.riskScore
          ? false
          : true;
        this.customerId = this.applicationData?.customerId;
        this.lmsService.getCustomerById(this.customerId).subscribe((custDetails) => {
          this.customerDetails = custDetails;
          this.isIndividual = custDetails['isIndividual'];
        });
        this.orgCode = this.applicationData?.orgCode;
        this.loaderService.showSpinner(true);

        if (this.applicationData.statusCode == 24) {
          this.optionalField = false;
        }


        this.flsDropDown = [
          {
            agentCode: this.applicationData?.applicationData?.agentCode,
            id: this.applicationData?.applicationData.flsCode,
            name: this.applicationData?.applicationData?.agencyData?.flsName,
            rowId: '',
          },
        ];

        console.log('Insurer Id', this.applicationData?.insurerCode);
        if (this.orgCode == 'CSB' && this.applicationData?.insurerCode === 104) {
          // this.statusDropDown = [
          //   { id: 1, value: 'LEAD' },
          //   { id: 2, value: 'LOGGED IN' },
          //   { id: 3, value: 'REJECTED BY CUSTOMER' },

          //   { id: 11, value: 'FOLLOW UP' },
          // ];
          this.askLeadConverted = true;
        }
        this.getOfflinePlans(this.applicationData?.insurerCode);
        this.lmsService.getOfflineInsurers().subscribe((insurer:any) => {
          if(this.customerConsent && this.orgCode == "DCB"){
            this.insurerDropdown = insurer?.length ? insurer : [{ id: this.applicationData?.insurerCode, value: this.applicationData?.insurerName }];
          }else{
            this.insurerDropdown = insurer;
          }
          
          // this.lmsService.getOfflinePlans().subscribe((data) => {
          //   this.loaderService.showSpinner(false);
          //   this.insuranceProductsCopy = data;
          // });
          this.getProducts();
          this.lob = this.applicationData?.lob;
          this.showCIDFOnlyForLife = (this.lob === "Life");
          this.productType = this.applicationData?.productType;
          this.insurerId = this.applicationData?.insurerId;
          this.insurerName = this.applicationData?.insurerName;
          this.productName = this.applicationData?.productName;
          this.isProposerInsured = this.applicationData?.applicationData?.proposerInsured;

          this.fetchMasters(this.applicationData?.productId);

          this.spDropdown = [
            {
              spCode: this.applicationData.spCode,
              spName: this.applicationData.applicationData?.agencyData?.spName,
            },
          ];

          this.leadbatchMli =
            this.orgCode === 'CSB' &&
            this.applicationData?.leadBatch &&
            this.applicationData.insurerCode == 104;

          this.createPolicyForm();
          if (
            (this.applicationData?.statusCode === 2 ||
              this.applicationData?.statusCode === 4 ||
              this.applicationData?.statusCode === 11 ||
              this.applicationData?.statusCode === 12) &&
            !this.leadbatchMli
          ) {
            this.optionalField = false;
            this.remainingField = true;
            
            this.createRemainingFormControl();
            
            if (this.orgCode === 'SB') {
              this.panCardReadOnly = false;
            } else {
              this.panCardReadOnly = true;
            }
          }
          if (
            this.applicationData?.statusCode === 3 ||
            this.applicationData?.statusCode === 6 ||
            this.applicationData?.statusCode === 9 ||
            // this.applicationData?.statusCode === 24 ||
            this.leadbatchMli ||
            this.customerConsent
          ) {
            this.loaderService.showSpinner(true);
            if (this.leadbatchMli) {
              this.statusDropDown.push({
                id: 0,
                value: this.applicationData?.leadBatch?.policyStatus,
              });

              this.firstFormGroup.get('status').setValue(0);
              // this.firstFormGroup.get('status').disable();
              this.firstFormGroup.updateValueAndValidity();
              console.log('thisssss', this.firstFormGroup.get('status'));
            } else {
              this.firstFormGroup.get('status').setValue(this.applicationData?.statusCode);
              this.firstFormGroup.updateValueAndValidity();
            }
            this.lmsService
              .getCityAndState(this.applicationData?.applicationData?.policyAddress?.postalcode)
              .subscribe((result3) => {
                this.policyState = result3.stateName;
              });
            this.lmsService
              .getCityAndState(this.applicationData?.applicationData?.mailingAddress?.postalcode)
              .subscribe((result4) => {
                this.mailingState = result4.stateName;
                this.optionalField = false;
                this.createRemainingFormControl();
                this.remainingField = true;
                if (this.orgCode === 'SB') {
                  this.panCardReadOnly = false;
                } else {
                  this.panCardReadOnly = true;
                }
                
                if(this.orgCode === "CSB"){
                    this.firstFormGroup.addControl(
                      'remarks',
                      new FormControl(
                        { value: this.applicationData?.remarks, disabled: true },
                        Validators.required,
                      ),
                    );
                }
                

                setTimeout(() => {
                  const screen =
                    this.applicationData?.statusCode === 9 ||
                    this.leadbatchMli ||
                    this.customerConsent
                      ? // this.applicationData?.statusCode === 24
                        4
                      : 3;
                  console.log('screen=', screen);
                  for (let i = 0; i <= screen; i++) {
                    this.goToNextScreen(this.myStepper, i);
                  }
                }, 100);
              });
          }else if(this.applicationData?.statusCode === 27 || this.applicationData?.statusCode === 28 || this.applicationData?.statusCode === 29){
            this.optionalField = false;
            this.remainingField = true;
            
            this.createRemainingFormControl();
            this.firstFormGroup.addControl(
              'remarks',
              new FormControl(
                { value: this.applicationData?.remarks, disabled: (this.applicationData?.statusCode == 28 || this.applicationData?.statusCode == 29) ? true : false },
                Validators.required,
              ),
            );
            this.firstFormGroup.removeControl('insurerApplicationNo');
              this.firstFormGroup.addControl(
              'insurerApplicationNo',
              new FormControl(this.applicationData?.insurerApplicationNo),
            );
          }
          this.getAccountDetails();
          this.errorLoadingApplicationDetails = false;
        });
        
      },
      (err) => {
        this.loaderService.showSpinner(false);
        const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
          data: err['message'],
          panelClass: 'dialog-width',
        });
      },
    );
  }

  getAccountDetails() {
    this.lmsService.getAccountDetails(this.applicationData?.bankCustomerId).subscribe(
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
    this.lmsService.getLGData(request).subscribe(
      (data) => {
        this.loaderService.showSpinner(false);
        this.lgDropDown = data;
        this.lgDropDown.filter((lg) => {
          console.log('lg==', lg);
          if (lg.id === this.applicationData?.applicationData?.agencyData?.lgCode) {
            this.firstFormGroup.get('lgCode').setValue(lg.id);
            console.log('lg==form', lg.value);
            this.lgName = lg.value;
          }
        });
      },
      (error) => {
        this.loaderService.showSpinner(false);
        this.lgDropDown = [];
      },
    );
  }

  onLGChange(event) {
    console.log(event);
    this.lgDropDown.forEach((item) => {
      if (item.id === event.value) {
        this.lgName = item.value;
      }
    });
  }

  getLOBAndProductType() {
    this.lmsService.getSpDetailsForUser(this.orgCode).subscribe(
      (result) => {
        this.loaderService.showSpinner(false);
        this.spDropdown = result;
        this.createPolicyForm();

        if (this.lob !== null && this.productType !== null) {
          this.firstFormGroup.get('product').disable();
        }
        this.errorLoadingApplicationDetails = false;
      },
      (error) => {
        this.loaderService.showSpinner(false);
      },
    );
  }

  makeInputDisable2() {
    if (this.appNo) {
      if(this.orgCode === "CSB"){
          if(this.applicationData?.statusCode === 25 || this.applicationData?.statusCode === 27){
            return false;
          }else{
            return true;
          }
      }else{
            if (this.applicationData?.statusCode === 1 || this.applicationData?.statusCode === 24) {
                if (this.isInsurerUser) {
                  return false;
                }
                return true;
              } else if (this.applicationData?.statusCode === 3) {
                return true;
              }
            }
      
      return false;
    }
  }

  makeInputDisable() {
    if (this.appNo) {
      if(this.orgCode === "CSB"){
          if(this.applicationData?.statusCode === 25 || this.applicationData?.statusCode === 27){
            return false;
          }else{
            return true;
          }
      }else{
          if (this.applicationData?.statusCode === 1 || this.applicationData?.statusCode === 24) {
            return true;
          } else if (this.applicationData?.statusCode === 3) {
            return true;
          }
      }
      
      return false;
    }
  }

  disableSumAssured() {
    if (this.applicationData?.statusCode == 3) {
      return true;
    }
    return false;
  }

  disablePremium() {
    if (this.appNo) {
      if (this.applicationData?.statusCode === 1 || this.applicationData?.statusCode === 24) {
        return true;
      }
      return false;
    }
  }

  disableCustomerField() {
    return true;
  }

  onStatusChange(event) {
    console.log('here it is');
    console.log('printing form', this.firstFormGroup);

    console.log('check this status value = ', event.value);


    if (event.value !== '') {
      if (event.value !== 1) {
        this.remainingField = true;
        this.optionalField = false;
        this.showInputByStatus(event.value);
        
        if (this.orgCode === 'SB') {
          this.panCardReadOnly = false;
        } else {
          this.panCardReadOnly = true;
        }
       
        

         
        
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
            new FormControl(this.applicationData?.ppt === 0 ? null : this.applicationData?.ppt, [
              Validators.pattern('^[1-9]\\d*$'),
              Validators.min(1),
              Validators.max(
                this.firstFormGroup?.get('pt').value ? this.firstFormGroup?.get('pt').value : 99,
              ),
            ]),
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
              [Validators.pattern('^s*-?[0-9]{1,8}s*$')],
            ),
          );
          this.firstFormGroup.addControl(
            'basePremium',
            new FormControl(
              this.applicationData?.basePremium === 0 ? null : this.applicationData?.basePremium,
              [
                Validators.pattern('^s*-?[0-9]{1,8}s*$'),
                Validators.max(this.firstFormGroup.get('premiumAmount').value),
              ],
            ),
          );
          this.firstFormGroup.addControl(
            'gst',
            new FormControl(this.applicationData?.gst === 0 ? null : this.applicationData?.gst, [
              Validators.pattern('^s*-?[0-9]{1,8}s*$'),
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
            .setValidators([Validators.pattern('^s*-?[0-9]{1,8}s*$')]);
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
            ? this.firstFormGroup?.get('insurerApplicationNo')?.value
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
        new FormControl(this.firstFormGroup?.get('remarks')?.value),
      );
      this.isIssued = false;
      this.uwStatus = false;
    } else if (
      this.firstFormGroup.get('status').value === 2 ||
      this.firstFormGroup.get('status').value === 4 ||
      this.firstFormGroup.get('status').value === 12
    ) {
      this.uwStatus = true;
      if (this.firstFormGroup.get('status').value === 2) {
        this.uwStatus = false;
        this.loggedIn = true;
        this.summaryFormGroup.addControl(
          'summaryinsurerApplicationNo',
          new FormControl(this.firstFormGroup?.get('insurerApplicationNo')?.value),
        );
        this.summaryFormGroup.addControl(
          'summaryRemarks',
          new FormControl(this.firstFormGroup?.get('remarks')?.value),
        );
        this.summaryFormGroup.controls.summaryRemarks.disable();
      }
      this.isSumAssured = false;
      this.isIssued = false;
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
      if (this.firstFormGroup?.get('ppt')?.value) {
        this.summaryFormGroup.addControl(
          'summaryPPT',
          new FormControl(this.firstFormGroup?.get('ppt').value),
        );
      }
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

      this.summaryFormGroup.addControl(
        'summaryRemarks',
        new FormControl(this.firstFormGroup?.get('remarks')?.value),
      );
      // this.isIssued = false;
      // this.uwStatus = false;
    } else if (this.firstFormGroup.get('status').value === 7) {
      this.summaryFormGroup.addControl(
        'summaryRemarks',
        new FormControl(this.firstFormGroup?.get('remarks').value),
      );
    }else if (this.firstFormGroup.get('status').value === 29 || 
    this.firstFormGroup.get('status').value === 27 || 
    this.firstFormGroup.get('status').value === 28) {
        this.summaryFormGroup.addControl(
        'summaryRemarks',
        new FormControl(this.firstFormGroup?.get('remarks').value),
      );
    }
  }

  showInputByStatus(id) {
    if (id !== '') {

       this.loggedIn = true;
       this.firstFormGroup.removeControl('insurerApplicationNo');
       
      if(this.orgCode !== "CSB"){
          this.firstFormGroup.addControl(
          'insurerApplicationNo',
          new FormControl(this.applicationData?.insurerApplicationNo),
        );
          this.firstFormGroup.addControl('remarks', new FormControl(null, Validators.required));
      }else{
          
          const statusV = this.firstFormGroup?.get('status').value;
          const disableAppNo = (statusV === 2 || statusV === 9 || statusV === 12 || statusV === 4) ? false : true;
          
          this.firstFormGroup.addControl(
            'insurerApplicationNo',
            new FormControl({ value: this.applicationData?.insurerApplicationNo, disabled: disableAppNo }),
          );
          if(this.firstFormGroup?.get('status').value === 26 || this.firstFormGroup?.get('status').value === 25){
              this.showRemarks = false;
              this.firstFormGroup.removeControl('remarks');
          }else{
            this.showRemarks = true;
            this.firstFormGroup.removeControl('remarks');
            this.firstFormGroup.addControl('remarks', new FormControl({ value: this.applicationData?.remarks, disabled: false }, Validators.required));
            
            
          }
          
      }
      
      
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
        // this.firstFormGroup.removeControl('remarks');
        // this.firstFormGroup.addControl('remarks', new FormControl(null, Validators.required));
        this.showPaymentInfo = false;
        this.isIssued = false;
        this.uwStatus = false;
      }else if((id === 25 || id === 26 || id === 2) && this.orgCode === "CSB"){
          
          if (id === 2) {
            this.loggedIn = true;
             this.isIssued = false;
            this.uwStatus = true;
            this.statusCheckOnChange = true;
            this.firstFormGroup.removeControl('insurerApplicationNo');
            this.firstFormGroup.addControl(
              'insurerApplicationNo',
              new FormControl(this.applicationData?.insurerApplicationNo, Validators.required),
            );
            this.optionalField = true;
            this.remainingField = true;
          }else{
            this.optionalField = true;
            this.remainingField = false;
          }
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
            new FormControl(this.applicationData?.ppt === 0 ? null : this.applicationData?.ppt, [
              Validators.pattern('^[1-9]\\d*$'),
              Validators.min(1),
              Validators.max(
                this.firstFormGroup?.get('pt').value ? this.firstFormGroup?.get('pt').value : 99,
              ),
            ]),
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
              [Validators.pattern('^s*-?[0-9]{1,8}s*$')],
            ),
          );
          this.firstFormGroup.addControl(
            'basePremium',
            new FormControl(
              this.applicationData?.basePremium === 0 ? null : this.applicationData?.basePremium,
              [
                Validators.pattern('^s*-?[0-9]{1,8}s*$'),
                Validators.max(this.firstFormGroup.get('premiumAmount').value),
              ],
            ),
          );
          this.firstFormGroup.addControl(
            'gst',
            new FormControl(this.applicationData?.gst === 0 ? null : this.applicationData?.gst, [
              Validators.pattern('^s*-?[0-9]{1,8}s*$'),
              Validators.max(this.firstFormGroup.get('basePremium').value),
            ]),
          );
          this.firstFormGroup.updateValueAndValidity();
      } else if ((id === 2 || id === 4 || id === 12)) {
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
        // this.firstFormGroup.removeControl('remarks');
        this.showPaymentInfo = false;
        this.isIssued = false;
      } else if (id === 3 || id === 11) {
        this.statusCheckOnChange = true;
        this.firstFormGroup.controls.sumAssured.disable();
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
        // this.firstFormGroup.removeControl('remarks');
        // this.firstFormGroup.addControl('remarks', new FormControl(null, Validators.required));
        this.showPaymentInfo = false;
        this.isIssued = false;
        this.uwStatus = false;
      } else if (id === 7) {
        //Payment Pending
        // this.showPaymentInfo = true;
        this.firstFormGroup.removeControl('policyNo');
        this.firstFormGroup.removeControl('policyStartDate');
        this.firstFormGroup.removeControl('policyEndDate');
        this.firstFormGroup.removeControl('pt');
        this.firstFormGroup.removeControl('confirmpt');
        this.firstFormGroup.removeControl('ppt');
        this.firstFormGroup.removeControl('confirmppt');
        this.firstFormGroup.removeControl('mode');

        this.firstFormGroup.removeControl('confirmpremiumAmount');
        this.firstFormGroup.removeControl('basePremium');
        this.firstFormGroup.removeControl('gst');

        this.onlySib = true;
        this.firstFormGroup.addControl(
          'premiumAmount',
          new FormControl('', [Validators.required, Validators.pattern('^s*-?[0-9]{1,8}s*$')]),
        );
        this.firstFormGroup.updateValueAndValidity();

        // this.generateFormFields();
        console.log('in 7', this.firstFormGroup.value);
      } else if (id === 9) {

        if(this.isCsbUser){
          this.firstFormGroup.removeControl('insurerApplicationNo');
          this.firstFormGroup.addControl(
            'insurerApplicationNo',
            new FormControl(null, Validators.required),
          );
        }
        this.statusCheckOnChange = true;
        console.log('in inforce', this.statusCheckOnChange);
        this.generateFormFields();
        this.showPaymentInfo = true;
        // this.firstFormGroup.removeControl('remarks');
        this.firstFormGroup.addControl(
          'policyStartDate',
          new FormControl(null, Validators.required),
        );
        this.firstFormGroup.controls.sumAssured.setValidators(Validators.required);

        this.isSumAssured = true;
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
          new FormControl(null, [Validators.required, Validators.pattern('^s*-?[0-9]{1,8}s*$')]),
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
          //  adding mode for SIB condition
          if (this.orgCode === 'SIB') {
            this.firstFormGroup.addControl(
              'mode',
              new FormControl(this.applicationData?.mode, Validators.required),
            );
          } else if (this.orgCode !== 'SIB') {
            this.firstFormGroup.addControl(
              'mode',
              new FormControl(
                this.applicationData?.mode === 0 ? null : this.applicationData?.mode,
                Validators.required,
              ),
            );
          }
          this.firstFormGroup.addControl(
            'premiumAmount',
            new FormControl(
              this.applicationData?.premiumAmount === 0
                ? null
                : this.applicationData?.premiumAmount,
              [Validators.required, Validators.pattern('^s*-?[0-9]{1,8}s*$')],
            ),
          );
          this.firstFormGroup.addControl(
            'basePremium',
            new FormControl(
              this.applicationData?.basePremium === 0 ? null : this.applicationData?.basePremium,
              [
                Validators.required,
                Validators.max(this.firstFormGroup.get('premiumAmount').value),
                Validators.pattern('^s*-?[0-9]{1,8}s*$'),
              ],
            ),
          );
          this.firstFormGroup.addControl(
            'gst',
            new FormControl(this.applicationData?.gst === 0 ? null : this.applicationData?.gst, [
              Validators.required,
              Validators.max(this.firstFormGroup.get('basePremium').value),
              Validators.pattern('^s*-?[0-9]{1,8}s*$'),
            ]),
          );
          if (this.firstFormGroup.get('mode').value == 0 && this.orgCode === 'SIB') {
            console.log('inside 1082');
            this.firstFormGroup.removeControl('confirmppt');
            this.firstFormGroup.removeControl('ppt');
          }
          this.firstFormGroup.updateValueAndValidity();
          console.log('FEB1', this.firstFormGroup);
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
            .setValidators([Validators.required, Validators.pattern('^s*-?[0-9]{1,8}s*$')]);
          this.firstFormGroup
            .get('basePremium')
            .setValidators([
              Validators.required,
              Validators.pattern('^s*-?[0-9]{1,8}s*$'),
              Validators.max(this.firstFormGroup.get('premiumAmount').value),
            ]);
          this.firstFormGroup
            .get('gst')
            .setValidators([
              Validators.required,
              Validators.pattern('^s*-?[0-9]{1,8}s*$'),
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
      if (parseInt(event.target.value) !== parseInt(this.firstFormGroup.get('pt')?.value)) {
        this.firstFormGroup.get('confirmpt').setErrors({ mustMatch: true });
      } else {
        this.firstFormGroup.get('confirmpt').setErrors(null);
      }
    } else if (index === 2) {
      // tslint:disable-next-line: radix
      if (parseInt(event.target.value) !== parseInt(this.firstFormGroup.get('ppt')?.value)) {
        this.firstFormGroup.get('confirmppt').setErrors({ mustMatch: true });
      } else {
        this.firstFormGroup.get('confirmppt').setErrors(null);
      }
    } else if (index === 3) {
      // tslint:disable-next-line: radix
      if (
        parseInt(event.target.value) !== parseInt(this.firstFormGroup.get('premiumAmount')?.value)
      ) {
        this.firstFormGroup.get('confirmpremiumAmount')?.setErrors({ mustMatch: true });
      } else {
        this.firstFormGroup.get('confirmpremiumAmount')?.setErrors(null);
      }
    } else if (index === 4) {
      // console.log(event, '-------', this.firstFormGroup.get('confirmppt').value);

      if (parseInt(event) !== parseInt(this.firstFormGroup.get('confirmppt')?.value)) {
        console.log('error');
        this.firstFormGroup.get('confirmppt')?.setErrors({ mustMatch: true });
      } else {
        console.log('not an error');
        this.firstFormGroup.get('confirmppt').setErrors(null);
      }
    } else if (index === 5) {
      if (parseInt(event) !== parseInt(this.firstFormGroup.get('confirmpt').value)) {
        console.log('error');
        this.firstFormGroup.get('confirmpt').setErrors({ mustMatch: true });
      } else {
        console.log('not an error');
        this.firstFormGroup.get('confirmpt').setErrors(null);
      }
    } else if (index === 6) {
      if (parseInt(event) !== parseInt(this.firstFormGroup.get('confirmpremiumAmount')?.value)) {
        console.log('error');
        this.firstFormGroup.get('confirmpremiumAmount')?.setErrors({ mustMatch: true });
      } else {
        console.log('not an error');
        this.firstFormGroup.get('confirmpremiumAmount')?.setErrors(null);
      }
    }
  }

  onChanged(event) {
    this.loaderService.showSpinner(true);
    this.insurerIdWhileCreatingLead = event.value;
    this.getOfflinePlans(event.value);
    console.log('event value', event.value);

    if (event.value == 101) {
      this.isHdfcLife = true;
    } else {
      this.isHdfcLife = false;
    }

    if (event.value == 104 && this.orgCode === 'DCB') {
      this.askFormC = true;
    } else {
      this.askFormC = false;
    }

    if (event.value == 104 && this.orgCode === 'CSB') {
      this.askLeadConverted = true;
    } else {
      this.askLeadConverted = false;
    }

    if (event.value == 102) {
      this.isProposerInsured = false;
      this.notSame = false;
    }

    this.flsNotRequired = this.getFlsRequired(event.value);

    console.log(this.flsNotRequired, '===');

    if (this.flsNotRequired) {
      console.log('inside not required');
      this.firstFormGroup.removeControl('fls');

      this.firstFormGroup.updateValueAndValidity();
    } else {
      this.firstFormGroup.addControl('fls', new FormControl(Validators.required));
      this.firstFormGroup.updateValueAndValidity();

      if (this.firstFormGroup.get('sp').value) {
        // this.loaderService.showSpinner(true);
        if (!this.flsNotRequired) {
          this.lmsService.flsFromSp(event.value, this.firstFormGroup.get('sp').value).subscribe(
            (fls) => {
              if (fls['responseCode'] === 0) {
                this.flsDropDown = fls['result'];
                if (this.flsDropDown.length === 1) {
                  this.firstFormGroup.get('fls')?.setValue(this.flsDropDown[0].id);
                }
              } else {
                const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
                  data: fls['responseMessage'],
                  panelClass: 'dialog-width',
                });
                dialogRef.afterClosed().subscribe((data) => {
                  // navigate
                });
              }
            },
            (err) => {
              this.loaderService.showSpinner(false);
              this.flsDropDown = null;
            },
          );
        }
      }
    }

    if (event.value && this.lob !== null && this.productType !== null) {
      const value = event.value;
      this.loaderService.showSpinner(true);
      console.log('sp', this.firstFormGroup.get('sp').value);

      this.lmsService.getProductsByProductTypeInsurer(this.lob, this.productType, value).subscribe(
        (result) => {
          this.productDropdown = result;
          this.loaderService.showSpinner(false);
        },
        (error) => {
          // this.productDropdown = [{ id: 'Test', value: 'Test' }];
          this.loaderService.showSpinner(false);
        },
      );
    }
  }

  firstFormGroupValid() {
    
    if (this.firstFormGroup.valid) {
      return false;
    } else {
      return true;
    }
  }

  modeSelected(event) {
    console.log(this.firstFormGroup.get('mode').value, '==val');
    let val = event.value;
    // let mode = this.firstFormGroup.get('mode').value;

    if (val == 0) {
      // this.firstFormGroup.get('ppt').setValue(0);
      this.isSingleMode = true;
      // this.firstFormGroup.get('ppt').disable();

      // this.firstFormGroup.get('ppt').clearValidators();
      // this.firstFormGroup.updateValueAndValidity();
      // Validators.pattern('^[1-9]\\d*$'),
      // this.firstFormGroup.get('ppt').disable();
      // this.firstFormGroup.get('ppt').clearValidators();
    } else {
      this.firstFormGroup.get('ppt').reset();
      this.firstFormGroup.get('ppt').setValidators(Validators.pattern('^[1-9]\\d*$'));
      this.firstFormGroup.updateValueAndValidity();

      this.isSingleMode = false;
    }
  }

  openConsentForm() {
    const dialogRef = this.dialog.open(ConsentModalComponent, {
      panelClass: 'myapp-no-padding-dialog',
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.summaryFormGroup.valid;
      } else {
        this.summaryFormGroup.markAsDirty();
      }
    });
  }

  onSpChange(event) {
    if (!this.flsNotRequired) {
      this.loaderService.showSpinner(true);

      this.lmsService
        .flsFromSp(this.firstFormGroup.get('insurer').value, event.value)
        .subscribe((fls) => {
          this.loaderService.showSpinner(false);

          console.log('fls =', fls);
          if (fls['responseCode'] === 0) {
            this.flsDropDown = fls['result'];
            if (this.flsDropDown.length === 1) {
              this.firstFormGroup.get('fls').setValue(this.flsDropDown[0].id);
            }
          } else {
            const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
              data: fls['responseMessage'],
              panelClass: 'dialog-width',
            });
            dialogRef.afterClosed().subscribe((data) => {
              // navigate
            });
          }
        });
    }
  }

  onInsurerChanged(event) {
    if (event.value && this.firstFormGroup.get('insurer').value) {
      const value = event.value.split('_');
      console.log('value==', value);

      this.lob = value[0];
      this.productType = value[1];
      if (this.lob !== 'Life') {
        this.firstFormGroup.get('ppt').setValue(1);
      } else {
        this.firstFormGroup.get('ppt').setValue(null);
      }

      if (this.lob === 'Motor' && this.orgCode === 'SB') {
        this.isOdFields = true;
        // this.firstFormGroup.get('basePremium').setValue()
      }
      this.loaderService.showSpinner(true);
      this.lmsService
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
            // this.productDropdown = [{ id: 'Test', value: 'Test' }];
            this.loaderService.showSpinner(false);
          },
        );
    }
  }

  getProducts() {
    this.lmsService
      .getProductsByProductTypeInsurer(
        this.appNo ? this.applicationData.lob : this.lob,
        this.appNo ? this.applicationData.productType : this.productType,
        this.appNo ? this.applicationData.insurerCode : this.insurerId,
      )
      .subscribe(
        (result:any) => {
          if(this.customerConsent && this.orgCode == "DCB"){
            this.productDropdown = result?.length ? result : [{id:this.applicationData?.productId,insurerId:this.applicationData?.insurerCode,insurerName:this.applicationData?.insurerName,lob:this.applicationData.lob,productId:this.applicationData?.productId,productName: this.applicationData?.productName,productType: this.applicationData?.productType,value: this.applicationData?.productName}];
          }else{
           this.productDropdown = result;
          }
          
          this.loaderService.showSpinner(false);
        },
        (error) => {
          // this.productDropdown = [{ id: 'Test', value: 'Test' }];
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
      console.log('check this Index 0', index);
      if (this.firstFormGroup.get('status').value === 9) {
        this.paymentForm
          .get('premiumPayable')
          .setValue(this.firstFormGroup.get('premiumAmount').value);
      }
      this.createProposerForm();
      this.showProposer = true;
      this.formDisableForInsurer(1);
      this.formDisableforDCBUser();
    } else if (index === 1) {
      console.log('❤️❤️❤️❤️❤️ Index 1', index);

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
      console.log('❤️❤️❤️❤️❤️ Index 2', index);

      this.createSummaryForm();
      this.createRemainingThirdFormControl();
      this.createPaymentInfoSummary();
      this.showSummary = true;
      this.summaryFormGroup.disable();
    }

    stepper.next();
  }

  formDisableforDCBUser() {
    console.log('test');
    // this.route.params.subscribe((params) => {
    //   if(params.journey === 'physical' && params.isLife === 'nonLife'){
    //     this.secondFormGroup.get('insured').disable();
    //   }
    // })
    // this.route.params.subscribe((params) => {
    //   if (params.customerId) {
    //     this.customerId = params.customerId;
    //   } else {
    //     this.customerId = null;
    //   }

    if (this.isDcbUser || this.isCsbUser) {
      this.secondFormGroup.get('firstName')?.disable();
      this.secondFormGroup.get('middleName')?.disable();
      this.secondFormGroup.get('lastName')?.disable();
      this.secondFormGroup.get('dob')?.disable();
      this.secondFormGroup.get('gender')?.disable();
      if(this.secondFormGroup.get('email').valid && this.isCsbUser){
        this.secondFormGroup.get('email').disable();
      }
      




      // this.secondFormGroup.get('email').disable();
      // this.secondFormGroup.get('mobile').disable();
      // this.secondFormGroup.get('alternateMobile').disable();
      // this.secondFormGroup.get('annualIncome').disable();
      // this.secondFormGroup.get('panNo').disable();
    }

    if (this.isCsbUser) {
      const mobileControl = this.secondFormGroup.get('mobile');
      const mobileValue = mobileControl.value;
      if (this.secondFormGroup.get('mobile').value.length == 10 && /^[6-9]/.test(mobileValue)) {
        this.secondFormGroup.get('mobile').disable();
        // this.tenDigitError = false;
      } else {
        this.secondFormGroup.get('mobile').enable();
        // this.tenDigitError = true;
        this.secondFormGroup.get('mobile').markAsDirty();
      }
    } else if (this.isDcbUser) {
      this.secondFormGroup.get('mobile').disable();
       //
      // commenting as per not req dec 2024 - maneesha & parth
      // if (this.firstFormGroup.get('insurer').value === '153' && !this.appNo) {
      //   this.secondFormGroup.get('mobile').enable();
      //   this.secondFormGroup.get('panNo').enable();
      // }
      this.secondFormGroup.get('panNo').disable();

      // if(this.insurerId === 113) {
      //   this.secondFormGroup.get('insured').disable();
      // }
    }
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
          if(this.orgCode === "CSB"){
            this.secondFormGroup.get('title')?.disable();
          this.secondFormGroup.get('maritalStatus')?.disable();
          }else{
            this.secondFormGroup.get('title')?.enable();
          this.secondFormGroup.get('maritalStatus')?.enable();
          }
          
        } else {
          this.secondFormGroup.get('title')?.disable();
          this.secondFormGroup.get('maritalStatus')?.disable();
        }
        this.secondFormGroup.get('firstName')?.disable();
        this.secondFormGroup.get('middleName')?.disable();
        // this.secondFormGroup.get('alternateMobile')?.disable();
        this.secondFormGroup.get('annualIncome')?.disable();
        this.secondFormGroup.get('lastName')?.disable();
        this.secondFormGroup.get('dob')?.disable();
        this.secondFormGroup.get('formCMli')?.disable();

        if (this.orgCode === 'SB') {
          // this.secondFormGroup.get('panNo').setValidators(Validators.required);
          this.secondFormGroup.get('panNo').enable();
          this.secondFormGroup
            .get('panNo')
            .setValidators([Validators.required, Validators.pattern(this.panNoNewRegex)]);
          this.secondFormGroup.updateValueAndValidity();
          this.panMandatory = true;

          if (this.isProposerInsured) {
            this.secondFormGroup.get('insured').enable();
          } else {
            this.secondFormGroup.get('insured').disable();
          }
        } else {
          this.secondFormGroup.get('panNo').disable();
          this.secondFormGroup.get('insured').disable();
        }
        this.secondFormGroup.get('gender')?.disable();
        this.secondFormGroup.get('email')?.disable();
        this.secondFormGroup.get('mobile')?.disable();
        this.secondFormGroup.get('insueredtitle')?.disable();
        this.secondFormGroup.get('relationship')?.disable();
        this.secondFormGroup.get('insuredFname')?.disable();
        this.secondFormGroup.get('insuredLname')?.disable();
        this.secondFormGroup.get('insuredDob')?.disable();
        this.secondFormGroup.get('insuredMarritalStatus')?.disable();
        this.secondFormGroup.get('insuredEmail')?.disable();
        this.secondFormGroup.get('insuredPhone')?.disable();
        this.secondFormGroup.get('insuredPan')?.disable();
        this.secondFormGroup.get('insuredGender')?.disable();
      } else if (check === 2) {
        if (
          (this.isInsurerUser && this.applicationData?.statusCode === 1) ||
          this.applicationData?.statusCode === 2 ||
          this.applicationData?.statusCode === 4 ||
          this.applicationData?.statusCode === 11 ||
          this.applicationData?.statusCode === 12
        ) {
          if(this.orgCode === "CSB"){
            this.thirdFormGroup.get('addressSame').disable();
            this.thirdFormGroup.get('policyaddressline1').disable();
            this.thirdFormGroup.get('policyaddressline2').disable();
            this.thirdFormGroup.get('policyaddressline3').disable();
            this.thirdFormGroup.get('policypostalcode').disable();
            this.thirdFormGroup.get('policycity').disable();
            this.thirdFormGroup.get('policystate').disable();
            if (this.thirdFormGroup.get('addressSame').value === 'no') {
              console.log(this.thirdFormGroup);
              this.thirdFormGroup.get('mailingaddressline1').disable();
              this.thirdFormGroup.get('mailingaddressline2').disable();
              this.thirdFormGroup.get('mailingaddressline3').disable();
              this.thirdFormGroup.get('mailingpostalcode').disable();
              this.thirdFormGroup.get('mailingcity').disable();
              this.thirdFormGroup.get('mailingstate')?.disable();
            }
          }
          // contact info editable for insurer if status is iniated
        } else {
          
          this.thirdFormGroup.get('addressSame').disable();
          this.thirdFormGroup.get('policyaddressline1').disable();
          this.thirdFormGroup.get('policyaddressline2').disable();
          this.thirdFormGroup.get('policyaddressline3').disable();
          this.thirdFormGroup.get('policypostalcode').disable();
          this.thirdFormGroup.get('policycity').disable();
          this.thirdFormGroup.get('policystate').disable();
          if (this.thirdFormGroup.get('addressSame').value === 'no') {
            console.log(this.thirdFormGroup);
            this.thirdFormGroup.get('mailingaddressline1').disable();
            this.thirdFormGroup.get('mailingaddressline2').disable();
            this.thirdFormGroup.get('mailingaddressline3').disable();
            this.thirdFormGroup.get('mailingpostalcode').disable();
            this.thirdFormGroup.get('mailingcity').disable();
            this.thirdFormGroup.get('mailingstate')?.disable();
          }
        }
      }
    }
  }

  fetchStatusDropDown() {
    this.loaderService.showSpinner(true);
    this.lmsService.getStatusDropDown().subscribe((result:any[]) => {
      this.statusDropDown = result;
      const exists = this.statusDropDown.some(
        (item) => item.id.toString() === this.applicationData.statusCode.toString()
      );
      
      if (!exists) {
        this.statusDropDown.unshift({
          id: this.applicationData.statusCode,
          value: this.applicationData.status
        });
      }
      this.loaderService.showSpinner(false);
    });
  }

  fetchMasters(productId) {
    this.loaderService.showSpinner(true);
    // if (this.orgCode === 'CBI') {
    //   productId = productId.slice(0, 3);
    // }
    this.lmsService.getMaritalStatus(productId).subscribe((result) => {
      this.maritalStatusDropdown = result;
      this.maritalStatusArray = this.maritalStatusDropdown
        .map((val) => {
          return val.id;
        })
        .join('|');
      console.log(this.maritalStatusArray);
    });
    this.lmsService.getGender(productId).subscribe((res) => {
      this.genderDropDown = res;
      console.log('gender', res);
    });

    // this.lmsService.getRelationship(productId).subscribe((relationship) => {
    //   this.proposerRelationShip = relationship;
    // });

    this.lmsService.getTitle(productId).subscribe((result) => {
      this.titleDropdown = result;

      this.insuredTitleDropdown = result;
      let gender;
      if (this.applicationData) {
        gender = this.applicationData?.applicationData?.proposer?.gender;
      } else if (this.customerDetails) {
        gender = this.customerDetails?.gender;
      }

      console.log('gedner===', gender);

      if (gender !== 'O' && gender !== undefined) {
        this.titleDropdown = this.titleDropdown.filter((title) => {
          if (this.orgCode === 'DCB') {
            if (title.gender === gender || title.id === 'Dr.') {
              return title;
            }
          } else {
            if (title.gender === gender) {
              return title;
            }
          }
          console.log('gg', title.gender, gender);
        });
      }
      console.log('titledrop', this.titleDropdown);
      this.titleArray = this.titleDropdown
        .map((val) => {
          return val.id;
        })
        .join('|');
      console.log(this.titleArray, this.titleDropdown);
    });
    this.lmsService.getOccupation(productId).subscribe((result) => {
      this.occupationDropdown = result;
    });
    this.loaderService.showSpinner(false);
  }

  fetchCityAndState(pincode) {
    this.loaderService.showSpinner(true);
    this.lmsService.getCityAndState(pincode).subscribe(
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
  // form creation if AppNo

  createPolicyForm() {
    let mode;
    let ppt;
    if (this.orgCode === 'SIB') {
      mode = this.applicationData?.mode;
      ppt = this.applicationData?.mode == 0 ? 0 : this.applicationData?.ppt;
      if (mode == 0) {
        this.isSingleMode = true;
      }
    } else {
      mode = this.applicationData?.mode === 0 ? null : this.applicationData?.mode;
      ppt =
        this.applicationData?.ppt === 0
          ? this.applicationData?.lob !== 'Life'
            ? 1
            : null
          : this.applicationData?.ppt;
    }
    // const mode = this.applicationData?.mode === 0 ? null : this.applicationData?.mode;
    const sa =
      this.applicationData?.sa === 0 ? null : this.applicationData?.applicationData?.sumInsured;
    const pt = this.applicationData?.pt === 0 ? null : this.applicationData?.pt;

    const premiumAmount =
      this.applicationData?.premiumAmount === 0 ? null : this.applicationData?.premiumAmount;
    const basePremium =
      this.applicationData?.basePremium === 0 ? null : this.applicationData?.basePremium;
    const gst = this.applicationData?.gst === 0 ? null : this.applicationData?.gst;
    this.firstFormGroup = new FormGroup({
      insurer: new FormControl(this.appNo ? this.applicationData?.insurerCode.toString() : null, [
        Validators.required,
      ]),
      fls: new FormControl(this.appNo ? this.applicationData?.applicationData?.flsCode : null, [
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
        this.appNo ? this.applicationData?.applicationData?.agencyData?.lgCode : null,
        [Validators.required],
      ),
      searchCtrl1: new FormControl(''),
      mode: new FormControl(this.appNo ? mode : null),
      sumAssured: new FormControl(this.appNo ? sa : null),
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
        Validators.pattern('^s*-?[0-9]{1,8}s*$'),
      ]),
      basePremium: new FormControl(this.appNo ? basePremium : null, [
        Validators.pattern('^[1-9]\\d*$'),
      ]),
      gst: new FormControl(this.appNo ? gst : null, [Validators.pattern('^[1-9]\\d*$')]),
    });
    
    this.flsNotRequired = this.getFlsRequired(this.applicationData?.insurerCode.toString());
    if(this.orgCode == "CSB"){
        this.csbDefaultStatus = this.applicationData?.statusCode ? this.applicationData?.statusCode : 25;
        this.firstFormGroup.get('status')?.setValue(this.csbDefaultStatus);
    }
    
    if (this.flsNotRequired) {
      this.firstFormGroup.removeControl('fls');

      this.firstFormGroup.updateValueAndValidity();
    }
    if (this.orgCode === 'BOM') {
      this.isBom = true;
      this.isSumAssured = true;
      this.firstFormGroup.get('pt').setValidators(Validators.required);
      this.firstFormGroup.get('ppt').setValidators(Validators.required);
      this.firstFormGroup.get('sumAssured').setValidators(Validators.required);
      this.firstFormGroup.get('mode').setValidators(Validators.required);
      this.firstFormGroup.get('premiumAmount').setValidators(Validators.required);
      this.firstFormGroup.get('basePremium').setValidators(Validators.required);
      this.firstFormGroup.get('gst').setValidators(Validators.required);
      this.firstFormGroup.updateValueAndValidity();
    }
    if (this.orgCode === 'DCB') {
      this.firstFormGroup.get('lgCode').clearValidators();
      this.firstFormGroup.updateValueAndValidity();
    }
    this.getLGData();
    if (this.spDropdown?.length === 1) {
      this.firstFormGroup.get('sp').setValue(this.spDropdown[0].spCode);
    }
    
    if (this.lgDropDown?.length === 1) {
      this.firstFormGroup.get('lgCode').setValue(this.lgDropDown[0].id);
      this.lgDropDown.forEach((item) => {
        if (item.id === this.firstFormGroup.get('lgCode').value) {
          this.lgName = item.value;
        }
      });
      console.log('lg name', this.lgName);
    }
    
         
        if (this.isBranchUser && this.appNo !== null) {
          if (this.orgCode === "CSB"){
            if(this.rfActive){
                if(this.applicationData?.statusCode !== 25 && this.applicationData?.statusCode !== 27){
                    this.firstFormGroup.get('pt').disable();
                    this.firstFormGroup.get('ppt').disable();
                    this.firstFormGroup.get('premiumAmount').disable();
                    this.firstFormGroup.get('mode').disable();
                    this.firstFormGroup.get('basePremium').disable();
                    this.firstFormGroup.get('sp').disable();
                    this.firstFormGroup.get('branchCode').disable();
                    this.firstFormGroup.get('gst').disable();
                    this.firstFormGroup.get('sumAssured').disable();
                }
            }else{
                if(this.applicationData?.statusCode == 29 || this.applicationData?.statusCode == 28 || this.applicationData?.statusCode == 9){
                  this.firstFormGroup.get('pt').disable();
                  this.firstFormGroup.get('ppt').disable();
                    this.firstFormGroup.get('premiumAmount').disable();
                    this.firstFormGroup.get('mode').disable();
                    this.firstFormGroup.get('basePremium').disable();
                    this.firstFormGroup.get('sp').disable();
                    this.firstFormGroup.get('branchCode').disable();
                    this.firstFormGroup.get('gst').disable();
                    this.firstFormGroup.get('sumAssured').disable();
                }

                if(this.applicationData?.statusCode == 9){
                  this.firstFormGroup.get('status').disable();
                }
            }
            
          }else{
            this.firstFormGroup.get('pt').disable();
              this.firstFormGroup.get('ppt').disable();
              this.firstFormGroup.get('premiumAmount').disable();
              this.firstFormGroup.get('mode').disable();
              this.firstFormGroup.get('basePremium').disable();
              this.firstFormGroup.get('sp').disable();
              this.firstFormGroup.get('branchCode').disable();
              this.firstFormGroup.get('gst').disable();
              this.firstFormGroup.get('sumAssured').disable();
          }
          
        }
    
    

    console.log('this form =', this.firstFormGroup);
  }

  getFlsRequired(insurerId) {
    for (const key in this.flsNotRequiredArr) {
      if (key === this.orgCode) {
        console.log('insidegetflsreq', this.flsNotRequiredArr[key], insurerId);
        return this.flsNotRequiredArr[key].includes(insurerId);
      }
    }
  }

  createProposerForm() {
    // if (this.appNo && this.applicationData?.applicationData?.proposer?.gender === 'T') {
    //   if (this.genderDropDown.length < 3) {
    //     this.genderDropDown.push({ id: 'T', value: 'Transgender' });
    //   }
    // }
    this.lmsService
      .getRelationship(this.firstFormGroup.get('productName').value)
      .subscribe((relationship) => {
        this.proposerRelationShip = relationship;
        this.proposerRelationShipCopy = relationship;
      });
    if (this.titleArray === '' || this.titleArray === null) {
      this.titleArray = 'No Data';
    }
    if (this.maritalStatusArray === '' || this.maritalStatusArray === null) {
      this.maritalStatusArray = 'No Data';
    }
    const title = this.customerDetails?.titleCode ? this.checkTitleInMaster(this.customerDetails?.titleCode) : null;
    const maritalStatus = this.customerDetails?.maritalStatus
      ? this.customerDetails?.maritalStatus
      : null;
    const mobileNo = this.customerDetails?.mobileNo;
    // const alternateMobile = this.customerDetails?.alternateMobileNo;
    let insuredVal;
    if (this.applicationData?.applicationData?.proposerInsured == false) {
      insuredVal = 'no';
    } else {
      insuredVal = 'yes';
    }

    this.notSame = false;
    this.secondFormGroup = new FormGroup({
      insured: new FormControl(this.appNo ? insuredVal : 'yes', [Validators.required]),

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
      middleName: new FormControl(
        this.appNo
          ? this.applicationData?.applicationData?.proposer?.middleName
          : this.customerDetails?.middleName?.trim(),
        [],
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
        [Validators.required, Validators.pattern('M|F|T')],
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
        [
          Validators.required, 
          Validators.pattern(/^[a-zA-Z0-9]+([._+-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(-?[a-zA-Z0-9]+)*(\.[a-zA-Z]{2,})+$/)
        ],
      ),
      mobile: new FormControl(
        this.appNo ? this.applicationData?.applicationData?.proposer?.mobile : mobileNo,
        [
          Validators.required,
          Validators.pattern('^[6-9][0-9]*$'),
          Validators.maxLength(10),
          Validators.minLength(10),
        ],
      ),
      // alternateMobile: new FormControl(
      //   this.appNo
      //     ? this.applicationData?.applicationData?.proposer?.alternateMobile
      //     : alternateMobile,
      //   [Validators.pattern('^[0-9]*$')],
      // ),
      annualIncome: new FormControl(
        this.appNo
          ? this.applicationData?.applicationData?.proposer?.annualIncome
          : this.customerDetails?.customerNeeds?.annualIncome,
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ),
      panNo: new FormControl(
        {
          value: this.appNo
            ? this.applicationData?.applicationData?.proposer?.panNo
            : this.customerDetails?.panNo,
          disabled: false,
        },
        [Validators.pattern(this.panNoNewRegex)],
      ),
      
    });


    if(this.showLeadTag){
      this.secondFormGroup.addControl(
        'leadTag',
        new FormControl(
          this.appNo ? this.applicationData?.applicationData?.leadTag : '',
          [Validators.required],
        ),
      );
    }

    if (
      (this.applicationData?.insurerCode == 104 || this.insurerIdWhileCreatingLead == 104) &&
      this.orgCode === 'DCB'
    ) {
      this.askFormC = true;
      this.secondFormGroup.addControl(
        'formCMli',
        new FormControl(
          this.appNo ? this.applicationData?.applicationData.isFORMCApplicable.toString() : '',
          [Validators.required],
        ),
      );

      console.log(
        'valuweeeeckyc',
        this.appNo,
        this.applicationData?.applicationData.isFORMCApplicable,
      );
    } else {
      this.askFormC = false;
      this.secondFormGroup?.removeControl('formCMli');
    }

    if (this.applicationData?.insurerCode == 102 || this.insurerIdWhileCreatingLead == 102) {
      this.secondFormGroup.get('insured').setValue('no');
      this.secondFormGroup.get('insured').disable();
    }

    // --org customer--isIndividual false ---
    console.log(
      'orgindi',
      this.customerDetails,
      this.isIndividual,
      this.secondFormGroup.valid,
      this.secondFormGroup,
    );
    if (!this.isIndividual) {
      this.secondFormGroup.removeControl('title');
      this.secondFormGroup.removeControl('firstName');
      this.secondFormGroup.removeControl('middleName');
      this.secondFormGroup.removeControl('lastName');
      this.secondFormGroup.removeControl('gender');
      this.secondFormGroup.removeControl('maritalStatus');
      this.secondFormGroup.addControl(
        'orgName',
        new FormControl(this.customerDetails?.orgName, Validators.required),
      );
      this.secondFormGroup.addControl(
        'orgIncDate',
        new FormControl(this.customerDetails?.dateOfIncorporation, Validators.required),
      );
      console.log('date of incorporation', this.customerDetails);
      this.secondFormGroup.updateValueAndValidity();
    }

    // ---- ----- ----

    if (this.secondFormGroup.get('annualIncome')) {
      this.annualIncomeMandatory = true;
    }

    if (this.orgCode === 'SB') {
      this.secondFormGroup.get('panNo').enable();
      this.secondFormGroup
        .get('panNo')
        .setValidators([Validators.required, Validators.pattern(this.panNoNewRegex)]);
      this.secondFormGroup.updateValueAndValidity();
      this.panMandatory = true;
    }
    if (this.orgCode === 'SIB') {
      this.panMandatory = true;
      this.secondFormGroup.get('panNo').enable();
      this.secondFormGroup
        .get('panNo')
        .setValidators([Validators.required, Validators.pattern(this.panNoNewRegex)]);
      this.secondFormGroup.updateValueAndValidity();
    }
    // this.onProposerChange(insuredVal);
    if (this.physicalJourney) {
      console.log('riskscore form =', this.physicalJourney);
      this.secondFormGroup.addControl(
        'riskScore',
        new FormControl(this.appNo ? this.applicationData?.applicationData.riskScore : '', [
          Validators.required,
          Validators.min(100),
          Validators.max(400),
        ]),
      );
      this.myFiles = [];
      this.displayFileName = [];
      this.secondFormGroup.addControl('fileUpload', new FormControl('', Validators.required));
    }
    if (this.physicalJourneyNonLife) {
      this.secondFormGroup.removeControl('riskScore');
    }
    if (this.physicalJourney && this.appNo) {
      this.secondFormGroup.get('riskScore')?.clearValidators();
      this.secondFormGroup.get('fileUpload')?.clearValidators();
      this.secondFormGroup.get('fileUpload')?.disable();

      this.secondFormGroup.get('riskScore')?.disable();
    }

    if (
      this.isProposerInsured === false &&
      this.appNo &&
      this.applicationData?.insurerCode != 102 &&
      this.insurerIdWhileCreatingLead != 102
    ) {
      this.notSame = true;
      console.log(this.titleDropdown, 'today');
      this.secondFormGroup.addControl(
        'insueredtitle',
        new FormControl(
          this.appNo ? this.applicationData?.applicationData?.insureds[0]?.title : title,
          [Validators.required, Validators.pattern(this.titleArray)],
        ),
      );
      this.secondFormGroup.addControl(
        'insuredFname',
        new FormControl(
          this.appNo ? this.applicationData?.applicationData?.insureds[0]?.firstName : null,

          [Validators.required, Validators.minLength(1), Validators.maxLength(45)],
        ),
      );
      this.secondFormGroup.addControl(
        'insuredLname',
        new FormControl(
          this.appNo ? this.applicationData?.applicationData?.insureds[0]?.lastName : null,
          Validators.required,
        ),
      );
      if (
        this.orgCode === 'BOM' ||
        this.orgCode === 'SIB' ||
        this.orgCode === 'CSB' ||
        this.orgCode === 'SB'
      ) {
        this.secondFormGroup.addControl(
          'relationship',
          new FormControl(
            this.appNo ? this.applicationData?.applicationData?.insureds[0]?.proposerRel : null,
            Validators.required,
          ),
        );
      }

      // if (this.appNo && this.applicationData?.applicationData?.insureds[0]?.gender === 'T') {
      //   if (this.genderDropDown.length < 3) {
      //     this.genderDropDown.push({ id: 'T', value: 'Transgender' });
      //   }
      // }
      this.secondFormGroup.addControl(
        'insuredDob',
        new FormControl(
          this.appNo ? this.applicationData?.applicationData?.insureds[0]?.dob : null,
          Validators.required,
        ),
      );
      this.secondFormGroup.addControl(
        'insuredGender',
        new FormControl(
          this.appNo ? this.applicationData?.applicationData?.insureds[0]?.gender : null,
          Validators.required,
        ),
      );

      this.secondFormGroup.addControl(
        'insuredMarritalStatus',
        new FormControl(
          this.appNo ? this.applicationData?.applicationData?.insureds[0]?.maritalStatus : null,
          Validators.required,
        ),
      );
      this.secondFormGroup.addControl(
        'insuredEmail',
        new FormControl(
          this.appNo ? this.applicationData?.applicationData?.insureds[0]?.email : null,
          [Validators.required, Validators.email],
        ),
      );
      this.secondFormGroup.addControl(
        'insuredPhone',
        new FormControl(
          this.appNo ? this.applicationData?.applicationData?.insureds[0]?.mobile : null,
          [
            Validators.required,
            Validators.pattern('^[0-9]*$'),
            Validators.minLength(10),
            Validators.maxLength(10),
          ],
        ),
      );
      this.secondFormGroup.addControl(
        'insuredPan',
        new FormControl(
          this.appNo ? this.applicationData?.applicationData?.insureds[0]?.panNo : null,
        ),
      );
      this.secondFormGroup.addControl('summaryInsuredTitle', new FormControl());
      this.secondFormGroup.addControl('summaryInsuredFirstName', new FormControl());
      this.secondFormGroup.addControl('summaryInsuredLastName', new FormControl());
      this.secondFormGroup.addControl('summaryInsuredDOB', new FormControl());
      this.secondFormGroup.addControl('summaryInsuredGender', new FormControl());
      this.secondFormGroup.addControl('summaryInsuredMaritalStatus', new FormControl());
      this.secondFormGroup.addControl('summaryInsuredEmail', new FormControl());
      this.secondFormGroup.addControl('summaryInsuredMobile', new FormControl());
      this.secondFormGroup.addControl('summaryInsuredPanNo', new FormControl());
      if (this.orgCode === 'BOM') {
        this.secondFormGroup.addControl('summaryInsuredRelationship', new FormControl());
      }
      this.formDisableforDCBUser();
    } else {
      this.notSame = false;

      this.secondFormGroup.removeControl('insueredtitle');
      this.secondFormGroup.removeControl('insuredFname');
      this.secondFormGroup.removeControl('insuredLname');
      this.secondFormGroup.removeControl('insuredDob');
      this.secondFormGroup.removeControl('insuredGender');
      this.secondFormGroup.removeControl('insuredMarritalStatus');
      this.secondFormGroup.removeControl('insuredEmail');
      this.secondFormGroup.removeControl('insuredPhone');
      this.secondFormGroup.removeControl('insuredPan');
      this.secondFormGroup.removeControl('summaryInsuredTitle');
      this.secondFormGroup.removeControl('summaryInsuredFirstName');
      this.secondFormGroup.removeControl('summaryInsuredLastName');
      this.secondFormGroup.removeControl('summaryInsuredDOB');
      this.secondFormGroup.removeControl('summaryInsuredGender');
      this.secondFormGroup.removeControl('summaryInsuredMaritalStatus');
      this.secondFormGroup.removeControl('summaryInsuredEmail');
      this.secondFormGroup.removeControl('summaryInsuredMobile');
      this.secondFormGroup.removeControl('summaryInsuredPanNo');
      if (this.orgCode === 'BOM') {
        this.secondFormGroup.removeControl('summaryInsuredRelationship');
      }
    }
  }

  checkTitleInMaster(title: string) {
    const titleMaster = this.titleDropdown;
    const fTitle = titleMaster.some(item => item.id === title);
    return fTitle ? title : null;
  }

  createContactInfoForm() {
    const postalcodeRegex = /^[1-9]{1}[0-9]{5,5}$/;
    this.thirdFormGroup = new FormGroup({
      addressSame: new FormControl(
        this.applicationData?.applicationData?.policyMailingAddressSame ? 'yes' : 'no',
      ),
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
      policystate: new FormControl(
        this.appNo
          ? this.applicationData?.applicationData?.policyAddress?.state
          : this.customerDetails?.addressList[0].state,
        [Validators.required],
      ),
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
      mailingstate: new FormControl(
        this.appNo
          ? this.applicationData?.applicationData?.mailingAddress?.state
          : this.customerDetails?.addressList[0].state,
        [Validators.required],
      ),
    });
  }

  createSummaryForm() {
    this.summaryFormGroup = new FormGroup({
      summaryInsurer: new FormControl(this.firstFormGroup.get('insurer').value.toString()),
      summaryProduct: new FormControl(this.lob + '_' + this.productType),
      summaryProductName: new FormControl(this.firstFormGroup.get('productName').value),
      summarySP: new FormControl(this.firstFormGroup.get('sp').value),
      summaryStatus: new FormControl(this.firstFormGroup.get('status').value),
      summaryBranchCode: new FormControl(this.firstFormGroup.get('branchCode').value),
      // summaryFls: new FormControl(this.firstFormGroup.get('fls')?.value),
      summaryLgCode: new FormControl(this.firstFormGroup.get('lgCode').value),
      summaryTitle: new FormControl(this.secondFormGroup.get('title')?.value),
      summaryInsured: new FormControl(this.secondFormGroup.get('insured')?.value),

      summaryFirstName: new FormControl(this.secondFormGroup.get('firstName')?.value),
      summaryMiddleName: new FormControl(this.secondFormGroup.get('middleName')?.value),
      summaryLastName: new FormControl(this.secondFormGroup.get('lastName')?.value),
      summaryDOB: new FormControl(this.secondFormGroup.get('dob')?.value),
      summaryGender: new FormControl(this.secondFormGroup.get('gender')?.value),
      summarySumAssured: new FormControl(this.firstFormGroup.get('sumAssured').value),
      summaryAnnualIncome: new FormControl(this.secondFormGroup.get('annualIncome').value),
      summaryMaritalStatus: new FormControl(this.secondFormGroup.get('maritalStatus')?.value),
      // summaryOccupation: new FormControl(this.secondFormGroup.get('occupation').value),
      summaryEmail: new FormControl(this.secondFormGroup.get('email').value),
      summaryMobile: new FormControl(this.secondFormGroup.get('mobile').value),
      // summaryAlternateMobile: new FormControl(this.secondFormGroup.get('alternateMobile').value),
      summaryPanNo: new FormControl(this.secondFormGroup.get('panNo').value),
      

      // Insured
      summaryInsuredTitle: new FormControl(
        this.secondFormGroup.get('insueredtitle')
          ? this.secondFormGroup.get('insueredtitle').value
          : '',
      ),
      summaryInsuredFirstName: new FormControl(
        this.secondFormGroup.get('insuredFname')
          ? this.secondFormGroup.get('insuredFname').value
          : '',
      ),
      summaryInsuredLastName: new FormControl(
        this.secondFormGroup.get('insuredLname')
          ? this.secondFormGroup.get('insuredLname').value
          : '',
      ),
      summaryInsuredRelationship: new FormControl(
        this.secondFormGroup.get('relationship')
          ? this.secondFormGroup.get('relationship').value
          : '',
      ),
      summaryInsuredDOB: new FormControl(
        this.secondFormGroup.get('insuredDob') ? this.secondFormGroup.get('insuredDob').value : '',
      ),
      summaryInsuredGender: new FormControl(
        this.secondFormGroup.get('insuredGender')
          ? this.secondFormGroup.get('insuredGender').value
          : '',
      ),
      summaryInsuredMaritalStatus: new FormControl(
        this.secondFormGroup.get('insuredMarritalStatus')
          ? this.secondFormGroup.get('insuredMarritalStatus').value
          : '',
      ),
      summaryInsuredEmail: new FormControl(
        this.secondFormGroup.get('insuredEmail')
          ? this.secondFormGroup.get('insuredEmail').value
          : '',
      ),
      summaryInsuredMobile: new FormControl(
        this.secondFormGroup.get('insuredPhone')
          ? this.secondFormGroup.get('insuredPhone').value
          : '',
      ),
      summaryInsuredPanNo: new FormControl(
        this.secondFormGroup.get('insuredPan') ? this.secondFormGroup.get('insuredPan').value : '',
      ),
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

    if (this.showLeadTag) {
      this.summaryFormGroup.addControl(
        'summaryLeadTag',
        new FormControl(this.secondFormGroup.get('leadTag')?.value),
      );
    }else{
      this.summaryFormGroup.removeControl('summaryLeadTag');
    }
    

    if (this.askFormC) {
      console.log('insinde iff');
      this.summaryFormGroup.addControl(
        'summaryFormcMli',
        new FormControl(this.secondFormGroup.get('formCMli')?.value),
      );
    } else {
      console.log('insinde else');

      this.summaryFormGroup.removeControl('summaryFormcMli');
    }
    
    if (this.askLeadConverted) {
      this.miscellaneousForm = new FormGroup({
        leadConverted: new FormControl(
          {
            value: this.appNo ? this.applicationData?.applicationData?.leadConvertedStatus : '',
            disabled: this.appNo ? true : false,
          },
          [Validators.required],
        ),
      });
    } else {
      this.miscellaneousForm = new FormGroup({});
    }

    if (!this.isIndividual) {
      this.summaryFormGroup.removeControl('summaryTitle');
      // this.summaryFormGroup.removeControl('summaryInsured');

      this.summaryFormGroup.removeControl('summaryFirstName');
      this.summaryFormGroup.removeControl('summaryMiddleName');
      this.summaryFormGroup.removeControl('summaryLastName');
      this.summaryFormGroup.removeControl('summaryGender');
      this.summaryFormGroup.removeControl('summaryMaritalStatus');
      this.summaryFormGroup.removeControl('summaryDOB');

      this.summaryFormGroup.addControl(
        'summaryOrgName',
        new FormControl(this.secondFormGroup.get('orgName')?.value, Validators.required),
      );
      this.summaryFormGroup.addControl(
        'summaryOrgIncDate',
        new FormControl(this.secondFormGroup.get('orgIncDate')?.value, Validators.required),
      );
      this.summaryFormGroup.updateValueAndValidity();
    }

    if (!this.flsNotRequired) {
      this.summaryFormGroup.addControl(
        'summaryFls',
        new FormControl(this.firstFormGroup.get('fls')?.value),
      );
    }
    if (this.physicalJourney) {
      this.summaryFormGroup.addControl(
        'summaryRiskScore',
        new FormControl(this.secondFormGroup?.get('riskScore')?.value),
      );
    }

    if (this.appNo) {
      this.checkboxForm = this.formBuilder.group({
        checkbox1: true,
        checkbox2: true,
      });
      this.checkboxForm.disable();
    } else {
      this.checkboxForm = this.formBuilder.group({
        checkbox1: false,
        checkbox2: false,
      });
    }

    console.log(this.firstFormGroup.get('status').value);

    if (
      this.firstFormGroup.get('status').value === 1 ||
      this.firstFormGroup.get('status').value === 9 
    ) {
      this.optionalField = true;
      this.summaryFormGroup.addControl(
        'summaryPT',
        new FormControl(this.firstFormGroup?.get('pt').value),
      );
      if (this.firstFormGroup?.get('ppt')?.value) {
        this.summaryFormGroup.addControl(
          'summaryPPT',
          new FormControl(this.firstFormGroup?.get('ppt').value),
        );
      }
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


    if(this.orgCode === "CSB"){
      if (
      this.firstFormGroup.get('status').value !== 4 &&
      this.firstFormGroup.get('status').value !== 12 
    ) {
      this.summaryFormGroup.removeControl('summaryPT');
      this.summaryFormGroup.removeControl('summaryPPT');
      this.summaryFormGroup.removeControl('summarymode');
      this.summaryFormGroup.removeControl('summarypremiumAmount');
      this.summaryFormGroup.removeControl('summarybasePremium');
      this.summaryFormGroup.removeControl('summarygst');


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
    }else{
      this.summaryFormGroup.addControl(
        'summaryRemarks',
        new FormControl(this.firstFormGroup?.get('remarks')?.value),
      );
    }
      
    }
  }

  makeReadOnly() {
    return this.appNo === null ? false : true;
  }

  createRemainingFormControl() {
    console.log('hi inside create remaining control');
    console.log('status form', this.firstFormGroup);
    if(this.orgCode !== "CSB"){
        this.firstFormGroup.get('insurer').disable();
        this.firstFormGroup.get('product').disable();
        this.firstFormGroup.get('productName').disable();
        this.firstFormGroup.get('sp').disable();
        this.firstFormGroup.get('status').disable();
        this.firstFormGroup.get('lgCode').disable();
        this.firstFormGroup.removeControl('remarks');
        console.log('status form', this.firstFormGroup);

        this.loggedIn = true;

        this.firstFormGroup.addControl(
          'insurerApplicationNo',
          new FormControl({ value: this.applicationData?.insurerApplicationNo, disabled: true }),
        );
    }else{
      if (this.applicationData?.statusCode === 2 || this.applicationData?.statusCode === 9 ) {
          this.firstFormGroup.get('insurer').disable();
          this.firstFormGroup.get('product').disable();
          this.firstFormGroup.get('productName').disable();
          this.firstFormGroup.get('sp').disable();
          this.firstFormGroup.get('lgCode').disable();
          this.loggedIn = true;
          this.firstFormGroup.addControl(
            'insurerApplicationNo',
            new FormControl({ value: this.applicationData?.insurerApplicationNo, disabled: true }),
          );
      }
    }
    


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
      this.firstFormGroup.get('sumAssured').disable();

      this.firstFormGroup.addControl(
        'remarks',
        new FormControl({ value: this.applicationData?.remarks, disabled: true }),
      );
    } else if (this.applicationData?.statusCode === 11) {
      if (!this.leadbatchMli) {
        this.firstFormGroup.get('product').enable();
        this.firstFormGroup.get('productName').enable();
        this.firstFormGroup.get('status').enable();
        this.firstFormGroup.addControl(
          'remarks',
          new FormControl({ value: this.applicationData?.remarks, disabled: false }),
        );
      } else {
        this.firstFormGroup.addControl(
          'remarks',
          new FormControl({ value: this.applicationData?.remarks, disabled: true }),
        );
      }
      this.isIssued = false;
    } else if (
      (this.applicationData?.statusCode === 2 ||
      this.applicationData?.statusCode === 4 ||
      this.applicationData?.statusCode === 12)
    ) {
      
      if (!this.leadbatchMli) {
        this.firstFormGroup.get('product').enable();
        this.firstFormGroup.get('productName').enable();
        this.firstFormGroup.get('status').enable();
        if (this.orgCode !== 'DCB') {
          this.firstFormGroup.addControl(
            'remarks',
            new FormControl({ value: this.applicationData?.remarks, disabled: true }),
          );
        }
      } else {
        this.firstFormGroup.addControl(
          'remarks',
          new FormControl({ value: this.applicationData?.remarks, disabled: true }),
        );
      }

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
        'sumAssured',
        new FormControl({ value: '' }, [Validators.required, Validators.pattern('^[1-9]*$')]),
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
          Validators.pattern('^s*-?[0-9]{1,8}s*$'),
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
          Validators.pattern('^s*-?[0-9]{1,8}s*$'),
        ]),
      );
      this.firstFormGroup.addControl(
        'gst',
        new FormControl({ value: this.applicationData?.gst, disabled: true }, [
          Validators.required,
          Validators.pattern('^s*-?[0-9]{1,8}s*$'),
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
    console.log('gst cal');
    if (!this.firstFormGroup.get('premiumAmount').value) {
      this.firstFormGroup.get('gst').reset();
      this.firstFormGroup.get('basePremium').reset();
    }
    if (value.length > 2) {
      // tslint:disable-next-line: radix
      if (parseInt(value) < parseInt(this.firstFormGroup.get('basePremium').value)) {
        this.firstFormGroup.get('premiumAmount').setErrors({ checkTotal: true });
      } else {
        if (value.length < 8) {
          this.firstFormGroup.get('premiumAmount').setErrors(null);
        }
      }
    }
    if (this.firstFormGroup.get('confirmpremiumAmount')?.value !== null) {
      this.confirmCheck(value, 6);
    }
  }

  checkBasePremium(value) {
    console.log('gst=', value);

    if (!this.firstFormGroup.get('basePremium').value) {
      this.firstFormGroup.get('gst').reset();
    }
    if (value.length > 2) {
      // tslint:disable-next-line: radix
      const gst =
        this.firstFormGroup.get('premiumAmount').value -
        this.firstFormGroup.get('basePremium').value;
      this.firstFormGroup.get('gst').setValue(gst);
      console.log('gst=', gst, this.firstFormGroup.get('gst').value);
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
    if (this.appNo && this.orgCode === 'CSB') {
      if(this.rfActive){
          if(this.applicationData?.statusCode == 25 || this.applicationData?.statusCode == 27){
              return false;
          }else{
            return true;
          }
      }else{
          if(this.applicationData?.statusCode ==29 || this.applicationData?.statusCode == 28){
            return true;
          }else{
            return false;
          }
      }
      
    }else{
        if (this.isBranchUser || this.insurerId == 101 || this.applicationData?.leadBatch) {
          return true;
        }
    }

    
    return false;
  }

  showRiskProfile(event) {
    const score = event.target.value;
    console.log('score - ', score);
    switch (score > 0) {
      case score <= 130:
        this.riskProfile = 'Risk Averse';
        this.riskApetite = 4;
        break;
      case score >= 131 && score <= 200:
        this.riskProfile = 'Conservative';
        this.riskApetite = 5;

        break;
      case score >= 201 && score <= 260:
        this.riskProfile = 'Moderately Conservative';
        this.riskApetite = 6;

        break;
      case score >= 261 && score <= 320:
        this.riskProfile = 'Moderately Aggressive';
        this.riskApetite = 7;

        break;
      case score > 320 && score <= 400:
        this.riskProfile = 'Aggressive';
        this.riskApetite = 8;

        break;

      default:
      // code block
    }
  }

  onSubmitClicked() {
    this.submitClicked = true;
    this.disableSubmit();

    if (this.appNo) {
      console.log('hi');
      if (this.isBranchUser && this.orgCode === 'CSB'){
          this.updateApplication();
      }else if (
        (this.applicationData?.statusCode === 1 ||
          this.applicationData.statusCode === 2 ||
          this.applicationData.statusCode === 4 ||
          this.applicationData.statusCode === 11 ||
          this.applicationData.statusCode === 24 ||
          this.applicationData.statusCode === 12) &&
        !this.leadbatchMli
      ) {
        if (this.isBranchUser && this.orgCode != 'CSB') {
          const message = 'Only Insurer RM can modify the application.';
          const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
            data: message,
            panelClass: 'dialog-width',
          });
          dialogRef.afterClosed().subscribe((data) => {
            // navigate
          });
        } else if (this.currentUser['insurerUser'] || this.isInsurerUser) {
          this.updateApplication();
        } 
      } else if (
        this.applicationData.statusCode === 6 ||
        this.applicationData.statusCode === 9 ||
        this.applicationData.statusCode === 3 ||
        this.leadbatchMli
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
      if (this.isBranchUser || (this.orgCode === 'SIB' && !this.isInsurerUser)) {
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

  sendOtp(resData) {
    this.loaderService.showSpinner(true);
    const otpDcbData = {
      otpKey: this.customerDetails?.bankCustomerId,
      otpRequestDesc: '',
      // email: this.secondFormGroup.get('email').value, req when prakash ask
      mobileNo: this.customerDetails?.mobileNo,
    };

    const otpData = {
      otpKey: resData['appNo'].toString(),
      mobileNo: this.secondFormGroup.get('mobile').value,
      otpRequestDesc: this.productName,
      email: this.secondFormGroup.get('email').value,
    };

    if (this.isDcbUser) {
      this.lmsService.sendDcbOtp(otpDcbData).subscribe(
        (res) => {
          this.loaderService.showSpinner(false);
          console.log(res);

          if (res['returnCode'] == 0) {
            this.validateOtp(resData);
          } else if (res['returnCode'] == 1) {
            const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
              data: res['returnMessage'],
              // 'Lead/Application status Updated Successfully',
              panelClass: 'dialog-width',
            });
          }
        },
        (err) => {
          this.loaderService.showSpinner(false);
          const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
            data: 'Request Failed please try after sometime',
            // 'Lead/Application status Updated Successfully',
            panelClass: 'dialog-width',
          });
        },
      );
    } else {
      this.lmsService.sendOtp(otpData).subscribe(
        (res) => {
          this.loaderService.showSpinner(false);
          if (res['statusCode'] == 0) {
            this.validateOtp(resData);
          }
        },
        (err) => {
          this.loaderService.showSpinner(false);
        },
      );
    }
  }

  validateOtp(resData) {

    let dialogRef = this.dialog.open(OtpModalComponent, {
      data: {
        appNo: resData['appNo'].toString(),
        dcb: this.isDcbUser,
        cifNumber: this.customerDetails.bankCustomerId,
        productName: this.productName,
        mobileNo: this.secondFormGroup.get('mobile').value,
        email: this.secondFormGroup.get('email').value,
      },
      panelClass: 'dialog-width',
    });

    const optOutPayload = {
      appNo: resData['appNo'].toString(),
      mobileNo: this.secondFormGroup.get('mobile').value,
      email: this.secondFormGroup.get('email').value,
    }
    dialogRef.afterClosed().subscribe((result) => {
      
      if (result === true) {
        this.showOtpError = false;
        this.submitDisable = false;
        if (this.orgCode !== 'DCB') {
          if(this.orgCode === 'CSB') {
                if(this.summaryFormGroup.get('summaryStatus').value == 25){
                  this.sendOptOutSms(optOutPayload);
                }else{
                  this.loaderService.showSpinner(false);
                }
          }
          
        }

        // this.loaderService.showSpinner(false);
      } else {
        this.showOtpError = true;
        this.loaderService.showSpinner(false);
        this.submitDisable = true;
      }
    });
  }

  sendOptOutSms(payload) {
      this.loaderService.showSpinner(true);

      this.lmsService.triggerOptOutSms(payload).subscribe(
      (sentResult) => {
        if (sentResult) {
          this.loaderService.showSpinner(false);
          const message = 'Lead application submit successfully.';
          const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
            data: message,
            panelClass: 'dialog-width',
          });
          dialogRef.afterClosed().subscribe((data) => {
            this.router.navigate(['/lms']);
          });
          
        }
      },
      (err) => {
        this.loaderService.showSpinner(false);
        const message = 'Lead application submit successfully.';
          const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
            data: message,
            panelClass: 'dialog-width',
          });
          dialogRef.afterClosed().subscribe((data) => {
            this.router.navigate(['/lms']);
          });
      },
    );
  }

  disableSubmit() {
    
    // console.log('submit clicked', this.submitClicked);
    if (this.leadbatchMli) {
      return true;
    }
    if (this.submitClicked) {
      return true;
    }

    if(this.orgCode === 'CSB' && this.appNo) {
        if(this.rfActive){
          if(this.applicationData?.statusCode == 25 || this.applicationData?.statusCode == 27){
            return false;
          }else{
            return true;
          }
        }else{
          if(this.applicationData?.statusCode == 29 || this.applicationData?.statusCode == 28 || this.applicationData?.statusCode == 9){
              return true;
          }else{
            return false;
          }
        }
    }

    if (this.orgCode === 'DCB') {
      if (this.checkboxForm.get('checkbox1').value && this.checkboxForm.get('checkbox2').value) {
        return false;
      } else {
        return true;
      }
    } else if (this.askLeadConverted) {
      
      if (this.miscellaneousForm.invalid) {
        return true;
      } else return false;
    } else {
      // console.log('trueeeee', this.submitClicked);
      return false;
    }
  }

  uploadSec() {
    console.log(this.physicalJourney, this.appNo);
    if (this.physicalJourney && this.appNo) {
      return true;
    } else return false;
  }

  remarksAshtrix() {
    if (this.orgCode === 'SB' || this.orgCode === 'SIB' || this.orgCode === 'CBI') {
      // if (this.orgCode != "DCB") {
      if (
        this.firstFormGroup.get('status').value !== 1 ||
        this.firstFormGroup.get('status').value !== 24
      ) {
        return true;
      } else return false;
    } else {
      if (
        this.firstFormGroup.get('status').value == 6 ||
        this.firstFormGroup.get('status').value == 11 ||
        this.firstFormGroup.get('status').value == 2 ||
        this.firstFormGroup.get('status').value == 3 ||
        this.firstFormGroup.get('status').value == 4 ||
        this.firstFormGroup.get('status').value == 9 ||
        this.firstFormGroup.get('status').value == 12 ||
        this.firstFormGroup.get('status').value == 28 ||
        this.firstFormGroup.get('status').value == 29 ||
        this.firstFormGroup.get('status').value == 27
      ) {
        return true;
      } else return false;
    }
  }

  sendlLeadData(resData) {
    this.loaderService.showSpinner(true);
    this.lmsService.sendLeadDataToInsurer(resData['appNo'].toString()).subscribe(
      (sentResult) => {
        if (sentResult) {
          this.loaderService.showSpinner(false);
          let newdialog = this.dialog.open(ModalComponent, {
            data: sentResult,
            panelClass: 'dialog-width',
          });
          newdialog.afterClosed().subscribe((result) => {
            if (sentResult['statusCode'] === 1) {
              if (sentResult['redirectionUrl']) {
                window.open(sentResult['redirectionUrl'], '_blank');
                this.router.navigate(['/lms']);
              } else {
                this.router.navigate(['/lms']);
              }
            } else {
              this.router.navigate(['/lms']);
            }
          });
        }
      },
      (err) => {
        
        this.loaderService.showSpinner(false);
        let newdialog = this.dialog.open(ModalComponent, {
            data: {statusCode:0,message:"An error occurred while submitting the lead to the insurer."},
            panelClass: 'dialog-width',
          });
          newdialog.afterClosed().subscribe((result) => {
              this.router.navigate(['/lms']);
          });
      },
    );
  }

  isObject(obj) {
    for (let keys in obj) {
      if (typeof obj[keys] === 'object' && obj[keys] !== null) {
        let newObject = obj[keys];
        console.log('new keyobject', newObject);
        for (let key in newObject) {
          this.frmData.append(`${keys}[${key}]`, obj[keys][key]);
        }
      } else {
        this.frmData.append(keys, obj[keys]);
      }
    }
  }

  objectToFormData(obj, formData = new FormData()) {
    this.frmData = formData;
    this.createFormData = function (obj, subKeyStr = '') {
      for (let i in obj) {
        let value = obj[i];
        let subKeyStrTrans = subKeyStr ? subKeyStr + '[' + i + ']' : i;

        if (typeof value === 'string' || typeof value === 'number') {
          this.frmData.append(subKeyStrTrans, value);
        } else if (typeof value === 'object') {
          this.createFormData(value, subKeyStrTrans);
        }
      }
    };
    this.createFormData(obj);

    return this.frmData;
  }

  submitApplication() {
    // this.submitClicked =  true;
    // this.disableSubmit();
    this.loaderService.showSpinner(true);

    let isActive = false;
    console.log('insuredID', this.insurerId, this.orgCode);
    if (this.insurerId === 101 && this.orgCode === 'DCB') {
      isActive = true;
    } else if (
      (this.insurerId === 147 ||
        this.insurerId === 105 ||
        this.insurerId === 101 ||
        this.insurerId === 104 || 
        this.insurerId === 103) &&
      this.orgCode === 'CSB'
    ) {
      isActive = true;
    } else if (this.insurerId === 122 && this.orgCode === 'BOM') {
      isActive = true;
      //  for BOM Production -- false--
      // isActive = false;
    } else if ((this.insurerId === 111 || this.insurerId === 104) && this.orgCode === 'SIB') {
      isActive = true;
    } else if (
      (this.insurerId === 109 ||
        this.insurerId === 104 ||
        this.insurerId === 153 ||
        this.insurerId === 102 ||
        this.insurerId === 115 || 
        this.insurerId === 113) &&
      this.orgCode === 'DCB'
    ) {
      isActive = true;
      // only for uat 102
    }

    console.log(this.firstFormGroup.get('fls'), '<==this', this.firstFormGroup);

    if (!this.flsNotRequired) {
      this.flsDropDown.filter((fls) => {
        if (fls.id === this.firstFormGroup.get('fls').value) {
          console.log(fls.agentCode, '<==this');
          this.agentCode = fls.agentCode;
          this.flsName = fls.name;
        }
      });
      this.flsDropDown.filter((fls) => {
        if (fls.id === this.firstFormGroup.get('fls').value) {
          this.rowId = fls.rowId;
        }
      });
    }

    this.spDropdown.filter((sp) => {
      if (sp.spCode === this.summaryFormGroup.get('summarySP').value) {
        this.spName = sp.spName;
      }
    });
    console.log("check summary status = ", this.summaryFormGroup.get('summaryStatus').value)
    console.log('agent =', this.agentCode, this.frmData);
    
    const createApplicationData = {
      customerId: this.customerId,
      lob: this.lob,
      productType: this.productType,
      productId: this.summaryFormGroup.get('summaryProductName').value,
      productName: this.productName,
      insurerId: this.insurerId,
      insurerName: this.insurerName,
      spCode: this.summaryFormGroup.get('summarySP').value,
      statusCode: (this.orgCode === "CSB") ?  this.firstFormGroup.get('status').value:1,
      pt: this.firstFormGroup.get('pt').value,
      ppt: this.firstFormGroup.get('ppt').value,
      mode: this.firstFormGroup.get('mode').value,
      premiumAmount: this.firstFormGroup.get('premiumAmount').value,
      basePremium: this.firstFormGroup.get('basePremium').value,
      gst: this.firstFormGroup.get('gst').value,
      lgCode: this.summaryFormGroup.get('summaryLgCode').value,
      flsCode: this.firstFormGroup.get('fls')?.value,
      physicalJourney: this.physicalJourney,
      riskScore: this.physicalJourney == true ? this.secondFormGroup?.get('riskScore')?.value : 0,
      riskApetite: this.physicalJourney == true ? this.riskApetite : 0,
      orgCode: this.orgCode,
      applicationData: {
        active: isActive,
        flsCode: this.firstFormGroup.get('fls')?.value,
        agentCode: this.agentCode,
        rowId: this.rowId,
        proposerInsured: this.isProposerInsured,
        sumInsured: this.firstFormGroup.get('sumAssured').value,
        isFORMCApplicable: this.secondFormGroup.get('formCMli')?.value == 'true' ? true : false,
        leadTag: this.showLeadTag?this.summaryFormGroup.get('summaryLeadTag').value:"",
        proposer: {
          occupation: '',
          email: this.summaryFormGroup.get('summaryEmail').value,
          mobile:
            this.customerDetails?.mobileNo === '' && this.orgCode === 'DCB'
              ? '0'
              : this.summaryFormGroup.get('summaryMobile').value,
          // alternateMobile: this.summaryFormGroup.get('summaryAlternateMobile').value,
          panNo: this.summaryFormGroup.get('summaryPanNo').value
            ? this.summaryFormGroup.get('summaryPanNo').value?.toUpperCase()
            : '',
          annualIncome: this.summaryFormGroup.get('summaryAnnualIncome').value,
          ckycNumber: this.customerDetails?.ckycNumber,
          individual: this.isIndividual,
        },
        insureds: [
          {
            title: this.summaryFormGroup.get('summaryInsuredTitle').value,
            firstName: this.summaryFormGroup.get('summaryInsuredFirstName').value,
            lastName: this.summaryFormGroup.get('summaryInsuredLastName').value,
            dob: this.summaryFormGroup.get('summaryInsuredDOB').value,
            gender: this.summaryFormGroup.get('summaryInsuredGender').value,
            maritalStatus: this.summaryFormGroup.get('summaryInsuredMaritalStatus').value,
            occupation: '',
            email: this.summaryFormGroup.get('summaryInsuredEmail').value,
            mobile:
              this.customerDetails?.mobileNo === ''
                ? '0'
                : this.summaryFormGroup.get('summaryInsuredMobile').value,
            panNo: this.summaryFormGroup.get('summaryInsuredPanNo').value
              ? this.summaryFormGroup.get('summaryInsuredPanNo').value?.toUpperCase()
              : '',
            proposerRel: this.summaryFormGroup.get('summaryInsuredRelationship')?.value,
          },
        ],
        policyAddress: {
          addressType: 'PERMANENT',
          addressline1: this.summaryFormGroup.get('summaryPolicyaddressline1').value,
          addressline2: this.summaryFormGroup.get('summaryPolicyaddressline2').value,
          addressline3: this.summaryFormGroup.get('summaryPolicyaddressline3').value,
          city: this.summaryFormGroup.get('summaryPolicycity').value,
          state: this.summaryFormGroup.get('summaryPolicystate').value,
          country: this.country,
          countryCode: this.countryCode,
          postalcode: this.summaryFormGroup.get('summaryPolicypostalcode').value,
        },
        policyMailingAddressSame: this.policyMailingAddressSame,
        mailingAddress: {
          addressType: 'MAILING',
          addressline1: this.summaryFormGroup.get('summaryMailingaddressline1').value,
          addressline2: this.summaryFormGroup.get('summaryMailingaddressline2').value,
          addressline3: this.summaryFormGroup.get('summaryMailingaddressline3').value,
          city: this.summaryFormGroup.get('summaryMailingcity').value,
          country: this.country,
          countryCode: this.countryCode,
          state: this.summaryFormGroup.get('summaryMailingstate').value,
          postalcode: this.summaryFormGroup.get('summaryMailingpostalcode').value,
        },
        agencyData: {
          lgCode: this.summaryFormGroup.get('summaryLgCode').value,
          lgName: this.lgName,
          spCode: this.summaryFormGroup.get('summarySP').value,
          spName: this.spName,
          flsName: this.flsName,
          flsCode: this.firstFormGroup.get('fls')?.value,
        },
      },
    };

    console.log("createApplicationData ===== " , createApplicationData);
    if (this.orgCode === 'SIB') {
      createApplicationData.statusCode = 24;
    }
    if (this.isIndividual) {
      createApplicationData.applicationData.proposer['title'] =
        this.summaryFormGroup.get('summaryTitle')?.value;
      createApplicationData.applicationData.proposer['firstName'] =
        this.summaryFormGroup.get('summaryFirstName')?.value;
      createApplicationData.applicationData.proposer['middleName'] =
        (this.summaryFormGroup.get('summaryMiddleName')?.value?.trim() != ""?this.summaryFormGroup.get('summaryMiddleName')?.value?.trim():null);
      createApplicationData.applicationData.proposer['lastName'] =
        this.summaryFormGroup.get('summaryLastName')?.value;
      createApplicationData.applicationData.proposer['dob'] =
        this.summaryFormGroup.get('summaryDOB')?.value;
      createApplicationData.applicationData.proposer['gender'] =
        this.summaryFormGroup.get('summaryGender')?.value;
      createApplicationData.applicationData.proposer['maritalStatus'] =
        this.summaryFormGroup.get('summaryMaritalStatus')?.value;
    } else if (!this.isIndividual) {
      createApplicationData.applicationData.proposer['orgName'] =
        this.summaryFormGroup.get('summaryOrgName')?.value;
      createApplicationData.applicationData.proposer['dateOfIncorporation'] =
        this.summaryFormGroup.get('summaryOrgIncDate')?.value;
    }

    if (this.askLeadConverted) {
      createApplicationData.applicationData['leadConvertedStatus'] =
        this.miscellaneousForm?.get('leadConverted')?.value;
    }

    console.log('checking otp', createApplicationData);

    let dialogr;

    if (!this.isProposerInsured && (this.insurerId == 153 || this.insurerId == 102)) {
      createApplicationData.applicationData.insureds.forEach((insure) => {
        insure.title = createApplicationData.applicationData.proposer['title'];
        insure.firstName = createApplicationData.applicationData.proposer['firstName'];
        insure.lastName = createApplicationData.applicationData.proposer['lastName'];
        insure.panNo = createApplicationData.applicationData.proposer['panNo'];
        insure.gender = createApplicationData.applicationData.proposer['gender'];
        insure.email = createApplicationData.applicationData.proposer['email'];
        insure.panNo = createApplicationData.applicationData.proposer['panNo'];
        insure.dob = createApplicationData.applicationData.proposer['dob'];
        insure.mobile = createApplicationData.applicationData.proposer['mobile'];

        insure.maritalStatus = createApplicationData.applicationData.proposer['maritalStatus'];
      });
    }

    this.lmsService.submitApplication(createApplicationData).subscribe(
      (res: any) => {
        this.loaderService.showSpinner(false);

        if (res['isOtpRequired'] === true && !this.physicalJourney) {
          this.sendOtp(res);
        } else {
          if (this.physicalJourney) {
            const payload = {
              leadId: res['appNo'].toString(),
              files: [],
            };
            console.log('this.myfiles==', this.myFiles);
            for (let i = 0; i < this.myFiles.length; i++) {
              payload.files.push(this.myFiles[i]);
            }

            // this.callUploadFileRetry(payload, res);
            this.lmsService.uploadDocument(payload).subscribe(
              (result) => {
                console.log('uploaded succesfullly', result);
                if (result['message'].toLowerCase() == 'success') {
                  this.sendlLeadData(res);
                } else if (result['message'].toLowerCase() == 'fail') {
                  this.callUploadFileRetry(payload, res);
                } else {
                  let newdialog = this.dialog.open(ModalComponent, {
                    data: { message: 'Error uploading documents.' },
                    panelClass: 'dialog-width',
                  });
                }
              },
              (err) => {
                this.loaderService.showSpinner(false);
                let newdialog = this.dialog.open(ModalComponent, {
                  data: { message: 'Error uploading documents.' },
                  panelClass: 'dialog-width',
                });
                console.log('err', err);
              },
            );
          } else {
            if (this.orgCode !== 'SIB' && this.orgCode !== 'DCB') {
              this.sendlLeadData(res);
            } else {
              let newdialog = this.dialog.open(ModalComponent, {
                data: res,
                panelClass: 'dialog-width',
              });
              newdialog.afterClosed().subscribe((result) => {
                this.router.navigate(['/lms']);
              });
            }
          }
        }
      },
      (error) => {
        this.showSubmitErrorMessage = true;
        this.submitErrorMessage = 'Error while submitting the form. Please try after sometime.';
        this.loaderService.showSpinner(false);
      },
    );
  }

  callUploadFileRetry(payload, res): void {
    this.loaderService.showSpinner(true);
    const intervalId = setInterval(() => {
      this.lmsService.uploadDocument(payload).subscribe(
        (response) => {
          if (response['message'].toLowerCase() == 'success') {
            clearInterval(intervalId); // Stop the interval if success
            this.sendlLeadData(res);
          } else {
            this.retryCount++;

            if (this.retryCount >= this.maxRetries) {
              this.loaderService.showSpinner(false);
              clearInterval(intervalId); // Stop after 3 attempts
              let newdialog = this.dialog.open(ModalComponent, {
                data: { message: 'Error uploading documents.' },
                panelClass: 'dialog-width',
              });
            }
          }
        },
        (err) => {
          this.loaderService.showSpinner(false);
          clearInterval(intervalId); // Stop after 3 attempts

          let newdialog = this.dialog.open(ModalComponent, {
            data: { message: 'Error uploading documents.' },
            panelClass: 'dialog-width',
          });
          console.log('err', err);
        },
      );
    }, this.intervalTime);
  }

  showConsentOption() {
    if (this.customerConsent && !this.applicationData?.applicationData?.consentSubmittedTime) {
      return true;
    } else {
      return false;
    }
  }

  submitCustomerConsent(val) {
    this.loaderService.showSpinner(true);

    this.applicationData.statusCode = val == 0 ? 1 : 16;
    if (this.orgCode === 'DCB') {
      this.applicationData['applicationData']['riskProfileStatus'] =
        val == 0 ? 'Digitally Approved' : 'Rejected by customer';
      this.applicationData.status = val == 0 ? 'Initiated' : 'Rejected';
    }
    if (this.orgCode !== 'DCB') {
      this.applicationData.status = val == 0 ? 'Lead' : 'Rejected';
    }
    this.applicationData['applicationData']['consentSubmittedTime'] = moment(new Date()).format(
      'YYYY-MM-DD hh:mm:ss',
    );

    //fixed applied for DCB update application.
    this.applicationData.insurerId = this.firstFormGroup.get('insurer').value;


    this.lmsService.updateLmsApplication(this.applicationData).subscribe(
      (result) => {
        this.loaderService.showSpinner(false);

        if (val == 0) {
          this.loaderService.showSpinner(true);

          this.lmsService.sendLeadDataToInsurer(result['appNo'].toString()).subscribe(
            (sentResult) => {
              this.loaderService.showSpinner(false);

              if (sentResult) {
                this.loaderService.showSpinner(false);
                let newdialog = this.dialog.open(ModalComponent, {
                  data: sentResult,
                  panelClass: 'dialog-width',
                });
                newdialog.afterClosed().subscribe((result) => {
                  this.logout(sentResult['message']);
                });
              }
            },
            (err) => {
              this.loaderService.showSpinner(false);
            },
          );
        } else {
          this.loaderService.showSpinner(false);
          const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
            data: 'Lead has been Rejected',
            // 'Lead/Application status Updated Successfully',
            panelClass: 'dialog-width',
          });
          this.logout('Lead has been Rejected');
        }
      },
      (error) => {
        this.showSubmitErrorMessage = true;
        this.submitErrorMessage = 'Error while submitting the form. Please try after sometime.';
        this.loaderService.showSpinner(false);
      },
    );
  }

  logout(msg) {
    console.log('onsinde logoutt');
    sessionStorage.clear();
    this.tokenService.removeToken();
    this.accountService.isUserLoggedIn = false;
    this.router.navigate([`/consentSuccessful/${msg}`]);
  }

  updateApplication() {
    console.log('update application');
    this.insurerId = Number(this.firstFormGroup.get('insurer').value);
    
    if (this.insurerId != 101 && this.insurerId != "") {
      console.log(this.firstFormGroup.get('status').value);
      if (this.firstFormGroup.get('status').value !== 1) {
        console.log('inside insurer application no submit');
        this.applicationData.insurerApplicationNo =
          this.firstFormGroup.get('insurerApplicationNo')?.value;
      }
      
      
    let isActive = false;
    console.log('insuredID', this.insurerId, this.orgCode);
    if (this.insurerId === 101 && (this.orgCode === 'DCB' || this.orgCode === 'SB')) {
      isActive = true;
    } else if ((this.insurerId === 104 || this.insurerId === 103 || this.insurerId === 147 || this.insurerId === 101) && this.orgCode === 'CSB') {
      isActive = true;
    } else if (this.insurerId === 122 && this.orgCode === 'BOM') {
      isActive = true;
      //  for BOM Production -- false--
      // isActive = false;
    } else if ((this.insurerId === 111 || this.insurerId === 104) && this.orgCode === 'SIB') {
      isActive = true;
    } else if (
      (this.insurerId === 109 ||
        this.insurerId === 104 ||
        this.insurerId === 153 ||
        this.insurerId === 102 ||
        this.insurerId === 115) &&
      this.orgCode === 'DCB'
    ) {
      isActive = true;
      // only for uat 102
    }

      if(this.orgCode === "CSB"){
        this.applicationData.policyNo = this.firstFormGroup.get('policyNo')?.value;
        this.applicationData.policyStartDate = this.firstFormGroup.get('policyStartDate')?.value;
        this.applicationData.policyEndDate = this.firstFormGroup.get('policyEndDate')?.value;
        this.applicationData.pt = this.firstFormGroup.get('pt')?.value;
        if (this.firstFormGroup.get('ppt')?.value) {
          this.applicationData.ppt = this.firstFormGroup.get('ppt')?.value;
        } else {
          this.applicationData.ppt = 0;
        }
        this.applicationData.mode = this.applicationData.mode = this.firstFormGroup.get('mode')?.value ?? 0;
        this.applicationData.premiumAmount = this.firstFormGroup.get('premiumAmount')?.value ?? 0;
        this.applicationData.basePremium = this.firstFormGroup.get('basePremium')?.value ?? 0;
        this.applicationData.gst = this.firstFormGroup.get('gst')?.value ?? 0;
        this.applicationData.applicationData.sumInsured = this.firstFormGroup.get('sumAssured')?.value;
      }

      if (this.firstFormGroup.get('status').value === 9) {
        this.applicationData.policyNo = this.firstFormGroup.get('policyNo').value;
        this.applicationData.policyStartDate = this.firstFormGroup.get('policyStartDate').value;
        this.applicationData.policyEndDate = this.firstFormGroup.get('policyEndDate').value;
        this.applicationData.pt = this.firstFormGroup.get('pt').value;
        if (this.firstFormGroup.get('ppt')?.value) {
          this.applicationData.ppt = this.firstFormGroup.get('ppt')?.value;
        } else {
          this.applicationData.ppt = 0;
        }
        this.applicationData.mode = this.firstFormGroup.get('mode').value;
        this.applicationData.premiumAmount = this.firstFormGroup.get('premiumAmount').value;
        this.applicationData.basePremium = this.firstFormGroup.get('basePremium').value;
        this.applicationData.gst = this.firstFormGroup.get('gst').value;
        // --sib issue -- paginations search --
        // this.applicationData.insurerLeadStatus =
        // --
        this.applicationData.applicationData.sumInsured =
          this.firstFormGroup.get('sumAssured').value;
        this.applicationData.remarks = this.firstFormGroup.get('remarks')?.value;
        this.initiatePayment();
      } else if (this.firstFormGroup.get('status').value === 7) {
        this.applicationData.premiumAmount = this.firstFormGroup.get('premiumAmount').value;
      } else if (
        (this.firstFormGroup.get('status').value === 6 ||
          this.firstFormGroup.get('status').value === 3 ||
          this.firstFormGroup.get('status').value === 11) &&
        this.orgCode === 'DCB'
      ) {
        this.applicationData.remarks = this.firstFormGroup.get('remarks').value;
      } else if (this.orgCode !== 'DCB') {
        this.applicationData.remarks = this.firstFormGroup.get('remarks')?.value;
      }


      
      console.log('thisisproposerInsurer', this.isProposerInsured);
      if (this.applicationData?.applicationData.isProposerInsured !== this.isProposerInsured) {
        let insured = {
          title: this.summaryFormGroup.get('summaryInsuredTitle').value,
          firstName: this.summaryFormGroup.get('summaryInsuredFirstName').value,
          lastName: this.summaryFormGroup.get('summaryInsuredLastName').value,
          dob: this.summaryFormGroup.get('summaryInsuredDOB').value,
          gender: this.summaryFormGroup.get('summaryInsuredGender').value,
          maritalStatus: this.summaryFormGroup.get('summaryInsuredMaritalStatus').value,
          occupation: '',
          email: this.summaryFormGroup.get('summaryInsuredEmail').value,
          mobile:
            this.customerDetails?.mobileNo === ''
              ? '0'
              : this.summaryFormGroup.get('summaryInsuredMobile').value,
          panNo: this.summaryFormGroup.get('summaryInsuredPanNo').value
            ? this.summaryFormGroup.get('summaryInsuredPanNo').value?.toUpperCase()
            : '',
          proposerRel: this.summaryFormGroup.get('summaryInsuredRelationship')?.value,
        };

        this.applicationData.applicationData?.insureds?.pop();
        this.applicationData.applicationData?.insureds?.push(insured);
      }
      this.applicationData.applicationData['proposerInsured'] = this.isProposerInsured;
      this.applicationData.applicationData.proposer['panNo'] =
        this.summaryFormGroup.get('summaryPanNo').value;
      let updatedStatus;
      this.statusDropDown.filter((st) => {
        if (st.id.toString() === this.firstFormGroup.get('status').value.toString()) {
          updatedStatus = st.value;
        }
      });
      if(this.orgCode != "CSB"){
          this.applicationData.insurerLeadStatus = updatedStatus;
      }
      
      this.applicationData.leadStatus = updatedStatus;
      this.applicationData.status = updatedStatus;
      this.applicationData.leadStatusCode = this.firstFormGroup.get('status').value;
      
      this.applicationData.insurerId = this.firstFormGroup.get('insurer').value;
      

      (this.applicationData.lob = this.lob),
        (this.applicationData.productType = this.productType),
        (this.applicationData.productId = this.firstFormGroup.get('productName').value);
      this.applicationData.productName = this.productName;
        (this.applicationData.insurerName = this.insurerName),
        (this.applicationData.statusCode = this.firstFormGroup.get('status').value);
      // this.applicationData.applicationData.policyAddress.addressType = 'PERMANENT',
      (this.applicationData.applicationData.policyAddress.addressline1 = this.summaryFormGroup.get(
        'summaryPolicyaddressline1',
      ).value),
        (this.applicationData.applicationData.policyAddress.addressline2 =
          this.summaryFormGroup.get('summaryPolicyaddressline2').value),
        (this.applicationData.applicationData.policyAddress.addressline3 =
          this.summaryFormGroup.get('summaryPolicyaddressline3').value),
        (this.applicationData.applicationData.policyAddress.city =
          this.summaryFormGroup.get('summaryPolicycity').value),
        // this.applicationData.applicationData.policyAddress.country = this.country,
        // this.applicationData.applicationData.policyAddress.countryCode = this.countryCode,
        (this.applicationData.applicationData.policyAddress.postalcode =
          this.summaryFormGroup.get('summaryPolicypostalcode').value);
      (this.applicationData.applicationData.mailingAddress.addressline1 = this.summaryFormGroup.get(
        'summaryMailingaddressline1',
      ).value),
        (this.applicationData.applicationData.mailingAddress.addressline2 =
          this.summaryFormGroup.get('summaryMailingaddressline2').value),
        (this.applicationData.applicationData.mailingAddress.addressline3 =
          this.summaryFormGroup.get('summaryMailingaddressline3').value),
        (this.applicationData.applicationData.mailingAddress.city =
          this.summaryFormGroup.get('summaryMailingcity').value),
        // this.applicationData.applicationData.mailingAddress.country = this.country,
        // this.applicationData.applicationData.mailingAddress.countryCode = this.countryCode,
        (this.applicationData.applicationData.mailingAddress.postalcode = this.summaryFormGroup.get(
          'summaryMailingpostalcode',
        ).value);
      // console.log(this.applicationData);
      this.applicationData.lgCode = this.summaryFormGroup.get(
          'summaryLgCode',
        ).value;
      
      this.applicationData.applicationData.agencyData.lgName = this.lgName;
      this.applicationData.applicationData.agencyData.lgCode = this.summaryFormGroup.get(
          'summaryLgCode',
        ).value;
      this.applicationData.applicationData.active = isActive;
      this.applicationData.rmCode = this.firstFormGroup.get('fls')?.value;
      this.applicationData.applicationData.flsCode = this.firstFormGroup.get('fls')?.value;
      this.applicationData.applicationData.rmCode = this.firstFormGroup.get('fls')?.value;
      if (!this.flsNotRequired) {
      this.flsDropDown.filter((fls) => {
        if (fls.id === this.firstFormGroup.get('fls').value) {
          console.log(fls.agentCode, '<==this');
          this.agentCode = fls.agentCode;
          this.flsName = fls.name;
        }
      });
      this.flsDropDown.filter((fls) => {
        if (fls.id === this.firstFormGroup.get('fls').value) {
          this.rowId = fls.rowId;
        }
      });
    }
    
      this.applicationData.applicationData.rmName = this.flsName;
      this.loaderService.showSpinner(true);
      this.lmsService.updateLmsApplication(this.applicationData).subscribe(
        (result) => {
          this.loaderService.showSpinner(false);
          const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
            data: result['message'],
            // 'Lead/Application status Updated Successfully',
            panelClass: 'dialog-width',
          });
          dialogRef.afterClosed().subscribe((data) => {
            // navigate
            if(this.orgCode === "CSB"){
              if(this.summaryFormGroup.get('summaryStatus').value == 26){
                  this.sendlLeadData(result);
              }else{
                  this.router.navigate(['/lms']);
              }
            }else{
              this.router.navigate(['/lms']);
            }
            
          });
        },
        (error) => {
          this.showSubmitErrorMessage = true;
          this.submitErrorMessage = 'Error while submitting the form. Please try after sometime.';
          this.loaderService.showSpinner(false);
        },
      );
    } else {
      const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
        data: 'Lead/Application cannot be updated manually',
        panelClass: 'dialog-width',
      });
      dialogRef.afterClosed().subscribe((data) => {
        // navigate
      });
    }
  }

  initiatePayment() {
    let instrumentDate;
    let paymentTypeCopy = '';
    const paymentType = this.paymentForm.get('paymentType').value;
    if (paymentType !== 'DBT' && paymentType !== 'OP') {
      const checkDate = new Date(this.paymentForm.get('chkOrDDDate').value);
      instrumentDate =
        checkDate.getFullYear() +
        '-' +
        ('0' + (checkDate.getMonth() + 1)).slice(-2) +
        '-' +
        ('0' + checkDate.getDate()).slice(-2);
    }
    if (this.orgCode === 'SIB' && paymentType === 'DD') {
      paymentTypeCopy = 'CHQ';
    } else {
      paymentTypeCopy = paymentType;
    }
    const onlyCheck = paymentType !== 'DBT' && paymentType !== 'OP';
    const paymentBody = {
      paymentType: paymentTypeCopy,
      cifNo: paymentType === 'DBT' ? this.accountDetails[0].cifNo : undefined,
      bankAccountNo:
        paymentType === 'DBT' ? this.paymentForm.get('accountNumber').value : undefined,
      instrumentDate,
      instrumentNo: onlyCheck ? this.paymentForm.get('chequeOrDDNo').value : undefined,
      ifscCode: onlyCheck ? this.paymentForm.get('ifscCode').value : undefined,
      micrCode: onlyCheck ? this.paymentForm.get('micrCode').value : undefined,
      paymentRefNo: paymentType === 'DBT' ? this.paymentForm.get('referenceNo').value : undefined,
      insurerId: this.applicationData.insurerCode,
      premiumPayable: this.firstFormGroup.get('premiumAmount').value,
      appNo: this.applicationData.applicationNo,
      paymentDate: this.paymentForm.get('dateOfPayment').value,
    };

    this.applicationData.applicationData.paymentInfo = paymentBody;
    console.log('paymentbody', paymentBody);
  }

  formC(inv) {}

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
    // this.secondFormGroup.get('dob').setValue(moment(newDate).format('YYYY-MM-DD'));
    this.secondFormGroup.get('insuredDob').setValue(moment(newDate).format('YYYY-MM-DD'));
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
        'paymentMethod',
        new FormControl({
          value: this.applicationData.applicationData?.paymentInfo?.paymentMethod,
          disabled: true,
        }),
      );
      this.paymentForm.addControl(
        'accountNumber',
        new FormControl({
          value: this.applicationData.applicationData?.paymentInfo?.bankAccountNo,
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

  base64Pdf(data) {
    const byte64Data = data;
    const byteArray = new Uint8Array(
      atob(byte64Data)
        .split('')
        .map((char) => char.charCodeAt(0)),
    );
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    console.log('url-->', url);
    window.open(url, '_blank');
  }

  getCidf() {
    this.loaderService.showSpinner(true);
    this.lmsService.getCidfForLead(this.appNo).subscribe(
      (res) => {
        if (res['reportUrl']) {
          this.loaderService.showSpinner(false);
          this.isDownloadCIDF = true;
          window.open(res['reportUrl'], '_blank');
        } else if (res['resultData']) {
          this.base64Pdf(res['resultData']);
          this.loaderService.showSpinner(false);
        } else {
          this.loaderService.showSpinner(false);
          this.dialog.open(PolicyErrorModalComponent, {
            data: 'Unable to download PDF, Please try after sometime.',
            panelClass: 'dialog-width',
          });
        }
      },
      (error) => {
        this.dialog.open(PolicyErrorModalComponent, {
          data: 'Unable to download PDF, Please try after sometime.',
          panelClass: 'dialog-width',
        });
      },
    );
  }

  makeAcceptDisable() {
    if (this.orgCode === 'DCB') {
      if(!this.showCIDFOnlyForLife){
        return false;
      }else{
        return this.isDownloadCIDF ? false : true;
      }
    } else if (this.orgCode === 'SIB') {
      return false;
    }
  }

  onPaymentMethodChange(event) {
    // let check = true;
    if (event.value === 'DBT') {
      console.log('check value', this.checkPaymentType);

      this.paymentForm.addControl(
        'accountNumber',
        new FormControl(this.accountDetails[0]?.accountNo, Validators.required),
      );

      this.paymentForm.addControl('referenceNo', new FormControl(''));
      this.paymentForm.removeControl('chequeOrDDNo');
      this.paymentForm.removeControl('chkOrDDDate');
      this.paymentForm.removeControl('ifscCode');
      this.paymentForm.removeControl('micrCode');
    } else if (event.value === 'CHQ') {
      this.paymentForm.removeControl('accountNumber');
      this.paymentForm.removeControl('referenceNo');
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
    } else if (event.value === 'OP') {
      this.paymentForm.addControl('paymentMethod', new FormControl('', [Validators.required]));
      this.paymentForm.addControl('referenceNo', new FormControl(''));

      this.paymentForm.removeControl('chequeOrDDNo');
      this.paymentForm.removeControl('chkOrDDDate');
      this.paymentForm.removeControl('ifscCode');
      this.paymentForm.removeControl('micrCode');
      this.paymentForm.removeControl('accountNumber');
    } else {
      this.paymentForm.removeControl('accountNumber');
      this.paymentForm.removeControl('paymentMethod');
      this.paymentForm.removeControl('referenceNo');
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
      } else if (this.paymentForm.get('paymentType').value === 'CHQ') {
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
      } else if (this.paymentForm.get('paymentType').value === 'OP') {
        this.summaryFormGroup.addControl(
          'summaryPaymentMethod',
          new FormControl(this.paymentForm.get('paymentMethod')?.value),
        );
        this.summaryFormGroup.removeControl('summarychequeOrDDNo');
        this.summaryFormGroup.removeControl('summarychkOrDDDate');
        this.summaryFormGroup.removeControl('summaryifscCode');
        this.summaryFormGroup.removeControl('summarymicrCode');
        this.summaryFormGroup.removeControl('accountNumber');
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
    if (this.isInsurerUser || this.orgCode === "CSB") {
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
      if (this.firstFormGroup.get('confirmpt').value !== null) {
        this.confirmCheck(value, 5);
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
      if (this.firstFormGroup.get('confirmppt')?.value !== null) {
        this.confirmCheck(value, 4);
      }
    }
  }

  onInsuredTitleChange(event) {
    console.log('✅secomd=', event.value);

    this.insuredTitleDropdown.filter((title) => {
      console.log('🚗', title);
      if (event.value === title.id) {
        if (title.gender !== 'B') {
          this.secondFormGroup.get('insuredGender').setValue(title.gender);
          this.secondFormGroup.get('insuredGender').disable();
        } else {
          this.secondFormGroup.get('insuredGender').enable();
          console.log(this.insurerId, this.firstFormGroup.get('insurer').value);
          // if (this.insurerId === 109 && this.genderDropDown.length < 3) {
          //   this.genderDropDown.push({ id: 'T', value: 'Transgender' });
          // }
        }
      }
    });
    let genderOfTitle;
    this.insuredTitleDropdown.filter((title) => {
      if (title.id == event.value) {
        genderOfTitle = title.gender;
      }
    });
    this.proposerRelationShipCopy = this.proposerRelationShip.filter((rel) => {
      return rel.gender == genderOfTitle;
    });
  }

  onProposerRelationShipChange(event) {
    if (this.orgCode === 'CSB') {
      this.proposerRelationShip.filter((title) => {
        if (event.value === title.id) {
          if (title.gender !== 'B') {
            this.secondFormGroup.get('insuredGender').setValue(title.gender);
            this.secondFormGroup.get('insuredGender').disable();
          } else {
            this.secondFormGroup.get('insuredGender').enable();
            console.log(this.insurerId, this.firstFormGroup.get('insurer').value);
          }
        }
      });
    }
  }

  onPostalCodeChange(pincode, index) {
    if (pincode.length === 6) {
      this.loaderService.showSpinner(true);
      this.lmsService.getCityAndState(pincode).subscribe(
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
    const postalcodeRegex = /^[1-9]{1}[0-9]{5,5}$/;
    if (event.value === 'yes') {
      this.policyMailingAddressSame = true;
      this.thirdFormGroup.removeControl('mailingaddressline1');
      this.thirdFormGroup.removeControl('mailingaddressline2');
      this.thirdFormGroup.removeControl('mailingaddressline3');
      this.thirdFormGroup.removeControl('mailingpostalcode');
      this.thirdFormGroup.removeControl('mailingcity');
      this.thirdFormGroup.removeControl('mailingstate');
    } else {
      this.policyMailingAddressSame = false;

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

  onProposerChange(event) {
    if (event.value == 'no') {
      this.isProposerInsured = false;
      if (
        this.firstFormGroup.get('insurer').value !== '153' &&
        this.firstFormGroup.get('insurer').value !== '102'
      ) {
        this.notSame = true;

        this.secondFormGroup.addControl('insueredtitle', new FormControl('', Validators.required));
        this.secondFormGroup.addControl(
          'insuredFname',
          new FormControl('', [
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(45),
            Validators.pattern(/^[a-zA-Z]+$/),
          ]),
        );
        this.secondFormGroup.addControl(
          'insuredLname',
          new FormControl('', [
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(45),
            Validators.pattern(/^[a-zA-Z]+$/),
          ]),
        );
        this.secondFormGroup.addControl('insuredDob', new FormControl('', Validators.required));
        //sunjith
        if (
          this.orgCode === 'BOM' ||
          this.orgCode === 'SIB' ||
          this.orgCode === 'CSB' ||
          this.orgCode === 'SB'
        ) {
          this.secondFormGroup.addControl('relationship', new FormControl('', Validators.required));
        }
        this.secondFormGroup.addControl('insuredGender', new FormControl('', Validators.required));
        this.secondFormGroup.addControl(
          'insuredMarritalStatus',
          new FormControl('', [Validators.required, Validators.pattern(this.maritalStatusArray)]),
        );
        this.secondFormGroup.addControl(
          'insuredEmail',
          new FormControl('', [
            Validators.required, 
            Validators.pattern(/^[a-zA-Z0-9]+([._+-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(-?[a-zA-Z0-9]+)*(\.[a-zA-Z]{2,})+$/)
          ]),
        );
        this.secondFormGroup.addControl(
          'insuredPhone',
          new FormControl('', [
            Validators.required,
            Validators.pattern('^[0-9]*$'),
            Validators.minLength(10),
            Validators.maxLength(10),
          ]),
        );
        this.secondFormGroup.addControl(
          'insuredPan',
          new FormControl('', [Validators.pattern(this.panNoNewRegex)]),
        );
        this.secondFormGroup.addControl('summaryInsuredTitle', new FormControl());
        this.secondFormGroup.addControl('summaryInsuredFirstName', new FormControl());
        this.secondFormGroup.addControl('summaryInsuredLastName', new FormControl());
        this.secondFormGroup.addControl('summaryInsuredDOB', new FormControl());
        this.secondFormGroup.addControl('summaryInsuredGender', new FormControl());
        this.secondFormGroup.addControl('summaryInsuredMaritalStatus', new FormControl());
        this.secondFormGroup.addControl('summaryInsuredEmail', new FormControl());
        this.secondFormGroup.addControl('summaryInsuredMobile', new FormControl());
        this.secondFormGroup.addControl('summaryInsuredPanNo', new FormControl());
        if (this.orgCode === 'BOM') {
          this.secondFormGroup.addControl('summaryInsuredRelationship', new FormControl());
        }
      }
    } else {
      console.log('🥳🥳Event', event);

      this.notSame = false;
      this.isProposerInsured = true;

      this.secondFormGroup.removeControl('insueredtitle');
      this.secondFormGroup.removeControl('insuredFname');
      this.secondFormGroup.removeControl('insuredLname');
      this.secondFormGroup.removeControl('insuredDob');
      this.secondFormGroup.removeControl('insuredGender');
      this.secondFormGroup.removeControl('insuredMarritalStatus');
      this.secondFormGroup.removeControl('insuredEmail');
      this.secondFormGroup.removeControl('insuredPhone');
      this.secondFormGroup.removeControl('insuredPan');
      this.secondFormGroup.removeControl('summaryInsuredTitle');
      this.secondFormGroup.removeControl('summaryInsuredFirstName');
      this.secondFormGroup.removeControl('summaryInsuredLastName');
      this.secondFormGroup.removeControl('summaryInsuredDOB');
      this.secondFormGroup.removeControl('summaryInsuredGender');
      this.secondFormGroup.removeControl('summaryInsuredMaritalStatus');
      this.secondFormGroup.removeControl('summaryInsuredEmail');
      this.secondFormGroup.removeControl('summaryInsuredMobile');
      this.secondFormGroup.removeControl('summaryInsuredPanNo');
      this.secondFormGroup.removeControl('relationship');

      if (this.orgCode === 'BOM') {
        this.secondFormGroup.removeControl('summaryInsuredRelationship');
      }
      console.log('secondtoday', this.secondFormGroup.value);
      // this.secondFormGroup.updateValueAndValidity();
    }
  }

  csvInputChange(fileInputEvent: any) {
    console.log(fileInputEvent.target.files[0]);
  }

  calculateFilesSize(size) {
    console.log('totalsize  --', this.totalSize, size);
    this.totalSize = this.totalSize + size;

    if (this.totalSize / 1024 > 5000) {
      this.totalSize = this.totalSize - size;
      this.fileUploadError = true;
      return false;
    } else {
      let newArr = [];
      console.log('totalsize=', this.totalSize);
      let fSExt = ['Bytes', 'KB', 'MB'];
      let j = 0;
      while (size > 900) {
        size /= 1024;
        j++;
      }
      let exactSizeNumber = Math.round(this.totalSize * 100) / 100;
      let exactSize = Math.round(size * 100) / 100 + fSExt[j];
      newArr.push(exactSize);
      console.log('FILE SIZE = ', j, exactSize, exactSizeNumber, newArr);
      // alert(exactSize);
      console.log(this.totalSize / 1024);

      this.fileUploadError = false;
      return true;
    }
  }

  getFileDetails(e) {
    let canUpload;
    let files = [];
    let fileList = e.target.files;
    this.allFile = fileList[0];
    for (var i = 0; i < fileList.length; i++) {
      let size = e.target.files[i].size;
      canUpload = this.calculateFilesSize(size);
    }
    if (canUpload) {
      for (let i = 0; i < fileList.length; i++) {
        this.displayFileName.push(fileList.item(i).name);
        this.secondFormGroup.controls.fileUpload.touched;
      }
      this.newFiles = this.newBase64(e);
      console.log('this.new', this.newFiles);
    }
  }

  newBase64(e) {
    let files = e.target.files;
    // let reader = new FileReader();

    let file;
    for (let i = 0; i < files.length; i++) {
      let reader = new FileReader();
      file = files[i];
      reader.onload = (file) => {
        this.myFiles.push(reader.result);
        console.log('myfiles=onload=', this.myFiles);
        this.compress(this.myFiles);
      };
      reader.readAsDataURL(file);
    }
    // this.newFiles = JSON.parse(JSON.stringify(baseFiles));
    console.log('myfiles==', this.myFiles);
    // this.compress(this.myFiles[0]);
  }

  // working compress jpeg & Jpg

  compress(files) {
    console.log('insinde els if', files);
    //     this.imageCompress.uploadMultipleFiles()
    // .then((arrayOfFiles: { image: string, fileName:string, orientation: number }[]) => //...
    this.imageCompress
      .compressFile(files, DOC_ORIENTATION.Default, 70, 70)
      .then((compressedImage) => {
        let newImage = compressedImage;
        console.log(
          'Size in bytes after compression is now:',
          this.imageCompress.byteCount(newImage),
        );
      });
  }

  getBase64() {
    this.myFiles.forEach((file) => {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        console.log(reader.result);
      };
    });
  }

  MinDate(): Date {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDay();

    return new Date(currentYear - 100, currentMonth, currentDay);
  }

  omitCharE(event) {
    console.log('in here', ['e', 'E', '+', '-'].includes(event.key) && event.preventDefault());
    ['e', 'E', '+', '-'].includes(event.key) && event.preventDefault();
    // let k;
    // k = event.charCode;
    // console.log(k);
    // //         k = event.keyCode;  (Both can be used)
    // return (
    //   (k > 63 && k < 91) ||
    //   (k > 96 && k < 123) ||
    //   k == 8 ||
    //   k == 32 ||
    //   k == 46 ||
    //   k == 45 ||
    //   k == 95 ||
    //   (k >= 48 && k <= 57)
    // );
  }

  openNeedAnalysis() {
    let needAnalysisDialog = this.dialog.open(NeedInvestmentComponent, {
      panelClass: 'need-investment-dialog',
    });
  }

  private getValidationMsg() {
    return {
      pt: [
        { type: 'required', message: 'Policy Term is required' },
        { type: 'pattern', message: 'Policy Term cannot be zero: Start from 1 not zero' },
        // { type: 'min', message: 'Policy Term cannot be zero: Start from 1 not zero' },
        {
          type: 'mustMatch',
          message: 'Policy Term should match with Confirm Policy Term',
        },
        { type: 'max', message: 'Policy Term cannot be greater than 99 years' },
      ],
      confirmpt: [
        { type: 'mustMatch', message: 'Confirm Policy Term should match with Policy Term' },
      ],
      ppt: [
        { type: 'required', message: 'Premium Paying Term is required' },
        { type: 'pattern', message: 'Premium Paying Term cannot be zero: Start from 1 not zero' },
        {
          type: 'mustMatch',
          message: 'Premium Paying Term should match with Confirm Premium Paying Term',
        },
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
      riskScore: [
        { type: 'min', message: 'Minimun Risk Profile Score should be not less than 100' },
        { type: 'max', message: 'Maximum Risk Profile Score should be not more than 400' },
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
      lgCode: [{ type: 'required', message: `required` }],
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
      insueredtitle: [
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
      insuredFname: [
        { type: 'required', message: this.translateService.instant('error.FIRST_NAME_REQUIRED') },
        { type: 'minlength', message: this.translateService.instant('error.FIRST_NAME_MAX') },
        { type: 'maxlength', message: this.translateService.instant('error.FIRST_NAME_MAX') },
        { type: 'pattern', message: 'Enter only alphabets' },
      ],
      insuredLname: [
        { type: 'required', message: this.translateService.instant('error.LAST_NAME_REQUIRED') },
        { type: 'minlength', message: this.translateService.instant('error.LAST_NAME_MIN') },
        { type: 'maxlength', message: this.translateService.instant('error.LAST_NAME_MAX') },
        { type: 'pattern', message: 'Enter only alphabets' },
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
      annualIncome: [
        {
          type: 'required',
          message: 'Enter Annual Income',
        },
        { type: 'pattern', message: 'Please enter valid number' },
      ],
      mobile: [
        {
          type: 'required',

          message:
            'Mobile number should contain 10 digits as a consent code will be sent to the customer mobile number',
        },
        { type: 'pattern', message: this.translateService.instant('error.MOBILE_INVALID') },
        {
          type: 'minlength',
          message:
            'Mobile number should contain 10 digits as a consent code will be sent to the customer mobile number',
        },
        {
          type: 'maxlength',
          message:
            'Mobile number should contain 10 digits as a consent code will be sent to the customer mobile number',
        },
      ],
      alternateMobile: [
        { type: 'required', message: this.translateService.instant('error.MOBILE_REQUIRED') },
        { type: 'pattern', message: this.translateService.instant('error.MOBILE_INVALID') },
        { type: 'minlength', message: this.translateService.instant('error.MOBILE_MIN') },
        { type: 'maxlength', message: this.translateService.instant('error.MOBILE_MAX') },
      ],
      insuredPhone: [
        { type: 'required', message: this.translateService.instant('error.MOBILE_REQUIRED') },
        { type: 'pattern', message: this.translateService.instant('error.MOBILE_INVALID') },
        { type: 'minlength', message: 'Mobile Number should be 10 Digits' },
        { type: 'maxlength', message: 'Mobile Number should be 10 Digits' },
      ],
      insuredMobile: [
        { type: 'required', message: this.translateService.instant('error.MOBILE_REQUIRED') },
        { type: 'pattern', message: this.translateService.instant('error.MOBILE_INVALID') },
        { type: 'minlength', message: this.translateService.instant('error.MOBILE_MIN') },
        { type: 'maxlength', message: this.translateService.instant('error.MOBILE_MAX') },
      ],
      email: [
        { type: 'required', message: this.translateService.instant('error.EMAIL_REQUIRED') },
        { type: 'email', message: this.translateService.instant('error.EMAIL_INVALID') },
        { type: 'pattern', message: this.translateService.instant('error.EMAIL_INVALID') },
      ],
      insuredEmail: [
        { type: 'required', message: this.translateService.instant('error.EMAIL_REQUIRED') },
        { type: 'email', message: this.translateService.instant('error.EMAIL_INVALID') },
        { type: 'pattern', message: this.translateService.instant('error.EMAIL_INVALID') },
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
      insuredPan: [
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
