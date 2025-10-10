import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeadQuotesComponent } from './components/lead-quotes/lead-quotes.component';
import { LeadManagementRoutingModule } from './lead-management-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { appInitializerFactory, AppModule } from '@app/app.module';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { PaginatorIntlService } from '@app/_services';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SelectInsurerModelComponent } from './components/select-insurer-model/select-insurer-model.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ViewLeadsComponent } from './components/view-leads/view-leads.component';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { LeadStatusModelComponent } from './components/lead-status-model/lead-status-model.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  declarations: [
    LeadQuotesComponent,
    SelectInsurerModelComponent,
    ViewLeadsComponent,
    LeadStatusModelComponent,
  ],
  imports: [
    CommonModule,
    LeadManagementRoutingModule,
    ReactiveFormsModule,
    TranslateModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    FlexLayoutModule,
    MatBadgeModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatMenuModule,
    MatDatepickerModule,
    SharedModule,
  ],
  exports: [],
  providers: [TranslateService],
})
export class LeadManagementModule {}
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
