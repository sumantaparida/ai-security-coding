import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { applicationDataJson } from '@app/LMS/form-data';
// import { sampleApplicationData } from '@app/proposal/form-data';
// import { sampleAccountDetails, sampleApplicationData } from '@app/proposal/form-data';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';
import { User } from '@app/_models';
import { AccountService } from '@app/_services';
import { LoaderService } from '@app/_services/loader.service';
import * as moment from 'moment';
import { InitiatePaymentService } from './services/initiate-payment.service';
import { Subscription } from 'rxjs';
// import { accNo, sampleApplicationData } from '@app/proposal/form-data';

@Component({
  selector: 'app-initiate-payment',
  templateUrl: './initiate-payment.component.html',
  styleUrls: ['./initiate-payment.component.css'],
})
export class InitiatePaymentComponent implements OnInit, OnDestroy {
  paymentForm: FormGroup;

  accountDetails;

  threeMonthsBack: Date;

  todaysDate: Date;

  applicationNo;

  orgCode;

  applicationDetails;

  customerCif;

  accountType;

  reqFormControl=[];

  formSubscription:Subscription;

  isSib = false;

  dynamic = false;

  metaData; 

  insurerNameList=[{name:"Bharti AXA Life Insurance Co. Ltd.",id:130},{name:"PNB MetLife India Insurance Co. Ltd.",id:117},{name:"Universal Sompo General Insurance Company LTD",id:134},{name:"Bajaj Allianz General Insurance Company LTD",id:113},{name:"LIC of India",id:512}]

  inputvalue;

 kblMetadataGC = {
  sections:[
  { label:'',
    formData:[
      { getOptions:false,options:[ { id: 'DBT', value: 'Direct Debit' },
      { id: 'DBTLA', value: 'Loan Account Debit' },
      ],defaultValue:'DBT',label:'Payment Type', controlType: 'radio', controlName: 'paymentType', value: 'DBT', disable: false, valueTag: [], key: '', showMessageOnChange:true,message:'Please ensure that sufficient amount is available in the loan account to disburse the amount', validators: {} },
    ]
  },
  {label:'',
        formData:[
          { isDependent:true,parentControlName:'paymentType',showIfParentValue:['DBT'],optionSource:'accountDetails', getOptions:true,options:[],defaultValue:'',label:'Account Number', controlType: 'select', controlName: 'accountNumber', value: '', valueTag:[] , key: '', disable: false, validators: {required:'required'}},
          { isDependent:true,parentControlName:'paymentType',showIfParentValue:['DBTLA'],getOptions:false, options:[],defaultValue:'',label:'Loan Account Number', controlType: 'text', controlName: 'loanAccountNumber', value: '', valueTag:['applicationDetails','applicationData','loanDetails'] ,  key: 'loanNo', disable: false, validators: {required:'required',pattern:'^[0-9]*$',minLength:16,maxLength:16} },
          { isDependent:true,parentControlName:'paymentType',showIfParentValue:['DBT'],getOptions:false, options:[],defaultValue:'',label:'Cheque Number', controlType: 'text', controlName: 'chequeOrDDNo', value: '', disable: false, valueTag:[] , key: '', validators: {required:'required',pattern:'^[0-9]{6}$'},hasCondition:true,conditions:[{compareCondition:'lesserThan',valToCompare:25000,valueTag:['applicationDetails'] , key: 'premiumAmount',removeValidator:true,validatorsTOBeRemoved:['required']}]},
          { isDependent:true,parentControlName:'paymentType',showIfParentValue:['DBT'],getOptions:false, options:[],defaultValue:'',label:'Cheque Date', controlType: 'date', controlName: 'chkOrDDDate', value: '', disable: false, valueTag:[] , key: '', validators: {required:'required'},hasActiveCondition:true,activeCondition:[{condition:'enable',depControlName:'chequeOrDDNo'}] },
          { isDependent:true,parentControlName:'paymentType',showIfParentValue:['DBT'],getOptions:false, options:[],defaultValue:'',label:'IFSC Code', controlType: 'text', controlName: 'ifscCode', value: '', disable: false, valueTag:[] , key: '', validators: {required:'required',pattern:'^[A-Z]{4}0[0-9]{6}$'},isCap:true },
          { getOptions:false, options:[],defaultValue:'',label:'Premium Payable', controlType: 'number', controlName: 'premiumPayable', value: '', valueTag:['applicationDetails'] , key: 'premiumAmount', disable: true, validators: {required:'required',pattern:''} },
          { getOptions:false, options:[],defaultValue:'',label:'Insurer Name', controlType: 'text', controlName: 'insurerName', value: '', valueTag:['applicationDetails'] , key: 'insurerName', disable: true, validators: {required:'required',pattern:''} },
          { getOptions:false, options:[],defaultValue:'',label:'Customer Name', controlType: 'text', controlName: 'customerName', value: '', valueTag:['applicationDetails'] , key: 'customerName', disable: true, validators: {required:'required',pattern:''} },  
          { getOptions:false, options:[],defaultValue:new Date(),label:'Date Of Payment', controlType: 'date', controlName: 'dateOfPayment', value: '', valueTag:[] , key: '', disable: true, validators: {required:'required'} },
        ]
      }
    ]
  }

