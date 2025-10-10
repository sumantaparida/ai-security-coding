import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LmsService } from '@app/LMS/services/lms.service';
import { SharedServiceComponent } from '@app/shared/services/shared-service';
import { AccountService } from '@app/_services';
import { LoaderService } from '@app/_services/loader.service';

@Component({
  selector: 'app-otp-model',
  templateUrl: './otp-model.component.html',
  styleUrls: ['./otp-model.component.css'],
})
export class SibOtpModelComponent implements OnInit {
  otpValue = 5555;

  otpFormGroup: FormGroup;

  resendCounter;

  isErrorOtp = false;

  disableSubmit = false;

  token;

  constructor(
    private dialogRef: MatDialogRef<SibOtpModelComponent>,
    private service: SharedServiceComponent,
    private loaderService: LoaderService,
    private accountService: AccountService,
    public lmsService: LmsService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data,
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    console.log('got the data', this.data);
    this.token = this.data.token;

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

    this.service.validateLmsOtp(this.data?.otpKey, this.otpFormGroup.get('otp')?.value).subscribe(
      (res) => {
        this.loaderService.showSpinner(false);
        if (res['returnCode'] == 0 || res['statusCode'] == 0) {
          // this.router.navigate([`/lms/new-application/${this.data.applicationNumber}`]);
          this.dialogRef.close(0);
          //show success msg
        } else {
          //show error msg
          this.isErrorOtp = true;
          // this.dialogRef.close(res['returnMessage']);
        }
      },
      (error) => {
        this.loaderService.showSpinner(false);
        this.dialogRef.close('validation failed');
      },
    );
  }

  onCancelClicked() {
    this.dialogRef.close(null);
  }

  onResendOTPClicked() {
    this.disableSubmit = false;
    this.loaderService.showSpinner(true);
    this.service.sendOtp(this.data.payLoad).subscribe((res) => {
      this.loaderService.showSpinner(false);

      if (res['returnCode'] == 0 || res['statusCode'] == 0) {
        //
      } else {
        //show error message
      }
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
