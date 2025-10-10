import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComprehensiveInsuranceSystemRoutingModule } from './comprehensive-insurance-system-routing.module';
import { ComprehensiveInsuranceSystemComponent } from './comprehensive-insurance-system.component';
import { GeneralComponent } from './components/general/general.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { DisplaySectionPipe } from './pipes/display-section.pipe';
import { DisplayFormFieldPipe } from './pipes/display-form-field.pipe';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SharedModule } from '@app/shared/shared.module';
import { MatStepperModule } from '@angular/material/stepper';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ContactInfoComponent } from './components/contact-info/contact-info.component';
import { CisOtpComponent } from './components/cis-otp/cis-otp.component';
import { CisViewComponent } from './components/cis-view/cis-view.component';
import { CisModalComponent } from './components/cis-modal/cis-modal.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    ComprehensiveInsuranceSystemComponent,
    GeneralComponent,
    DisplaySectionPipe,
    DisplayFormFieldPipe,
    ContactInfoComponent,
    CisOtpComponent,
    CisViewComponent,
    CisModalComponent,
  ],
  imports: [
    CommonModule,
    ComprehensiveInsuranceSystemRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatRadioModule,
    MatInputModule,
    MatDatepickerModule,
    MatCheckboxModule,
    SharedModule,
    MatStepperModule,
    FlexLayoutModule,
    MatDialogModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatMenuModule,
    // BrowserAnimationsModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
})
export class ComprehensiveInsuranceSystemModule {}
