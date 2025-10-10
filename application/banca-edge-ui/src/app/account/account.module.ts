import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { LayoutComponent } from './layout.component';
import { LoginComponent } from './login.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AlertModule } from '@app/_components/alert.module';
import { ForgotPasswordComponent } from '@app/forgot-password/forgot-password.component';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { OtpLoginComponent } from './otp-login.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ConsentEndPage } from './consent-end-page.component';
// import { RegisterCustomerComponent } from './register-customer/register-customer.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AccountRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    AlertModule,
    NgxSpinnerModule,
  ],
  declarations: [
    OtpLoginComponent,
    LayoutComponent,
    LoginComponent,
    // RegisterCustomerComponent,
    ForgotPasswordComponent,
    ConsentEndPage,
  ],
  providers: [CookieService],
})
export class AccountModule {}
