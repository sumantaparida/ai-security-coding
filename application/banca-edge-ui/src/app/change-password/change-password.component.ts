import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AccountService, AlertService } from '@app/_services';
import { MustMatch } from '@app/_helpers/must-match.validator';
import * as crypto from 'crypto-js';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from '@app/_services/loader.service';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  isOldPasswordVisible = false;
  isNewPasswordVisible = false;
  isConfirmPasswordVisible = false;
  userName;
  forceReset = false;
  @ViewChild('oldpassword') OldPassword: ElementRef;
  @ViewChild('newpassword') NewPassword: ElementRef;
  @ViewChild('confirmpassword') ConfirmPassword: ElementRef;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService,
    private dialog: MatDialog,
    private loaderService: LoaderService,
  ) {}

  // 406 for reste password
  ngOnInit() {
    this.route.params.subscribe((param) => {
      if (param.userName) {
        this.userName = param.userName;
        this.forceReset = true;
      }
    });
    this.form = this.formBuilder.group(
      {
        oldPassword: ['', Validators.required],
        newPassword: [
          '',
          [
            Validators.required,
            Validators.pattern(
              '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&<>|])[A-Za-zd$@$!%*?&<>|].{8,}$',
            ),
          ],
        ],
        matchingPassword: ['', Validators.required],
      },
      {
        validator: MustMatch('newPassword', 'matchingPassword'),
      },
    );

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/mycustomers';
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.alertService.clear();
    if (this.form.invalid) {
      return;
    }
    if (this.form.get('oldPassword').value === this.form.get('newPassword').value) {
      const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
        data: 'Old password and New Password cannot be the same',
        panelClass: 'dialog-width',
      });
      return;
    }

    if (this.userName) {
      this.form.addControl('userName', new FormControl(this.userName));
    }
    const secretKey = 'ysecretkeyyy098!';
    const formObj = this.form.getRawValue();
    let encrptedFormObj = {};
    Object.keys(formObj).forEach((key) => {
      console.log('key', key);
      encrptedFormObj[key] = crypto.AES.encrypt(formObj[key], secretKey.trim()).toString();
    });
    const serializedForm = JSON.stringify(encrptedFormObj);
    const mutatedForm = JSON.parse(serializedForm);
    console.log(mutatedForm);

    this.loading = true;
    this.loaderService.showSpinner(true);
    if (this.forceReset) {
      this.accountService.changeExpiredPassword(mutatedForm).subscribe(
        (res) => {
          this.loaderService.showSpinner(false);
          console.log("check this res response = " , res);
          this.responseFunction(res);
        },
        (error) => {
          this.loaderService.showSpinner(false);
          console.log("check this error response = " , error);
          const errMessage = error.message ? error.message : "Existing Password is Incorrect";
          // console.log('error', error.error.details[0]);
          const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
            data: errMessage,
            panelClass: 'dialog-width',
          });
        },
      );
    } else {
      this.accountService.changePassword(mutatedForm).subscribe(
        (res) => {
          this.loaderService.showSpinner(false);
          console.log("check this res response = " , res);
          this.responseFunction(res);
          // console.log('data', res);
          // const data = JSON.parse(
          //   crypto.AES.decrypt(res['payload'], secretKey.trim()).toString(crypto.enc.Utf8),
          // );
          //  console.log(data)
        },
        (error) => {
          this.loaderService.showSpinner(false);
          console.log("check this error response = " , error);

          // console.log('error', error.error.details[0]);
          const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
            data: 'Existing Password is Incorrect',
            panelClass: 'dialog-width',
          });
        },
      );
    }
  }

  responseFunction(res) {
    console.log("check this change password response = " , res);
    if (res['returnCode'] === 0) {
      
      const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
        data: res['returnMessage'],
        panelClass: 'dialog-width',
      });
      dialogRef.afterClosed().subscribe(() => {
        this.accountService.logout().subscribe(
          (logout) => {
            // console.log('Logged Out');
            // this.alertService.info('Please login again');
          },
          (error) => {
            console.log(error);
          },
        );
      });
    } else {
      const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
        data: res['returnMessage'],
        panelClass: 'dialog-width',
      });
      dialogRef.afterClosed().subscribe(() => {});
    }
  }

  cancel() {
    this.router.navigate([this.returnUrl]);
  }

  togglePassword(val, type) {
    if (val) {
      this[type].nativeElement.type = 'text';
      this[`is${type}Visible`] = true;
    } else {
      this[type].nativeElement.type = 'password';
      this[`is${type}Visible`] = false;
    }
  }
}
