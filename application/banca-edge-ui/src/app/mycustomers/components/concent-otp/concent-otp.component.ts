import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LmsService } from '@app/LMS/services/lms.service';
import { LoaderService } from '@app/_services/loader.service';
import { SharedServiceComponent } from '@app/shared/services/shared-service';
import { AccountService } from '@app/_services';
import { CustomersService } from '@app/mycustomers/services/customers.service';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';


@Component({
  selector: 'app-concent-otp',
  templateUrl: './concent-otp.component.html',
  styleUrls: ['./concent-otp.component.css']
})
export class ConcentOtpComponent implements OnInit {

  otpValue = 5555;

  otpFormGroup: FormGroup;

  resendCounter;

  isErrorOtp = false;

  disableSubmit = false;

  constructor(
    private dialogRef: MatDialogRef<ConcentOtpComponent>,
    private service: SharedServiceComponent,
    private loaderService: LoaderService,
    private accountService: AccountService,
    public lmsService: LmsService,
    private customersService: CustomersService,
    public dialog: MatDialog,


    @Inject(MAT_DIALOG_DATA) public data,
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.otpFormGroup = new FormGroup({
      otp: new FormControl('', [
        Validators.required,
        Validators.maxLength(6),
        Validators.minLength(6),
      ]),
    });
    this.startResendTimer();
  }

  onSubmitClicked() {
    this.loaderService.showSpinner(true);

    
    // this.loaderService.showSpinner(true);
    let reqBody = 
    {
      cifNumber: this.data['cifNumber'],
      accountNumber: this.data["accountNumber"],  
      consentCode: this.otpFormGroup.get('otp').value,
      transactionId: this.data["transactionId"]
    
    }
    
   this.customersService.validateCustomerConsent(reqBody).subscribe(res => {
           this.loaderService.showSpinner(false);

            if(res['responseCode'] === 0){

              // this.searchByForm.get('searchByForm').reset()
            this.dialogRef.close('success');

            } else if (res['responseCode'] !== 0){
            this.dialogRef.close('failure');

          const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
            height: '150px',
            width: '600px',
            data: res['responseMessage']
          });

          dialogRef.afterClosed().subscribe((result) => {
          });

            }
          })

    // this.service.validateLoginOtp(this.data.userName, this.otpFormGroup.get('otp').value).subscribe(
    //   (res) => {
    //     this.loaderService.showSpinner(false);
    //     console.log('user', res);
    //     this.accountService.setUser(res);
    //     this.dialogRef.close('validation successful');
    //   },
    //   (error) => {
    //     this.loaderService.showSpinner(false);
    //     this.dialogRef.close('validation failed');
    //   },
    // );
  }

  onCancelClicked() {
    this.dialogRef.close(null);
  }

  onResendOTPClicked() {
    this.disableSubmit = false;
    const otpDcbData = {
      otpKey: this.data?.cifNumber,
      otpRequestDesc: '',

      mobileNo: this.data?.mobileNo,
    };

    const otpData = {
      otpKey: this.data?.appNo,
      mobileNo: this.data?.mobileNo,
      otpRequestDesc: this.data?.productName,
    };

    const kblData  = {
      userName: this.data.userName
    }

    if (this.data?.dcb) {
      this.lmsService.sendDcbOtp(otpDcbData).subscribe((res) => {
        this.loaderService.showSpinner(false);
        console.log(res);
      });
    } else if(this.data.KBL) {
      this.lmsService.sendKKblOtp(kblData).subscribe(
        (res) => {
          this.loaderService.showSpinner(false);
        },
        (err) => {
          this.loaderService.showSpinner(false);
        },
      );
    } else {
      this.lmsService.sendOtp(otpData).subscribe(
        (res) => {
          this.loaderService.showSpinner(false);
        },
        (err) => {
          this.loaderService.showSpinner(false);
        },
      );
    }
    this.startResendTimer();
  }

  startResendTimer() {
    this.resendCounter = 60;
    const resendTimer = setInterval(() => {
      this.resendCounter--;
      if (this.resendCounter === 0) {
        clearInterval(resendTimer);
      }
    }, 1000);
  }

}
