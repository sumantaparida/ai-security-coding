import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MediaObserver } from '@angular/flex-layout';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomersService } from '@app/mycustomers/services/customers.service';
import { PaymentInfoService } from './payment-info.service';
import { keyValuesToMap } from '@angular/flex-layout/extended/typings/style/style-transforms';
import * as moment from 'moment';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';
@Component({
  selector: 'app-payment-info',
  templateUrl: './payment-info.component.html',
  styleUrls: ['./payment-info.component.css']
})
export class PaymentInfoComponent implements OnInit {

  appNo: number;
  paymentInfoFormGroup: FormGroup;
  isLoading = true;
  currentDate;
  applicationData;
  paymentData;
  paymentInformation = false;

  constructor(
    private route: ActivatedRoute,
    public media: MediaObserver,
    private router: Router,
    private customerService: CustomersService,
    private paymentInfoService: PaymentInfoService,
    public dialog: MatDialog
  ) {

  }


  ngOnInit(): void {
    this.currentDate = moment().format('YYYY-MM-DD');
    this.route.params.subscribe(params => {
      if (params.appNo) {
        this.appNo = params.appNo;
      }
      else {
        this.appNo = null;
      }
    });

    // this.isLoading = true;
    this.paymentInfoService.checkProposalResponses(this.appNo).subscribe(res => {
      console.log('Finally got the response', res);
      this.isLoading = false;
      this.paymentData = res;
      this.createPaymentInfoForm();
      this.paymentInformation = true;
    }, error => {
      this.isLoading = false;
      this.showMessage(error);
    });

  }

  showMessage(error) {
    const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
      data: error.error.details,
      panelClass: 'dialog-width'
    });
    dialogRef.afterClosed().subscribe(data => {
      // navigate
    });
  }


  createPaymentInfoForm() {
    this.paymentInfoFormGroup = new FormGroup({});
    this.paymentInfoFormGroup.addControl('instrumentNo', new FormControl('', [Validators.required,
    Validators.minLength(6), Validators.maxLength(50)]));
    this.paymentInfoFormGroup.addControl('instrumentDate', new FormControl(this.currentDate,
      Validators.required));
    this.paymentInfoFormGroup.addControl('paymentAmount', new FormControl(this.paymentData.premiumAmount, [Validators.required]));
    this.paymentInfoFormGroup.addControl('payerName', new FormControl(this.paymentData.customerName,
      [Validators.required, Validators.minLength(5), Validators.maxLength(50)]));
    this.paymentInfoFormGroup.addControl('mobileNo', new FormControl(this.paymentData.mobileNo,
      [Validators.required, Validators.pattern('^[6-9]\\d{9}$')]));
    this.paymentInfoFormGroup.addControl('insurerName', new FormControl(this.paymentData.insurerName)),
      this.paymentInfoFormGroup.addControl('productName', new FormControl(this.paymentData.productName));
  }

  goBack() {
    console.log('hi');
  }

  onPaymentSubmitClicked() {
    this.isLoading = true;

    const paymentInfo = {
      transactionId: this.paymentData.transactionId, // As passed in input
      payerName: this.paymentInfoFormGroup.get('payerName').value,
      payerRelation: 'Self',  // Default to Self
      collectionAmount: this.paymentInfoFormGroup.get('paymentAmount').value,
      collectionReceiveDate: moment(new Date(this.paymentInfoFormGroup.get('instrumentDate').value)).format('YYYY-MM-DD'),
      collectionMode: 'Direct Debit', // Direct Debit or Cheque;
      chequeType: '', //
      instrumentNumber: this.paymentInfoFormGroup.get('instrumentNo').value,
      instrumentDate: moment(new Date(this.paymentInfoFormGroup.get('instrumentDate').value)).format('YYYY-MM-DD'),
      ifscCode: '', // Ifsc code of the Branch;
      mobileNumber: this.paymentInfoFormGroup.get('mobileNo').value, // mobile Number of the Payer;
      bankMICRCode: '', // MICR code in case of cheque;
      bankAccountNumber: '', // Bank account No.;
      insurerId: this.paymentData.insurerId, // Insurer Id as passed in Input
      productId: this.paymentData.productId // Product id as passed in input
    };

    // Object.assign(paymentInfo, {
    //         transactionId: this.paymentData.transactionId, // As passed in input
    //         payerName: this.paymentInfoFormGroup.get('payerName').value,
    //         payerRelation: 'Self',  // Default to Self
    //         collectionAmount : this.paymentInfoFormGroup.get('paymentAmount').value,
    //         collectionReceiveDate: moment(new Date(this.paymentInfoFormGroup.get('instrumentDate').value)).format('YYYY-MM-DD'),
    //         collectionMode: 'Direct Debit', // Direct Debit or Cheque;
    //         chequeType: '', //
    //         instrumentNumber: this.paymentInfoFormGroup.get('instrumentNo').value,
    //         instrumentDate: moment(new Date(this.paymentInfoFormGroup.get('instrumentDate').value)).format('YYYY-MM-DD'),
    //         ifscCode : '', // Ifsc code of the Branch;
    //         mobileNumber : this.paymentInfoFormGroup.get('mobileNo').value, // mobile Number of the Payer;
    //         bankMICRCode: '', // MICR code in case of cheque;
    //         bankAccountNumber : '', // Bank account No.;
    //         insurerId: this.paymentData.productId, // Insurer Id as passed in Input
    //         productId : this.paymentData.insurerId // Product id as passed in input

    // });

    console.log('payment info', paymentInfo);
    this.paymentInfoService.submitDirectDebitPayment(this.appNo, paymentInfo).subscribe(response => {
      paymentInfo['insurerApplicationNo'] = response['insurerApplicationNo'];
      this.paymentInfoService.submitPaymentInfo(this.paymentData.returnUrl, paymentInfo).subscribe((data: any) => {
        console.log(data);
        this.isLoading = false;
        console.log('response', data);
        this.router.navigate(['/Confirmation', this.paymentData.insurerId, data['Application_No']],
          {
            queryParams: {
              status: data['Status'], paymentReferenceNo: data['Payment_Reference_No'],
              policyNo: data['Policy_No'], premiumPaid: data['Premium_Paid'],
              logoUrl: data['logoUrl'], appNo: data['Application_No'],
              paymentGatewayId: data['Insurer_Transaction_Key'],
              message: data['message'] ? data['message'] : 'Policy has been issued successfully'
            }
          });
      }, error => {
        this.isLoading = false;
        this.showMessage(error);
      });
    }, error => {
      this.isLoading = false;
      this.showMessage(error);
    });
  }

}
