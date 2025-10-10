import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { OtpLoginComponent } from '@app/account/otp-login.component';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';
import { SharedServiceComponent } from '@app/shared/services/shared-service';
import { LoaderService } from '@app/_services/loader.service';
import { SibOtpModelComponent } from '../sib-otp-model/otp-model.component';

@Component({
  selector: 'app-sib-landing-page',
  templateUrl: './sib-landing-page.component.html',
  styleUrls: ['./sib-landing-page.component.css'],
})
export class SibLandingPageComponent implements OnInit {
  token;

  applicationNumber;
  mobileNumber;
  email;
  payload;
  orgCode;

  constructor(
    public dialog: MatDialog,
    private sharedService: SharedServiceComponent,
    private route: ActivatedRoute,
    private router: Router,
    private loaderService: LoaderService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.token = params.token;
      this.applicationNumber = params.applicationNumber;
      this.mobileNumber = params.mobileNumber;
      this.email = params.email;
      this.payload = {
        otpKey: this.applicationNumber,
        mobileNo: this.mobileNumber,
        email: this.email,
      };
      this.orgCode = params.orgCode;
      if (this.orgCode == 'DCB') {
        this.router.navigate([`/consent/${this.orgCode}/${true}/${this.applicationNumber}`]);
      } else {
        this.loaderService.showSpinner(true);

        this.sharedService.sendOtp(this.payload).subscribe(
          (res) => {
            this.loaderService.showSpinner(false);

            if (res['returnCode'] == 0 || res['statusCode'] == 0) {
              this.validateCustomerConsent();
            } else {
              const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
                data: res['returnMessage'],
                panelClass: 'dialog-width',
              });
              //show error message
            }
          },
          (err) => {
            this.loaderService.showSpinner(false);
            const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
              data: err['returnMessage']
                ? err['returnMessage']
                : 'Something went wrong, please try later',
              panelClass: 'dialog-width',
            });
          },
        );
      }
    });
  }

  validateCustomerConsent() {
    let dialogRef = this.dialog.open(SibOtpModelComponent, {
      data: {
        token: this.token,
        otpKey: this.applicationNumber,
        payload: this.payload,
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res === 0) {
        this.router.navigate([`/consent/${this.orgCode}/${true}/${this.applicationNumber}`]);
      }
    });
  }
}
