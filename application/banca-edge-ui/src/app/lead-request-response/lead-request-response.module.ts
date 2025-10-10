import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LrrComponent } from './lrr/lrr.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginatorModule } from '@angular/material/paginator';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from '@app/app.module';
import { HttpClient } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { LeadRequestResponseRouterModule } from './lead-request-response-routing.module';
import { lrrService } from './lrr.service';

@NgModule({
  declarations: [LrrComponent],
  imports: [
    CommonModule,
    FormsModule,
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
    ReactiveFormsModule,
    MatPaginatorModule,
    MatTableModule,
    LeadRequestResponseRouterModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [lrrService],
})
export class LeadRequestResponseModule {}
