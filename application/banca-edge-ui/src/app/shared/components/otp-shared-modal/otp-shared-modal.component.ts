import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedServiceComponent } from '@app/shared/services/shared-service';
import { LoaderService } from '@app/_services/loader.service';

@Component({
  selector: 'app-otp-shared-modal',
  templateUrl: './otp-shared-modal.component.html',
  styleUrls: ['./otp-shared-modal.component.css'],
})
export class OtpSharedModalComponent implements OnInit {
  otpValue = 5555;

  otpFormGroup: FormGroup;

  resendCounter;

  constructor(
    private dialogRef: MatDialogRef<OtpSharedModalComponent>,
    private service: SharedServiceComponent,
    private loaderService: LoaderService,
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

    this.service
      .validateOTP(this.data.appNo, this.otpFormGroup.get('otp').value)
      .subscribe((status) => {
        this.loaderService.showSpinner(false);

        if (status['statusCode'] === '0') {
          this.dialogRef.close(true);
        } else {
          this.dialogRef.close(false);
        }
      });
  }

  onCancelClicked() {
    this.dialogRef.close(null);
  }

  // onResendOTPClicked() {
  //   this.userDataService.resendOTP(this.data.appNo).subscribe(() => {});
  //   this.startResendTimer();
  // }

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
