import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppNavComponent } from './app-nav/app-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MycustomersModule } from '@app/mycustomers/mycustomers.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { AlertModule } from '@app/_components/alert.module';

import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatDividerModule } from '@angular/material/divider';
import { FooterNavComponent } from './footer-nav/footer-nav.component';
import { MatFormFieldModule } from '@angular/material/form-field';
// import { BlockerModule } from '@app/blocker/blocker.module';
import { ChangePasswordModule } from '@app/change-password/change-password.module';
import { I18nModule } from './i18n/i18n.module';
import { SelectLanguageComponent } from './select-language/select-language.component';

import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { PaginatorIntlService } from '@app/_services';
import { MydashboardComponent } from './mydashboard/mydashboard.component';
import { MyrenewalsComponent } from './myrenewals/myrenewals.component';

// import { PolicyvaultComponent } from './policyvault/policyvault.component';
import { QuickquoteComponent } from './quickquote/quickquote.component';
// import { EditIndividualCustomerComponent } from './mycustomers/components/edit-individual-customer/edit-individual-customer.component';
import { Injector, APP_INITIALIZER } from '@angular/core';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import {
  LOCATION_INITIALIZED,
  CommonModule,
  LocationStrategy,
  PathLocationStrategy,
} from '@angular/common';
import { ComplaintsModule } from './complaints/complaints.module';
import { ServiceRequestModule } from './service-request/service-request.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { QuoteModule } from './quote/quote.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDialogModule } from '@angular/material/dialog';
import { BankB2cComponent } from './bank-b2c/bank-b2c.component';
import { ConfirmationComponent } from './_components/confirmation/confirmation.component';
import { PostPaymentComponent } from './_components/postpayment/postpayment.component';
import { PaymentInfoComponent } from './internal-payment/payment-info.component';
import { PaymentInfoService } from './internal-payment/payment-info.service';
import { BankUserComponent } from './bank-user/bank-user.component';
import { RegisterCustomerComponent } from './_components/register-customer/register-customer.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { QuotesModule } from './quotes/quotes.module';
import { AssistMeComponent } from './_components/assist-me/assist-me.component';
import { QrLandingPageComponent } from './qr-landing-page/qr-landing-page.component';
import { SharedModule } from './shared/shared.module';
import { IssuePolicyComponent } from './_components/issue-policy/issue-policy.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SuccessInterceptor } from './_helpers/success.interceptor';
import { ConsentModalComponent } from './LMS/components/consent-modal/consent-modal.component';
import { DcbAdfsComponent } from './dcb-adfs/dcb-adfs.component';
import { PopUpModalComponent } from './LMS/components/pop-up-modal/pop-up-modal.component';
import { CisComponent } from './cis/cis.component';
import { SelectInsurerModelCisComponent } from './select-insurer-model-cis/select-insurer-model-cis.component';
import { BulkUploadComponent } from './bulk-upload/bulk-upload.component';
import { BulkUploadViewComponent } from './bulk-upload-view/bulk-upload-view.component';
import { SPDROPDOWN } from './shared/pipes/show-sp-option.pipe';
import { DirectDebitModalComponent } from './LMS/components/direct-debit-modal/direct-debit-modal.component';
import { NeedInvestmentComponent } from './LMS/components/need-investment/need-investment.component';
import { SibLandingPageComponent } from './sib-landing-page/sib-landing-page/sib-landing-page.component';
import { SibOtpModelComponent } from './sib-landing-page/sib-otp-model/otp-model.component';

// import { CountdownModule } from 'ngx-countdown';

// import {MatFileUploadModule } from 'mat-file-upload';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export function appInitializerFactory(translate: TranslateService, injector: Injector) {
  return () =>
    new Promise<any>((resolve: any) => {
      const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
      locationInitialized.then(() => {
        const langToSet = 'en';
        translate.setDefaultLang('en');
        translate.use(langToSet).subscribe(
          () => {
            console.log(`Successfully initialized '${langToSet}' language.'`);
          },
          () => {
            console.error(`Problem with '${langToSet}' language initialization.'`);
          },
          () => {
            resolve(null);
          },
        );
      });
    });
}
@NgModule({
  declarations: [
    AppComponent,
    AppNavComponent,
    FooterNavComponent,
    SelectLanguageComponent,
    MydashboardComponent,
    MyrenewalsComponent,

    QuickquoteComponent,
    BankB2cComponent,
    ConfirmationComponent,
    PostPaymentComponent,
    PaymentInfoComponent,
    BankUserComponent,
    RegisterCustomerComponent,
    AssistMeComponent,
    SPDROPDOWN,
    QrLandingPageComponent,
    IssuePolicyComponent,
    ConsentModalComponent,
    DcbAdfsComponent,
    PopUpModalComponent,
    CisComponent,
    SelectInsurerModelCisComponent,
    BulkUploadComponent,
    BulkUploadViewComponent,
    DirectDebitModalComponent,
    NeedInvestmentComponent,
    SibLandingPageComponent,
    SibOtpModelComponent,
  ],
  imports: [
    CommonModule,
    NgxSpinnerModule,
    FlexLayoutModule,
    NgxMatSelectSearchModule,
    SharedModule,
    // CountdownModule,
    // BlockerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatListModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatSidenavModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatRadioModule,
    MatSelectModule,
    MatTableModule,
    MatGridListModule,
    MatMenuModule,
    ComplaintsModule,
    ServiceRequestModule,
    MycustomersModule,
    QuoteModule,
    QuotesModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatCardModule,
    MatBadgeModule,
    MatFormFieldModule,
    ChangePasswordModule,
    MatAutocompleteModule,
    MatIconModule,
    MatStepperModule,
    MatDialogModule,
    MatFormFieldModule,
    AlertModule,
    I18nModule,
    MatSlideToggleModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: SuccessInterceptor, multi: true },
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    {
      provide: MatPaginatorIntl,
      useFactory: (translate) => {
        const service = new PaginatorIntlService();
        service.injectTranslateService(translate);
        return service;
      },
      deps: [TranslateService],
    },

    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [TranslateService, Injector],
      multi: true,
    },
    PaymentInfoService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