  kblMetadata = {
    sections:[
    { label:'',
      formData:[
        { getOptions:false,options:[ { id: 'DBT', value: 'Direct Debit' },
        ],defaultValue:'DBT',label:'Payment Type', controlType: 'radio', controlName: 'paymentType', value: 'DBT', disable: false, valueTag: [], key: '', validators: {} },
      ]
    },
    {label:'',
          formData:[
            { isDependent:true,parentControlName:'paymentType',showIfParentValue:['DBT'],optionSource:'accountDetails', getOptions:true,options:[],defaultValue:'',label:'Account Number', controlType: 'select', controlName: 'accountNumber', value: '', valueTag:[] , key: '', disable: false, validators: {required:'required'} },
            { isDependent:true,parentControlName:'paymentType',showIfParentValue:['DBT'],getOptions:false, options:[],defaultValue:'',label:'Cheque Number', controlType: 'text', controlName: 'chequeOrDDNo', value: '', disable: false, valueTag:[] , key: '', validators: {required:'required',pattern:'^[0-9]{6}$'},hasCondition:true,conditions:[{compareCondition:'lesserThan',valToCompare:25000,valueTag:['applicationDetails'] , key: 'premiumAmount',removeValidator:true,validatorsTOBeRemoved:['required']}] },
            { isDependent:true,parentControlName:'paymentType',showIfParentValue:['DBT'],getOptions:false, options:[],defaultValue:'',label:'Cheque Date', controlType: 'date', controlName: 'chkOrDDDate', value: '', disable: true, valueTag:[] , key: '', validators: {required:'required'},hasActiveCondition:true,activeCondition:[{condition:'enable',depControlName:'chequeOrDDNo'}] },
            { isDependent:true,parentControlName:'paymentType',showIfParentValue:['DBT'],getOptions:false, options:[],defaultValue:'',label:'IFSC Code', controlType: 'text', controlName: 'ifscCode', value: '', disable: false, valueTag:[] , key: '', validators: {required:'required',pattern:'^[A-Z]{4}0[0-9]{6}$'},isCap:true },
            { getOptions:false, options:[],defaultValue:'',label:'Premium Payable', controlType: 'number', controlName: 'premiumPayable', value: '', valueTag:['applicationDetails'] , key: 'premiumAmount', disable: true, validators: {required:'required',pattern:''} },
            { getOptions:false, options:[],defaultValue:'',label:'beneficiary Name', controlType: 'text', controlName: 'insurerName', value: '', valueTag:['applicationDetails'] , key: 'insurerName', disable: true, validators: {required:'required',pattern:''} },
            { getOptions:false, options:[],defaultValue:'',label:'Customer Name', controlType: 'text', controlName: 'customerName', value: '', valueTag:['applicationDetails'] , key: 'customerName', disable: true, validators: {required:'required',pattern:''} },  
            { getOptions:false, options:[],defaultValue:new Date(),label:'Date Of Payment', controlType: 'date', controlName: 'dateOfPayment', value: '', valueTag:[] , key: '', disable: true, validators: {required:'required'} },
          ]
        }
      ]
    }
   
  
  paymentTypes = [
    { id: 'DBT', value: 'Direct Debit' },
    { id: 'CHQ', value: 'Cheque' },
    { id: 'DD', value: 'Demand Draft' },
  ];

