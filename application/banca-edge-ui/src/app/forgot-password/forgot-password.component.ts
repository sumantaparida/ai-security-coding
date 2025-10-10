import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AccountService, AlertService } from '@app/_services';
import { MatDialog } from '@angular/material/dialog';
import { OtpForgotPasswordModalComponent } from '@app/shared/components/otp-forgot-password-modal/otp-forgot-password-modal.component';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';
import * as crypto from 'crypto-js';
import { LoaderService } from '@app/_services/loader.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService,
    private dialog: MatDialog,
    private loaderService: LoaderService,
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
    });

    this.returnUrl = '/account/login';
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    const secretKey = 'ysecretkeyyy098!';
    const encryptedUser = crypto.AES.encrypt(this.f.username.value, secretKey.trim()).toString();
    this.submitted = true;

    this.alertService.clear();

    if (this.form.invalid) {
      return;
    }

    this.loaderService.showSpinner(true);
    console.log('user name', this.f.username.value);
    this.accountService.sendOtpOnForgotPassword(encryptedUser).subscribe((res) => {
      this.loaderService.showSpinner(false);

      if (res['returnCode'] === 0) {
        let dialog = this.dialog.open(OtpForgotPasswordModalComponent, {
          data: {
            userName: this.f.username.value,
          },
          panelClass: 'dialog-width',
        });

        dialog.afterClosed().subscribe((res) => {
          if (res === true) {
            this.loaderService.showSpinner(true);

            this.callResendPassword(encryptedUser);
          }
        });
      } else {
        const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
          data: res['returnMessage'],
          panelClass: 'dialog-width',
        });
      }
    });
  }

  callResendPassword(encryptedUser) {
    this.accountService.resetPassword(encryptedUser).subscribe(
      (data) => {
        this.loaderService.showSpinner(false);

        // console.log(data['details'][0]);
        this.alertService.info(data['details']);
        setTimeout(() => {
          this.router.navigate([this.returnUrl]);
        }, 2000);
      },
      (error) => {
        // console.log(error.error.details[0]);
        this.loaderService.showSpinner(false);

        this.alertService.error(error.error.details);
        this.loading = false;
      },
    );
  }

  login() {
    this.router.navigate(['account/login']);
  }
}
