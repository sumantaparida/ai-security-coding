import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedServiceComponent } from '@app/shared/services/shared-service';
import { AccountService } from '@app/_services/account.service';
import { LoaderService } from '@app/_services/loader.service';
import * as crypto from 'crypto-js';

@Component({
  selector: 'app-otp-forgot-password-modal',
  templateUrl: './otp-forgot-password-modal.component.html',
  styleUrls: ['./otp-forgot-password-modal.component.css'],
})
export class OtpForgotPasswordModalComponent implements OnInit {
  otpValue = 5555;

  otpFormGroup: FormGroup;

  resendCounter;

  isErrorOtp = false;

  disableSubmit = false;

  errorMessage;

  encryptedUser;

  payload;

  constructor(
    private dialog: MatDialogRef<OtpForgotPasswordModalComponent>,
    private service: SharedServiceComponent,
    private loaderService: LoaderService,
    private accountService: AccountService,

    @Inject(MAT_DIALOG_DATA) private data,
  ) {}

  ngOnInit() {
    this.otpFormGroup = new FormGroup({
      otp: new FormControl('', [
        Validators.required,
        Validators.maxLength(4),
        Validators.minLength(4),
      ]),
    });
    this.startResendTimer();
  }

  onSubmitClicked() {
    this.loaderService.showSpinner(true);
    const secretKey = 'ysecretkeyyy098!';
    const encryptedUser = crypto.AES.encrypt(this.data.userName, secretKey.trim()).toString();
    this.payload = {
      otpKey: encryptedUser,
      otp: this.otpFormGroup.get('otp').value,
    };

    this.service.validateForgotPasswordOtp(this.payload).subscribe(
      (res) => {
        this.loaderService.showSpinner(false);

        if (res['returnCode'] === 0) {
          this.dialog.close(true);
        } else {
          this.loaderService.showSpinner(false);

          // this.resendCounter = 0;
          this.otpFormGroup.get('otp').reset();

          this.isErrorOtp = true;
          this.errorMessage = res['returnMessage'];
          // this.disableSubmit = true;
        }
      },
      (err) => {
        this.loaderService.showSpinner(false);
      },
    );
  }

  onCancelClicked() {
    this.dialog.close(null);
  }

  onResendOTPClicked() {
    this.disableSubmit = false;
    const secretKey = 'ysecretkeyyy098!';
    const encryptedUser = crypto.AES.encrypt(this.data.userName, secretKey.trim()).toString();
    this.loaderService.showSpinner(true);

    this.accountService.sendOtpOnForgotPassword(encryptedUser).subscribe((res) => {
      this.loaderService.showSpinner(false);
      console.log(res);
    });

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
