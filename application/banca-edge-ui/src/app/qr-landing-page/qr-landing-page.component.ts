import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService, UserService } from '@app/_services';
import { LoaderService } from '@app/_services/loader.service';

@Component({
  selector: 'app-qr-landing-page',
  templateUrl: './qr-landing-page.component.html',
  styleUrls: ['./qr-landing-page.component.css'],
})
export class QrLandingPageComponent implements OnInit {
  customerDetailsForm: FormGroup;

  showOtpField = false;

  showErrorMessage = false;

  errorMessage: string;

  productId;

  type = 'cif';

  verificationKey;

  constructor(
    private userService: UserService,
    private accountService: AccountService,
    private router: Router,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      if (param.productId) {
        this.productId = param.productId;
      }
    });
    this.customerDetailsForm = new FormGroup({
      cifNo: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]*$/)]),
      inputType: new FormControl(false, [Validators.required]),
    });
  }

  onSubmitClicked() {
    if (!this.showOtpField) {
      this.loaderService.showSpinner(true);
      const reqBody = {
        cifNumber: this.customerDetailsForm.get('cifNo').value,
        inputType: !this.customerDetailsForm.get('inputType').value ? 1 : 2,
        orgCode: 'BOM',
      };
      this.userService.validateCifWithMobile(reqBody).subscribe(
        (data) => {
          this.loaderService.showSpinner(false);
          this.showOtpField = true;
          this.verificationKey = data['verificationKey'];
          this.customerDetailsForm.get('cifNo').disable();
          this.customerDetailsForm.get('inputType').disable();
          this.customerDetailsForm.addControl('otp', new FormControl('', Validators.required));
        },
        () => {
          this.loaderService.showSpinner(false);
        },
      );
    } else {
      this.loaderService.showSpinner(true);
      this.userService
        .validateCustomerWithOtp(this.verificationKey, this.customerDetailsForm.get('otp').value)
        .subscribe(
          (res) => {
            this.loaderService.showSpinner(false);
            if (res['validationSucessful'] && res['responseCode'] === 200) {
              this.accountService.setUser(res['user']);
              this.router.navigate(['quote', this.verificationKey.split('_')[1], this.productId]);
            } else {
              this.showErrorMessage = true;
              this.errorMessage = 'OTP Entered is invalid.';
            }
          },
          () => {
            this.loaderService.showSpinner(false);
          },
        );
    }
  }

  onToggled(event) {
    console.log('event', event);
    this.customerDetailsForm.get('cifNo').reset();
    if (event.checked) {
      this.type = 'accNo';
      this.customerDetailsForm.get('inputType').setValue(true);
    } else {
      this.type = 'cif';
      this.customerDetailsForm.get('inputType').setValue(false);
    }
  }
}