  isCisFlow = false;

  user: User;

  constructor(
    private paymentService: InitiatePaymentService,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private router: Router,
    public dialog: MatDialog,
    private accountService: AccountService,
  ) { }

  ngOnInit() {
    this.accountService.user.subscribe(data => {
      if (data) {
        this.user = data;
      }
    });
    if (this.router.url.indexOf('cis') > -1) {
      this.isCisFlow = true;
    };
    this.route.params.subscribe((params) => {
      if (params.appNo) {
        this.applicationNo = params.appNo;
      }
    });
    this.loaderService.showSpinner(true);
    this.todaysDate = new Date();
    const dateBeforeThreeMoths = moment().subtract(3, 'months');
    this.threeMonthsBack = new Date(dateBeforeThreeMoths.toDate());
    if (this.isCisFlow) {
      this.paymentService.getCisApplication(this.applicationNo).subscribe(data => {
        this.applicationDetails = {};
        this.applicationDetails.insurerCode = data['productInfo'].insurerId;
        this.applicationDetails.premiumPayable = data['productInfo'].netPremium;
        this.applicationDetails.premiumPayable = data['productInfo'].netPremium;
        this.applicationDetails.premiumAmount = data['productInfo'].netPremium;
        this.applicationDetails.insurerName = this.getInsurerName(data['productInfo'].insurerId);
        this.applicationDetails.customerName = data['proposer'].firstName + " " + data['proposer'].middleName + " " + data['proposer'].lastName;
        this.applicationDetails.appNo = this.applicationNo;
        this.applicationDetails.applicationNo = this.applicationNo;
        this.applicationDetails.orgCode = this.user.organizationCode;
        this.customerCif = data['proposer']['customerBankId']
        this.loaderService.showSpinner(true);
        this.metaData = this.kblMetadata;
        this.paymentService.getAccountsforCustomer(this.customerCif).subscribe(
          (accData: {}[]) => {
            // accData = sampleAccountDetails
            this.loaderService.showSpinner(false);
            this.accountDetails = accData;
            // this.accountDetails = [{accountNo: '12345678', cifNo: '40000129345'}];
            this.dynamic = true;
            this.orgCode = this.applicationDetails.orgCode
            this.getOptions( this.metaData);
            this.checkConditions(this.metaData);
            this.initiateFormFields( this.metaData);
            console.log(accData)
          }, () => {
            this.loaderService.showSpinner(false);
            const message = 'Error fetching account details';
            const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
              data: message,
              panelClass: 'dialog-width',
              disableClose: true,
            });
            dialogRef.afterClosed().subscribe(() => {
              this.router.navigate(['/', 'policyvault']);
            });
            // this.accountDetails = accountDetails
           
          })
      });
    } else {
      this.paymentService.getApplication(this.applicationNo).subscribe(
        (data) => {
          // data = sampleApplicationData;
          this.applicationDetails = data;
          this.loaderService.showSpinner(false);
          if (this.applicationDetails.orgCode === 'KB') {
           
            this.metaData = this.applicationDetails.productType === 'GC'? this.kblMetadataGC : this.kblMetadata
            // console.log('inside kb',this.metaData)
            this.loaderService.showSpinner(true);
            this.paymentService.getAccountDetails(this.applicationNo).subscribe(
              (accData: {}[]) => {
                // accData = sampleAccountDetails
                this.loaderService.showSpinner(false);
                this.accountDetails = accData;
                this.dynamic = true;
                this.orgCode = this.applicationDetails.orgCode
                this.getOptions( this.metaData);
                this.checkConditions(this.metaData);
                this.initiateFormFields( this.metaData);
                console.log(accData)
              }, () => {
                this.loaderService.showSpinner(false);
                const message = 'Error fetching account details';
                const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
                  data: message,
                  panelClass: 'dialog-width',
                  disableClose: true,
                });
                dialogRef.afterClosed().subscribe(() => {
                  this.router.navigate(['/', 'policyvault']);
                });
                // this.accountDetails = accountDetails
               
              })
          } else if (this.applicationDetails.orgCode !== 'SIB') {
            this.paymentService.getAccountDetails(this.applicationNo).subscribe(
              (accData: {}[]) => {
                // accData = accountDetails;
                this.loaderService.showSpinner(false);
                this.accountDetails = accData;
                // console.log(this.accountDetails);
                if (
                  this.accountDetails === null ||
                  (this.accountDetails.length === 0 &&
                    this.applicationDetails.productId !== '122N116V01')
                ) {
                  const message = {
                    isTrue: true,
                    message: 'Applicant is not a account holder.Would you like to pay online?',
                  };
                  const dialogRefOnlinepayment = this.dialog.open(PolicyErrorModalComponent, {
                    data: message,
                    panelClass: 'dialog-width',
                    disableClose: true,
                  });
                  dialogRefOnlinepayment.afterClosed().subscribe((res) => {
                    if (res === 'Online') {
                      this.loaderService.showSpinner(true);
                      this.paymentService.sendCustomerConsent(this.applicationNo).subscribe(
                        (resCC) => {
                          let messagePayLinkSuccess;
                          this.loaderService.showSpinner(false);
                          if (resCC['statusCode'] === '0') {
                            messagePayLinkSuccess = 'Payment Link successfully sent to customer.';
                          } else {
                            messagePayLinkSuccess = 'Payment Link is not sent. Please try again.';
                          }
                          const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
                            data: messagePayLinkSuccess,
                            panelClass: 'dialog-width',
                          });
                          dialogRef.afterClosed().subscribe(() => {
                            this.router.navigate(['/', 'policyvault']);
                          });
                        },
                        () => {
                          this.loaderService.showSpinner(false);
                          const messagePayLink =
                            'Unable to send paymentLink. Please try again after sometime.';
                          const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
                            data: messagePayLink,
                            panelClass: 'dialog-width',
                          });
                          dialogRef.afterClosed().subscribe(() => {
                            this.router.navigate(['/', 'policyvault']);
                          });
                        },
                      );
                    }
                  });
                }
                this.generateFormFields();
              },
              () => {
                this.loaderService.showSpinner(false);
                const message = 'Error fetching account details';
                const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
                  data: message,
                  panelClass: 'dialog-width',
                  disableClose: true,
                });
                dialogRef.afterClosed().subscribe(() => {
                  this.router.navigate(['/', 'policyvault']);
                });
                this.accountDetails = [];
                this.generateFormFields();
              },
            );
          } else if (this.applicationDetails.orgCode === 'SIB') {
            const today = new Date();
            this.isSib = true;
      this.paymentForm = new FormGroup({});
            this.paymentForm.addControl('paymentType', new FormControl('DBT', Validators.required));
            this.paymentForm.get('paymentType').disable();
            this.paymentForm.addControl(
              'premiumPayable',
              new FormControl(this.applicationDetails.premiumAmount),
            );
            this.paymentForm.addControl(
              'insurerName',
              new FormControl(this.applicationDetails.insurerName),
            );
            this.paymentForm.addControl(
              'customerName',
              new FormControl(this.applicationDetails.customerName),
            );
            this.paymentForm.addControl(
              'dateOfPayment',
              new FormControl(
                today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear(),
              ),
            );
            this.paymentForm.addControl(
              'confirmationConsent',
              new FormControl(null, Validators.required),
            );
            this.paymentForm.addControl(
              'accountNumber',
              new FormControl('', [
                Validators.required,
                Validators.pattern('^[0-9]*$'),
                Validators.minLength(16),
                Validators.maxLength(16),
              ]),
            );
            console.log('ACCOUNT NUMBERSSSS', this.paymentForm.get('accountNumber').value);
          }
        },
        () => {
          this.loaderService.showSpinner(false);
        },
      );
    }
    
  }

  onSubmit() {
    if (this.applicationDetails.orgCode === 'SIB') {
      this.loaderService.showSpinner(true);
      this.paymentService
        .getAccountsforCustomer(this.paymentForm.get('accountNumber').value)
        .subscribe(
          (res) => {
            if (res[0].responseCode == 200) {
              this.loaderService.showSpinner(false);
              this.initiatePayment();
            } else {
              this.loaderService.showSpinner(false);
              const message = res[0].desc;
              this.dialog.open(PolicyErrorModalComponent, {
                data: message,
                panelClass: 'dialog-width',
              });
            }
          },
          () => {
            this.loaderService.showSpinner(false);
            const message = 'Unable to fetch Account Details, Please try after Sometime.';
            this.dialog.open(PolicyErrorModalComponent, {
              data: message,
              panelClass: 'dialog-width',
            });
          },
        );
    } else {
      this.initiatePayment();
    }
  }
  selectionChange(input){
 const accDetail =  this.accountDetails.find(acc=>
   acc.accountNo === this.paymentForm.get(input.controlName).value
 )
 this.accountType = accDetail.accountTypeCode
if(input.showMessageOnChange){
  this.dialog.open(PolicyErrorModalComponent, {
    data: input.message,
    panelClass: 'dialog-width',
  });
}

if(+accDetail['availableBalance'] < this.applicationDetails.premiumAmount ){
  const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
    data: 'Insufficient balance for selected Account.  Please add sufficient funds or try selecting another account',
    panelClass: 'dialog-width',
  });
}
  }
  getInstruementDate(controlName){
    const checkDateControlValue = this.paymentForm.get(controlName)?.value;
    const checkDate = new Date(checkDateControlValue)
    console.log(checkDate)
    if(checkDateControlValue && checkDate ){
      let instrumentDate =
      checkDate.getFullYear() +
      '-' +
      ('0' + (checkDate.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + checkDate.getDate()).slice(-2);
      return instrumentDate;
    } else {
      return ''
    }
   
   }
  
  
  onDynamicSubmit(org){
    console.log('coming here', org);
    let paymentBody;
    if(org === 'KB'){
     const paymentType = this.paymentForm.get('paymentType').value;
       paymentBody = {
        paymentType,
        cifNo:this.accountDetails[0].cifNo,
        accountNo: this.getAccountLoanNo(this.paymentForm.get('paymentType').value),
        instrumentDate:this.getInstruementDate('chkOrDDDate'),
        instrumentNo: paymentType !== 'DBTLA' ? this.paymentForm.get('chequeOrDDNo').value : undefined,
        ifscCode: paymentType !== 'DBTLA' ? this.paymentForm.get('ifscCode').value : undefined,
        insurerId: this.applicationDetails.insurerCode,
        premiumPayable: this.applicationDetails.premiumAmount,
        appNo: this.applicationDetails.applicationNo,
        additionalData:{
          data:{
          accountTypeCode:this.accountType ? this.accountType:null,
          }
      }
      }
    }
    this.loaderService.showSpinner(true);
    if (this.isCisFlow) {
      paymentBody.cisApp = true;
      this.paymentService.initiatePaymentForCis(paymentBody).subscribe(
        (data) => {
          console.log('Printing Initiate PaymentData', data);
          if (data['responseCode'] === 0) {
            this.loaderService.showSpinner(false);
            const message = 'Your payment request has been sent for approval.Now Checker from the branch can View & Verify the proposal and payment details from the menu option “My Space - Payment Requests”';
            const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
              data: message,
              panelClass: 'dialog-width',
            });
            dialogRef.afterClosed().subscribe(() => {
              this.router.navigate(['/', 'payment-approval']);
            });
          } else {
            this.loaderService.showSpinner(false);
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
    } else {
      this.paymentService.initiatePayment(paymentBody).subscribe(
        (data) => {
          console.log('Printing Initiate PaymentData', data);
          if (data['responseCode'] === 0) {
            this.loaderService.showSpinner(false);
            const message = 'Your payment request has been sent for approval.';
            const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
              data: message,
              panelClass: 'dialog-width',
            });
            dialogRef.afterClosed().subscribe(() => {
              this.router.navigate(['/', 'payment-approval']);
            });
          } else {
            this.loaderService.showSpinner(false);
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
  }
  initiatePayment() {
    let instrumentDate;
    const paymentType = this.paymentForm.get('paymentType').value;
    if (paymentType !== 'DBT' && paymentType !== 'DBTLA') {
      const checkDate = new Date(this.paymentForm.get('chkOrDDDate').value);
      instrumentDate =
        checkDate.getFullYear() +
        '-' +
        ('0' + (checkDate.getMonth() + 1)).slice(-2) +
        '-' +
        ('0' + checkDate.getDate()).slice(-2);
    }
    const paymentBody = {
      paymentType,
      cifNo:
        (paymentType === 'DBT' || paymentType === 'DBTLA') &&
          this.applicationDetails.orgCode !== 'SIB'
          ? this.accountDetails[0].cifNo
          : this.paymentForm.get('accountNumber').value,
      accountNo: this.getAccountLoanNo(paymentType),
      instrumentDate,
      instrumentNo:
        paymentType !== 'DBT' && paymentType !== 'DBTLA'
          ? this.paymentForm.get('chequeOrDDNo').value
          : undefined,
      ifscCode:
        paymentType !== 'DBT' && paymentType !== 'DBTLA'
          ? this.paymentForm.get('ifscCode').value
          : undefined,
      micrCode:
        paymentType !== 'DBT' && paymentType !== 'DBTLA'
          ? this.paymentForm.get('micrCode').value
          : undefined,
      insurerId: this.applicationDetails.insurerCode,
      premiumPayable: this.applicationDetails.premiumAmount,
      appNo: this.applicationDetails.applicationNo,
    };
    // console.log(paymentBody);
    this.loaderService.showSpinner(true);
    this.paymentService.initiatePayment(paymentBody).subscribe(
      (data) => {
        console.log('Printing Initiate PaymentData', data);
        if (data['responseCode'] === 0) {
          this.loaderService.showSpinner(false);
          const message = 'Your payment request has been sent for approval.';
          const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
            data: message,
            panelClass: 'dialog-width',
          });
          dialogRef.afterClosed().subscribe(() => {
            this.router.navigate(['/', 'payment-approval']);
          });
        } else {
          this.loaderService.showSpinner(false);
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

  generateFormFields() {
    console.log('coming here');
    const today = new Date();
    if (
      (this.accountDetails && this.accountDetails.length > 0) ||
      this.applicationDetails.orgCode === 'SIB'
    ) {
      console.log('step 1');
      this.paymentForm = new FormGroup({});
        this.paymentForm.addControl('paymentType', new FormControl('DBT', Validators.required));
        this.paymentForm.get('paymentType').disable();
        this.paymentForm.addControl(
          'accountNumber',
          new FormControl(this.accountDetails[0].accountNo),
        );

      console.log('step 2');
    } else {
      console.log('step 3');
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
      console.log('step 4');
    }
    console.log('checked', this.applicationDetails);
    this.paymentForm.addControl('confirmationConsent', new FormControl(null, Validators.required));
    this.paymentForm.addControl(
      'premiumPayable',
      new FormControl(this.applicationDetails.premiumAmount),
    );
    this.paymentForm.addControl(
      'insurerName',
      new FormControl(this.applicationDetails.insurerName),
    );
    this.paymentForm.addControl(
      'customerName',
      new FormControl(this.applicationDetails.customerName),
    );
    this.paymentForm.addControl(
      'dateOfPayment',
      new FormControl(today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear()),
    );
    console.log('last step is aslo working fine..', this.paymentForm);
  }

  getAccountLoanNo(paymentType) {
    if (paymentType === 'DBT') {
      return this.paymentForm.get('accountNumber').value;
    } else if (paymentType === 'DBTLA') {
      return this.paymentForm.get('loanAccountNumber').value;
    }
  }

  onPaymentMethodChange(event) {
    if (event.value === 'DBT') {
      this.paymentForm.addControl(
        'accountNumber',
        new FormControl(this.accountDetails[0].accountNo, Validators.required),
      );
      this.paymentForm.removeControl('loanAccountNumber');
      this.paymentForm.removeControl('micrCode');
    } else if (event.value === 'DBTLA') {
      this.paymentForm.addControl(
        'loanAccountNumber',
        new FormControl(
          this.applicationDetails.applicationData.loanDetails.loanNo,
          Validators.required,
        ),
      );
      this.paymentForm.removeControl('accountNumber');
      this.paymentForm.removeControl('micrCode');
    } else {
      this.paymentForm.removeControl('accountNumber');
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
    }
  }

  ngOnDestroy() {
    console.log('on destroy has been called');
    this.formSubscription?.unsubscribe()
  }

  initiateFormFields(metaData) {
    this.paymentForm = new FormGroup({});
    metaData.sections.forEach(section=>{
      this.reqFormControl = section.formData;
      this.reqFormControl.forEach(form => {
        let validators = this.getValidator(form.validators)
        // console.log(validators)
        let nestedTag
        if (form.valueTag.length>0) {
          //get the nestedValue
          // console.log(this[form.valueTag[0]])
          nestedTag = this[form.valueTag[0]];
          form.valueTag.forEach((val,index)=>{
            if(index!==0) {
              // console.log(val)
              nestedTag = nestedTag[val]};
              
          })
          // console.log(form.nestedTag)
          this.paymentForm.addControl(form.controlName, new FormControl(nestedTag[form.key], validators))
         
        } else if(form.defaultValue){
          this.paymentForm.addControl(form.controlName, new FormControl(form.defaultValue, validators))
          
        }else {
          this.paymentForm.addControl(form.controlName, new FormControl(form.value, validators))
  
        }
        if(form.disable){
          this.paymentForm.get(form.controlName).disable();
        }
      });
    })
    this.paymentForm.addControl('confirmationConsent',new FormControl(false))
    
    console.log(this.paymentForm,this.dynamic)
    this.formSubscription = this.paymentForm.valueChanges.subscribe(val=>{
      this.checkActiveCondition(metaData,val)
    })
  }

  checkActiveCondition(metaData,controlVals){
    metaData.sections.forEach(section=>{
      this.reqFormControl = section.formData;
      this.reqFormControl.forEach(form => {
      if(form.hasActiveCondition) {
        form.activeCondition.forEach(activeCondition=>{
          if(activeCondition.condition === 'enable'){
          const controlVal = controlVals[activeCondition.depControlName]
            if(controlVal && this.paymentForm.get(form.controlName).disabled){
              this.paymentForm.get(form.controlName).enable();
            } else if(!controlVal && this.paymentForm.get(form.controlName).enabled){
              this.paymentForm.get(form.controlName).disable();
              this.paymentForm.get(form.controlName).setValue('');
            }
          }
        })
      }
      });
    })
  }

  getOptions(metaData){
    metaData.sections.forEach(section=>{
      section.formData.forEach(form=>{
        if(form.getOptions) form.options = this[form.optionSource]
      })
    })
  }

  checkConditions(metaData){
    metaData.sections.forEach(section=>{
      section.formData.forEach(form=>{
        // console.log('form',form)
        if(form.hasCondition && form.conditions?.length > 0){
          form.conditions.forEach(condition=>{
            // console.log('condition',condition)
            if(condition.removeValidator && condition.validatorsTOBeRemoved?.length > 0){
              let nestedTag = this[condition.valueTag[0]];
              condition.valueTag.forEach((val,index)=>{
                if(index!==0) {
                  // console.log(val)
                  nestedTag = nestedTag[val]};
              })
              // console.log('nestedTag',nestedTag)
              const reqVal = nestedTag[condition.key];
            let conditionHolds = false;
            if(condition.compareCondition === 'lesserThan'){
              // console.log('yoyo',+reqVal,+condition.valToCompare)
              conditionHolds = +reqVal < +condition.valToCompare
            } else if (condition.compareCondition === 'equals'){
              conditionHolds = +reqVal === +condition.valToCompare
            } else if (condition.compareCondition === 'greaterThan'){
              conditionHolds = +reqVal > +condition.valToCompare
            } 
            // console.log('conditionHolds',conditionHolds)
            if(conditionHolds){
              condition.validatorsTOBeRemoved.forEach(validator=>{
               delete form.validators[validator]
              })
            }
            }
          })
        } 
      })
    })
  }

  getValidator(validator) {
      let validators = Object.keys(validator).map(key=>{
        if (key === 'required') {
          return Validators.required
        } else if (key === 'pattern'){
          return Validators.pattern(validator[key])
        } else if(key==='minLength') {
          console.log(validator[key])
          return Validators.minLength(validator[key])
        } else if(key==='maxLength') {
          return Validators.maxLength(validator[key])
        }
      })
      return validators
    }

    onRadioChange(input,event){
      if(input.showMessageOnChange && event.value === 'DBTLA'){
        this.dialog.open(PolicyErrorModalComponent, {
          data: input.message,
          panelClass: 'dialog-width',
        });
    }
}

forceUppercaseConditionally(controlName,isCap,event){
  if(isCap){
    this.paymentForm.get(controlName).setValue(event.target.value.toUpperCase())
  }
}

getInsurerName(insurerID){
 const insurerObj = this.insurerNameList.find(obj=> obj.id === insurerID);
 return insurerObj.name
}
}
