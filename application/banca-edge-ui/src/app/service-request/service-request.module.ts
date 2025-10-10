import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeServiceRequestComponent } from './components/home-service-request/home-service-request.component';
import { ServiceRequestRoutingModule } from './service-request-routing.module';
import { PolicyNumberComponent } from './components/policy-number/policy-number.component';
import { DetailsCorrectionComponent } from './components/details-correction/details-correction.component';
import { CustomerMailIdComponent } from './components/customer-mail-id/customer-mail-id.component';
import { ServiceRequestAgainstComponent } from './components/service-request-against/service-request-against.component';
import { ServiceRequestModeComponent } from './components/service-request-mode/service-request-mode.component';
import { ServiceRequestNatureComponent } from './components/service-request-nature/service-request-nature.component';
import { UploadDocumentsComponent } from './components/upload-documents/upload-documents.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ServiceRequestDataService } from './services/service-request-data.service';
import { DisplayServiceRequestComponent } from './components/display-service-request/display-service-request.component';
import { FormsModule } from '@angular/forms';
// material import
import { MatExpansionModule } from '@angular/material/expansion';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { ServiceRequestResolutionModelComponent } from './components/service-request-resolution-model/service-request-resolution-model.component';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import {MatFileUploadModule } from '@a';
// import { MaterialFileInputModule } from 'ngx-material-file-input';
import { TranslateModule } from '@ngx-translate/core';

// interceptors
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ViewServiceRequestComponent } from './components/view-service-request/view-service-request.component';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';



@NgModule({
  imports: [
    CommonModule,
    ServiceRequestRoutingModule,
    ReactiveFormsModule,
    TranslateModule,
    // material
    MatExpansionModule,
    FlexLayoutModule,
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
  ],

  declarations: [
    HomeServiceRequestComponent,
    PolicyNumberComponent,
    DetailsCorrectionComponent,
    CustomerMailIdComponent,
    ServiceRequestAgainstComponent,
    ServiceRequestModeComponent,
    ServiceRequestNatureComponent,
    UploadDocumentsComponent, DisplayServiceRequestComponent, ServiceRequestResolutionModelComponent, ViewServiceRequestComponent],

  providers: [ServiceRequestDataService,
    // { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    //   // provider used to create fake backend
    //   fakeBackendProvider
  ],


  entryComponents: [ServiceRequestResolutionModelComponent]
})
export class ServiceRequestModule { }
