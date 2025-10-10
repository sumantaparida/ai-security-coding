import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpApprovalComponent } from './sp-approval.component';
import { SpApprovalRoutingModule } from './sp-approval-routing.module';
import { SpApprovalService } from './service/sp-approval.service';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



//material
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';

import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';


import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';




@NgModule({
  declarations: [SpApprovalComponent],
  imports: [
    CommonModule,
    SpApprovalRoutingModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,

    //material
    MatInputModule,
    MatCheckboxModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatListModule,
    MatGridListModule,
    MatPaginatorModule,
    MatCardModule,
    MatSortModule,
    MatTableModule,
    MatMenuModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatRadioModule,
    // MatFormFieldModule,
    MatIconModule,
    MatBadgeModule

  ],
  providers: [SpApprovalService]
})
export class SpApprovalModule { }
