import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComplaintComponent } from './home-complaint/home-complaint.component';
import { ComplaintsRoutingModule } from './complaints-routing.module';
import { PolicyNumberComponent } from './policy-number/policy-number.component';
import { DetailsCorrectionComponent } from './details-correction/details-correction.component';
import { CustomerMailIdComponent } from './customer-mail-id/customer-mail-id.component';
import { ComplaintAgainstComponent } from './complaint-against/complaint-against.component';
import { ComplaintModeComponent } from './complaint-mode/complaint-mode.component';
import { ComplaintNatureComponent } from './complaint-nature/complaint-nature.component';
import { UploadDocumentsComponent } from './upload-documents/upload-documents.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ComplaintDataService } from './complaint-data.service';
import { DisplayComplaintsComponent } from './display-complaints/display-complaints.component';
import { FormsModule } from '@angular/forms';
// material import
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { ComplaintResolutionModelComponent } from './complaint-resolution-model/complaint-resolution-model.component';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { MaterialFileInputModule } from 'ngx-material-file-input';

import { TranslateModule } from '@ngx-translate/core';

// interceptors
import { MatBadgeModule } from '@angular/material/badge';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ViewComplaintComponent } from './view-complaint/view-complaint.component';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ComplaintsRoutingModule,
    ReactiveFormsModule,
    TranslateModule,
    // material
    FlexLayoutModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    MatMenuModule,
    MatCardModule,
    MatDialogModule,
    MatSelectModule,
    MatTableModule,
    MatBadgeModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    SharedModule,
  ],

  declarations: [
    HomeComplaintComponent,
    PolicyNumberComponent,
    DetailsCorrectionComponent,
    CustomerMailIdComponent,

    ComplaintAgainstComponent,
    ComplaintModeComponent,
    ComplaintNatureComponent,
    UploadDocumentsComponent,
    DisplayComplaintsComponent,
    ComplaintResolutionModelComponent,
    ViewComplaintComponent,
  ],

  providers: [ComplaintDataService],

  entryComponents: [ComplaintResolutionModelComponent],
})
export class ComplaintsModule {}
