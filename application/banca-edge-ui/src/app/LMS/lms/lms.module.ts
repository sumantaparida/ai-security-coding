import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LmsRoutingModule } from './lms-routing.module';
import { NewApplicationComponent } from '../components/new-application/new-application.component';
import { PolicyErrorModal2Component } from '../components/policy-error-modal/policy-error-modal.component';
import { DisplayFormFieldPipe } from '../pipes/display-form-field.pipe';
import { DisplayFormPipe } from '../pipes/display-form.pipe';
import { DisplaySectionPipe } from '../pipes/display-section.pipe';
import { GetInsuredName } from '../pipes/get-insured-name';
import { GetMembersPipe } from '../pipes/get-members.pipe';
import { RelationshipFilterPipe } from '../pipes/relationship-filter.pipe';
import { ShowEditLinkPipe } from '../pipes/show-edit-link.pipe';
import { HttpClient } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { LmsService } from '../services/lms.service';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LmsComponent } from './lms.component';
import { ModalComponent } from './modal-comnponent/modal.component';
import { LeadBatchDataComponent } from '../components/lead-batch-data/lead-batch-data.component';
import { ViewDocModalComponent } from './view-doc-modal/viewDocModal.component';
import { NewModalComponent } from './new-modal-component/new-modal.component';

@NgModule({
  declarations: [
    LmsComponent,
    NewApplicationComponent,
    // pipes
    DisplaySectionPipe,
    DisplayFormPipe,
    RelationshipFilterPipe,
    GetInsuredName,
    GetMembersPipe,
    DisplayFormFieldPipe,
    ShowEditLinkPipe,
    PolicyErrorModal2Component,
    ModalComponent,
    NewModalComponent,
    LeadBatchDataComponent,
    ViewDocModalComponent,
  ],

  imports: [
    CommonModule,
    LmsRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatBadgeModule,
    FlexLayoutModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    MatIconModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatSortModule,
    MatMenuModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatDatepickerModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    NgxMatSelectSearchModule,
    MatDialogModule,
    MatStepperModule,
    MatAutocompleteModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTabsModule,
    SharedModule,
  ],
  providers: [LmsService],
})
export class LmsModule {}
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
