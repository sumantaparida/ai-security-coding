import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserManagementRoutingModule } from './user-management-routing.module';
import { AddMasterComponent } from './components/add-master/add-master.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserRoutingModule } from '@app/user-dcb/user-dcb-routing.module';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ViewUserComponent } from './components/view-user/view-user.component';
import { PolicyRoutingModule } from '@app/policyvault/policyvault-routing.module';
import { MatBadgeModule } from '@angular/material/badge';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { HttpLoaderFactory, SharedModule } from '@app/shared/shared.module';
import { HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddOrEditUserComponent } from './components/add-or-edit-user/add-or-edit-user.component';
import { DisplayFieldPipe } from './components/display-field.pipe';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { YesNoModelComponent } from './components/yes-no-model/yes-no-model.component';
import { ViewMasterComponent } from './view-master/view-master.component';
import { UpdateLeadStatusDialog } from './dialog/update-lead-status.dialog';

@NgModule({
  declarations: [
    AddMasterComponent,
    ViewUserComponent,
    AddOrEditUserComponent,
    DisplayFieldPipe,
    FileUploadComponent,
    YesNoModelComponent,
    ViewMasterComponent,
    UpdateLeadStatusDialog,
  ],
  imports: [
    CommonModule,
    UserManagementRoutingModule,
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    UserRoutingModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatCheckboxModule,
    MatFormFieldModule,
    FlexLayoutModule,
    MatCardModule,
    MatPaginatorModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMatSelectSearchModule,
    MatFormFieldModule,

    FormsModule,

    // Table
    PolicyRoutingModule,
    MatBadgeModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    MatSortModule,
    MatMenuModule,
    SharedModule,
  ],
})
export class UserManagementModule {}
