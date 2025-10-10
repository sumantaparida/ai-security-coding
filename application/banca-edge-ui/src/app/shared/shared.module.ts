import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PolicyErrorModalComponent } from './components/policy-error-modal/policy-error-modal.component';
import { PolicyPromptModalComponent } from './components/policy-prompt-modal/policy-prompt-modal.component';
import { DatexPipe } from './pipes/datex.pipe';
import { GetDatePipe } from './pipes/get-date.pipe';
import { SearchDropDownPipe } from './pipes/search-dropdown.pipe';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { SharedRoutingModule } from './shared-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SimpleYesNoModalComponent } from './components/simple-yes-no-modal/simple-yes-no-modal.component';
import { NumberToWordPipe } from './pipes/number-to-word-pipe';
import { HelpPageComponent } from './components/help-page/help-page.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { GetEmailPipe } from './pipes/get-email.pipe';
import { ApplicationDetailsComponent } from './components/application-details/application-details.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AddOrSubExtraDatePipe } from './pipes/add-or-sub-extra-date.pipe';
import { MaskPhonePipe } from './pipes/mask-phone.pipe';
import { MaskDobPipe } from './pipes/mask-dob.pipe';
import { MaskNamePipe } from './pipes/mask-name.pipe';
import { MaskEmailPipe } from './pipes/mask-email.pipe';
import { CheckRolesPipe } from './pipes/check-roles.pipe';
import { OtpSharedModalComponent } from './components/otp-shared-modal/otp-shared-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedServiceComponent } from './services/shared-service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { OtpModalComponent } from './components/otp-modal/otp-modal.component';
import { LeadBatchDataComponent } from './components/lead-batch-data/lead-batch-data.component';
import { FieldModalComponent } from './components/common-field-modal/field-modal/field-modal.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { HelpInfoPipe } from './pipes/helpInfo.pipe';
import { OtpForgotPasswordModalComponent } from './components/otp-forgot-password-modal/otp-forgot-password-modal.component';
import { PospComponent } from './components/posp/posp.component';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
@NgModule({
  declarations: [
    PolicyErrorModalComponent,
    PolicyPromptModalComponent,
    SimpleYesNoModalComponent,
    SearchDropDownPipe,
    GetDatePipe,
    DatexPipe,
    HelpInfoPipe,
    ErrorPageComponent,
    NumberToWordPipe,
    HelpPageComponent,
    GetEmailPipe,
    ApplicationDetailsComponent,
    AddOrSubExtraDatePipe,
    MaskPhonePipe,
    MaskDobPipe,
    MaskNamePipe,
    MaskEmailPipe,
    CheckRolesPipe,
    OtpSharedModalComponent,
    OtpModalComponent,
    LeadBatchDataComponent,
    FieldModalComponent,
    OtpForgotPasswordModalComponent,
    PospComponent,
   
  ],
  imports: [
    SharedRoutingModule,
    FlexLayoutModule,
    MatCardModule,
    MatRadioModule,
    MatSelectModule,
    MatDatepickerModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatTableModule,
    MatMenuModule,
    CommonModule,
    NgxMatSelectSearchModule,
    MatPaginatorModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  exports: [
    ApplicationDetailsComponent,
    SearchDropDownPipe,
    PolicyErrorModalComponent,
    PolicyPromptModalComponent,
    SimpleYesNoModalComponent,
    GetDatePipe,
    DatexPipe,
    GetEmailPipe,
    AddOrSubExtraDatePipe,
    MaskPhonePipe,
    MaskDobPipe,
    MaskNamePipe,
    MaskEmailPipe,
    HelpInfoPipe,
    CheckRolesPipe,
    LeadBatchDataComponent,
  ],
  providers: [SharedServiceComponent],
})
export class SharedModule {}
