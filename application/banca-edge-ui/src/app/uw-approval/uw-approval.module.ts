import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UwApprovalComponent } from './uw-approval.component';
import { MatTableModule } from '@angular/material/table';
import { UwRoutingModule } from './uw-approval-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { UwDecissionComponent } from './uw-decission/uw-decission.component';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { UwAddNoteModelComponent } from './components/uw-add-note-model/uw-add-note-model.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { SharedModule } from '@app/shared/shared.module';
import { MedicalRequirementComponent } from './components/medical-requirement/medical-requirement.component';


@NgModule({
  declarations: [UwApprovalComponent, UwDecissionComponent, UwAddNoteModelComponent, MedicalRequirementComponent],
  imports: [
    CommonModule,
    UwRoutingModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatDialogModule,
    MatListModule,
    SharedModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),

  ]
})
export class UwApprovalModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
