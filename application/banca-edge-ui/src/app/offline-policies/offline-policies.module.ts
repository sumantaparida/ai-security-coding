import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { OfflinePoliciesRoutingModule } from './offline-policies-routing.module';
import { MatBadgeModule } from '@angular/material/badge';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { MatDialogModule } from '@angular/material/dialog';
import { MatStep, MatStepperModule } from '@angular/material/stepper';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { OfflinePoliciesComponent } from './offline-policies.component';
import { NewApplicationComponent } from './components/new-application/new-application.component';
import { OfflinePoliciesService } from './services/offline-policies.service';

import { DisplaySectionPipe } from './pipes/display-section.pipe';
import { DisplayFormPipe } from './pipes/display-form.pipe';
import { RelationshipFilterPipe } from './pipes/relationship-filter.pipe';
import { GetInsuredName } from './pipes/get-insured-name';
import { GetMembersPipe } from './pipes/get-members.pipe';
import { ShowEditLinkPipe } from './pipes/show-edit-link.pipe';
import { DisplayFormFieldPipe } from './pipes/display-form-field.pipe';
import { SharedModule } from '@app/shared/shared.module';
import { PolicyErrorModal2Component } from './components/policy-error-modal/policy-error-modal.component';

@NgModule({
  declarations: [
    OfflinePoliciesComponent,
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
  ],
  imports: [
    CommonModule,
    OfflinePoliciesRoutingModule,
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
  providers: [OfflinePoliciesService],
})
export class OfflinePoliciesModule {}
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
