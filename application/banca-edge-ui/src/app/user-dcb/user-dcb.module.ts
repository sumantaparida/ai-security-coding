import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDcbsComponent } from './user-dcb/user-dcb.component';
import { UserRoutingModule } from './user-dcb-routing.module';
import { UserDcbService } from './service/user-dcb-service';
import { MatTableModule } from '@angular/material/table';
import { UserDcbComponent } from './user-dcb.component';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CertificateEntryModalComponent } from './modal/certificate-entry-modal/certificate-entry-modal.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { PopUpMsgComponent } from './modal/pop-up-msg/pop-up-msg.component';
import { SharedModule } from '@app/shared/shared.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';


@NgModule({
  declarations: [
    UserDcbsComponent,
    UserDcbComponent,
    CertificateEntryModalComponent,
    PopUpMsgComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    MatTableModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatMenuModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    SharedModule,
    NgxMatSelectSearchModule,

  ],
  providers: [UserDcbService],
})
export class UserDcbModule {}
