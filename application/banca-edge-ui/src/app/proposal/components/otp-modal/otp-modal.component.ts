import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProposalService } from '@app/proposal/services/proposal.service';

@Component({
  selector: 'app-otp-modal',
  templateUrl: './otp-modal.component.html',
  styleUrls: ['./otp-modal.component.css'],
})
export class OtpModalComponent implements OnInit {
  otpValue = 5555;
  otpFormGroup: FormGroup;
  resendCounter;

  constructor(
    private dialogRef: MatDialogRef<OtpModalComponent>,
    private proposalService: ProposalService,
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
    this.proposalService
      .validateOTP(this.data.appNo, this.otpFormGroup.get('otp').value)
      .subscribe((status) => {
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

  onResendOTPClicked() {
    this.proposalService.resendOTP(this.data.appNo).subscribe(() => {});
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
