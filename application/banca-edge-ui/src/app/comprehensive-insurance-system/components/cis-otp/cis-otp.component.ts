import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComprehensiveInsuranceSystemService } from '@app/comprehensive-insurance-system/services/comprehensive-insurance-system.service';
import { LoaderService } from '@app/_services/loader.service';

@Component({
  selector: 'app-cis-otp',
  templateUrl: './cis-otp.component.html',
  styleUrls: ['./cis-otp.component.css'],
})
export class CisOtpComponent implements OnInit {
  otpValue = 5555;

  otpFormGroup: FormGroup;

  resendCounter;

  constructor(
    private dialogRef: MatDialogRef<CisOtpComponent>,
    private service: ComprehensiveInsuranceSystemService,
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
    const payload = { otpKey: this.data.appNo, otp: this.otpFormGroup.get('otp').value.trim() };
    this.service.validateOtp(payload).subscribe((status) => {
      this.loaderService.showSpinner(false);

      if (status['statusCode'] === '0') {
        this.dialogRef.close({valid:true,message:''});
      } else {
        this.dialogRef.close({valid:false,message:status['message']});
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
