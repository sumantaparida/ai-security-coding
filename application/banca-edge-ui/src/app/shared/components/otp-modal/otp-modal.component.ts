import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LmsService } from '@app/LMS/services/lms.service';
import { SharedServiceComponent } from '@app/shared/services/shared-service';
import { LoaderService } from '@app/_services/loader.service';
import { threadId } from 'worker_threads';

@Component({
  selector: 'app-otp-modal',
  templateUrl: './otp-modal.component.html',
  styleUrls: ['./otp-modal.component.css'],
})
export class OtpModalComponent implements OnInit {
  otpValue = 5555;

  otpFormGroup: FormGroup;

  resendCounter;

  isErrorOtp = false;

  disableSubmit = false;

  constructor(
    private dialogRef: MatDialogRef<OtpModalComponent>,
    private service: SharedServiceComponent,
    private loaderService: LoaderService,
    public lmsService: LmsService,
    @Inject(MAT_DIALOG_DATA) public data,
  ) {
    dialogRef.disableClose = true;
  }

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
    if (this.data.dcb) {
      this.service
        .validateDcbLmsOtp(this.data.cifNumber, this.otpFormGroup.get('otp').value, this.data.appNo)
        .subscribe(
          (res) => {
            // this.loaderService.showSpinner(false);

            if (res['statusCode'] === '0') {
              this.dialogRef.close(true);
            } else {
              this.loaderService.showSpinner(false);

              // this.resendCounter = 0;
              this.otpFormGroup.get('otp').reset();

              this.isErrorOtp = true;
              // this.disableSubmit = true;
            }
          },
          (err) => {
            this.loaderService.showSpinner(false);
          },
        );
    } else {
      this.service.validateLmsOtp(this.data.appNo, this.otpFormGroup.get('otp').value).subscribe(
        (status) => {
          this.loaderService.showSpinner(false);

          if (status['statusCode'] === '0') {
            this.dialogRef.close(true);
          } else {
            // this.dialogRef.close(false);
            this.otpFormGroup.get('otp').reset();
            this.isErrorOtp = true;
          }
        },
        (err) => {
          this.loaderService.showSpinner(false);
        },
      );
    }
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
      email: this.data?.email,
    };

    if (this.data?.dcb) {
      this.lmsService.sendDcbOtp(otpDcbData).subscribe((res) => {
        this.loaderService.showSpinner(false);
        console.log(res);
      });
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
