import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MycustomersComponent } from '@app/mycustomers/mycustomers.component';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { LayoutComponent } from './components/layout/layout.component';
import { MycustomersRoutingModule } from './mycustomers-routing.module';
import { BusinessFeatureComponent } from './components/business-feature/business-feature.component';
import { IndividualFeatureComponent } from './components/individual-feature/individual-feature.component';
import { EditIndividualCustomerComponent } from './components/edit-individual-customer/edit-individual-customer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import { EditBusinessCustomerComponent } from './components/edit-business-customer/edit-business-customer.component';
import { AlertModule } from '@app/_components/alert.module';
import { CifModalComponent } from './components/cif-modal/cif-modal.component';
import { SharedModule } from '@app/shared/shared.module';
import { CustomerDetailsComponent } from './components/customer-details/customer-details.component';
import { CustomerSearchComponent } from './components/customer-search/customer-search.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CustomerMobileNoDobModalComponent } from './components/customer-mobile-no-dob-modal/customer-mobile-no-dob-modal.component';
import { CreateLeadModalComponent } from './components/create-lead-modal/create-lead-modal.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RetakeOneMinPlanComponent } from './components/retake-one-min-plan/retake-one-min-plan.component';
import { ConcentOtpComponent } from './components/concent-otp/concent-otp.component';
@NgModule({
  declarations: [
    LayoutComponent,
    MycustomersComponent,
    BusinessFeatureComponent,
    IndividualFeatureComponent,
    EditIndividualCustomerComponent,
    EditBusinessCustomerComponent,
    CifModalComponent,
    CustomerDetailsComponent,
    CustomerSearchComponent,
    CustomerMobileNoDobModalComponent,
    CreateLeadModalComponent,
    RetakeOneMinPlanComponent,
    ConcentOtpComponent,
  ],
  imports: [
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,
    FlexLayoutModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatListModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatTableModule,
    MatCardModule,
    MatGridListModule,
    MatFormFieldModule,
    MatMenuModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatRadioModule,
    MatButtonToggleModule,
    MycustomersRoutingModule,
    MatSelectModule,
    MatTooltipModule,
    AlertModule,
    SharedModule,
  ],
  exports: [MycustomersComponent, CustomerSearchComponent, CustomerDetailsComponent],
})
export class MycustomersModule {}
