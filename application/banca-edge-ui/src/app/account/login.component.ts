import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertModule } from '@app/_components/alert.module';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AccountService, AlertService } from '@app/_services';
import { state } from '@angular/animations';
import { LoaderService } from '@app/_services/loader.service';
import { MatDialog } from '@angular/material/dialog';
import { OtpLoginComponent } from './otp-login.component';
import * as CryptoJS from 'crypto-js';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';

@Component({
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  loading = false;

  submitted = false;

  returnUrl: string;

  isPasswordVisible = false;

  loginError = false;

  errorMessage = '';

  user;

  showCaptchSpinner = false;

  decryptedData;

  @ViewChild('password') MyProp: ElementRef;

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
      password: ['', Validators.required],
    });
    this.returnUrl = sessionStorage.getItem('currentUrl');
    this.showCaptchSpinner = true;
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;

    this.alertService.clear();

    if (this.form.invalid) {
      const sentence = 'Failed to login';
      return sentence;
    }

    this.loaderService.showSpinner(true);
    this.accountService
      .login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        (data) => {
          console.log('data==', data);
          this.loginError = false;
          this.loaderService.showSpinner(false);
          if (data?.responseCode == 402) {
            let dialog = this.dialog.open(PolicyErrorModalComponent, {
              data: data.responseMessage,
              panelClass: 'dialog-width',
            });

            dialog.afterClosed().subscribe(() => {
              this.router.navigateByUrl(`/changepassword/${this.f.username.value}`);
            });
          }

          if (data?.otpValidationRequired) {
            const orgCode = data.orgCode;
            const responseCode = data.responseCode;
            const dialogRef = this.dialog.open(OtpLoginComponent, {
              data: { userName: this.f.username.value, mobileNo: data.mobileNo, SB: true,message:data.message,orgCode:orgCode,responseCode:responseCode },
            });
            dialogRef.afterClosed().subscribe((data) => {
              console.log('otp modal closed', data);
              
              if (data === 'validation failed') {

              this.loginError = true;
              this.errorMessage = 'OTP verification failed';

                // this.accountService.logout().subscribe((data) => {
                //   console.log('logging out as otp is wrong', data);
                //   this.loginError = true;
                //   this.errorMessage = 'OTP verification failed';
                // });
              } else {
                console.log('dattttaa', data);
                this.accountService.user.subscribe((user) => {
                  this.decryptedData = user;
                });

                this.navigateAfterLoggingIn();
              }
            });
          } else {
            this.decryptedData = JSON.parse(
              CryptoJS.AES.decrypt(data['payload'], 'ysecretkeyyy098!').toString(CryptoJS.enc.Utf8),
            );
            this.navigateAfterLoggingIn();
          }
        },
        (error) => {
          this.loginError = true;
          console.log('login error', error);
          this.errorMessage = error?.message;
          // if ()
          this.alertService.error(error);
          this.loaderService.showSpinner(false);
        },
      );
  }

  navigateAfterLoggingIn() {
    console.log('decrypted data', this.decryptedData);
    console.log('coming in navigatelogg', this.decryptedData);
    if (this.decryptedData.organizationCode === 'DCB') {
      this.navigateDcb();
    } else if (this.decryptedData.organizationCode === 'CSB') {
      let isAdminUser = this.decryptedData['userGroups'].includes('ADMIN') ? true : false;
      if (this.decryptedData.isInsurerUser) {
        this.router.navigateByUrl('/lms');
      } else if (isAdminUser) {
        this.router.navigateByUrl('/mycustomers');
      } else if (
        this.decryptedData.isSP == false &&
        !this.decryptedData.isInsurerUser &&
        !isAdminUser
      ) {
        if (
          this.decryptedData.userGroups.includes('GI_POSP') ||
          this.decryptedData.userGroups.includes('LI_POSP')
        ) {
          this.router.navigateByUrl('/mycustomers');
        } else this.router.navigateByUrl('/posp');
        // for csb prod mycustomers
      } else if (this.decryptedData.isSP) {
        this.router.navigateByUrl('/mycustomers');
      }
    } else {
      console.log('coming inside1');
      if (
        !this.decryptedData.isInsurerUser &&
        this.decryptedData.organizationCode !== 'DCB' &&
        this.decryptedData.organizationCode !== 'CSB'
      ) {
        this.router.navigate(['/mycustomers']);
      } else if (
        this.decryptedData.isInsurerUser == true &&
        this.decryptedData.organizationCode === 'SIB'
      ) {
        this.router.navigate(['lms']);
      } else if (
        this.decryptedData.isInsurerUser == true &&
        this.decryptedData.organizationCode !== 'BOM' &&
        this.decryptedData.organizationCode !== 'CSB'
      ) {
        console.log('insnde login inusrer true');
        this.router.navigate(['lms']);
      } else if (this.decryptedData.organizationCode === 'DCB' && !this.accountService.isSP) {
        this.router.navigate(['lms']);
      }
    }
  }

  navigateDcb() {
    console.log('insinde ');
    // let currentUser = this.accountService.userValue;
    let isAdminUser = this.decryptedData['userGroups'].includes('ADMIN') ? true : false;
    let isUamUser = this.decryptedData['userGroups'].includes('UAM_USER') ? true : false;
    // let isAdminUser = this.accountService.isAdminUser;
    // let isUamUser = this.accountService.isUamUser;
    console.log('TODAY login', isAdminUser, isUamUser);

    if (isUamUser) {
      this.router.navigate(['uam']);
    } else if (isAdminUser) {
      this.router.navigate(['lms']);
    } else {
      this.router.navigateByUrl(this.returnUrl);
    }
  }

  forgotPassword() {
    this.router.navigate(['account/forgotpassword']);
  }

  register() {
    this.router.navigate(['account/registerCustomer']);
  }

  returnFalse(event) {
    console.log('check the event', event);
    return event.preventDefault();
  }

  togglePassword(val) {
    if (val) {
      this.MyProp.nativeElement.type = 'text';
      this.isPasswordVisible = true;
    } else {
      this.MyProp.nativeElement.type = 'password';
      this.isPasswordVisible = false;
    }
  }

  omitSpecialChar(event) {
    let k;
    k = event.charCode;
    console.log(k);
    //         k = event.keyCode;  (Both can be used)
    return (
      (k > 63 && k < 91) ||
      (k > 96 && k < 123) ||
      k == 8 ||
      k == 32 ||
      k == 46 ||
      k == 45 ||
      k == 95 ||
      (k >= 48 && k <= 57)
    );
  }
}
