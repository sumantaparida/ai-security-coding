import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LmsService } from '@app/LMS/services/lms.service';
import { SharedServiceComponent } from '@app/shared/services/shared-service';
import { AccountService } from '@app/_services';
import { LoaderService } from '@app/_services/loader.service';

@Component({
  selector: 'app-otp-login-modal',
  templateUrl: './otp-login.component.html',
  styleUrls: ['./otp-login.component.css'],
})
export class OtpLoginComponent implements OnInit {
  otpValue = 5555;

  otpFormGroup: FormGroup;

  resendCounter;

  isErrorOtp = false;

  otpErrorMessage= "";

  disableSubmit = false;

  resendOtpSuccess;

  disableResend = false;

  constructor(
    private dialogRef: MatDialogRef<OtpLoginComponent>,
    private service: SharedServiceComponent,
    private loaderService: LoaderService,
    private accountService: AccountService,
    public lmsService: LmsService,
    @Inject(MAT_DIALOG_DATA) public data,
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    console.log('got the data', this.data);
    this.otpFormGroup = new FormGroup({
      otp: new FormControl('', [
        Validators.required,
        Validators.maxLength(6),
        Validators.minLength(6),
      ]),
    });
    if(this.data.responseCode == 0){
      
      this.startResendTimer();
    }else{
      this.disableResend = true;
    }
    
  }

  onSubmitClicked() {
    this.data.message = "";
    if(this.otpFormGroup.get('otp').value != ""){
      this.loaderService.showSpinner(true);
      this.resendOtpSuccess = "";
      
      this.service.validateLoginOtp(this.data.userName, this.otpFormGroup.get('otp').value).subscribe(
        (res) => {
          this.loaderService.showSpinner(false);
          this.accountService.setUser(res);
          this.isErrorOtp = false;
          this.dialogRef.close('validation successful');
        },
        (error) => {
          this.loaderService.showSpinner(false);
          this.isErrorOtp = true;
          this.otpErrorMessage = error.message;
          if(error.responseCode == 2){
            this.disableSubmit = true;
            this.disableResend = true;
          }
          //this.dialogRef.close('validation failed');
        },
      );
    }else{
      this.isErrorOtp = true;
      this.otpErrorMessage = "Please enter otp";
    }
   
  }

  onCancelClicked() {
    this.dialogRef.close(null);
  }

  onResendOTPClicked() {
    this.disableSubmit = false;
    this.isErrorOtp = false;
    this.otpErrorMessage = "";
    this.data.message = "";
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

    const kblData = {
      userName: this.data.userName,
    };
    
    if (this.data?.orgCode === "DCB") {
      this.lmsService.sendDcbOtp(otpDcbData).subscribe((res) => {
        this.loaderService.showSpinner(false);
      });
    } else if (this.data?.orgCode === "SB" || this.data?.orgCode === "SIB") {
      this.loaderService.showSpinner(true);

      this.service.sendLoginOtp(this.data.userName).subscribe(
        (res) => {
          this.loaderService.showSpinner(false);
          if (res['statusCode'] == 0) {
            this.resendOtpSuccess = res['message'];
            this.startResendTimer();
          } else if (res['statusCode'] == 2) {
            this.disableResend = true;
            this.resendOtpSuccess = res['message'];
          }else {
            this.resendOtpSuccess = res['message'];
            this.startResendTimer();
          }
        },
        (err) => {
          this.loaderService.showSpinner(false);
          this.resendOtpSuccess = err['message'];
        },
      );
    } else {
      this.lmsService.sendOtp(otpData).subscribe(
        (res) => {
          this.loaderService.showSpinner(false);
          this.startResendTimer();
        },
        (err) => {
          this.loaderService.showSpinner(false);
        },
      );
    }
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
