import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanAccountRoutingModule } from './loan-account-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { LoanComponent } from './loan.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { LoanSearchComponent } from './components/loan-search/loan-search.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatMenuModule } from '@angular/material/menu';
import { LoanDetailsComponent } from './components/loan-details/loan-details.component';
import { RecommendInsuranceComponent } from './components/recommend-insurance/recommend-insurance.component';
import { ViewApplicationComponent } from './components/view-application/view-application.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SharedModule } from '@app/shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { AddLoanDetailsComponent } from './components/add-loan-details/add-loan-details.component';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { CustomerSearchModelComponent } from './components/customer-search-model/customer-search-model.component';
import { MycustomersModule } from '@app/mycustomers/mycustomers.module';
import { CancelPromptModelComponent } from './components/cancel-prompt-model/cancel-prompt-model.component';
import { GroupcreditLeadsComponent } from './components/groupcredit-leads/groupcredit-leads.component';
import { MatSortModule } from '@angular/material/sort';
import { TranslateModule } from '@ngx-translate/core';
import { EditLoanDetailsComponent } from './components/edit-loan-details/edit-loan-details.component';

@NgModule({
  declarations: [
    LoanComponent,
    LoanSearchComponent,
    LoanDetailsComponent,
    RecommendInsuranceComponent,
    ViewApplicationComponent,
    AddLoanDetailsComponent,
    CustomerSearchModelComponent,
    CancelPromptModelComponent,
    GroupcreditLeadsComponent,
    EditLoanDetailsComponent,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    LoanAccountRoutingModule,
    MatIconModule,
    MatButtonToggleModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatInputModule,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule,
    MatBadgeModule,
    MatCheckboxModule,
    SharedModule,
    MatDialogModule,
    MatCardModule,
    MatDatepickerModule,
    MatRadioModule,
    MatSelectModule,
    MycustomersModule,
    TranslateModule,
    MatSortModule,
  ],
})
export class LoanAccountModule {}
