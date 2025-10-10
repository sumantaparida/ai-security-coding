import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MisReportComponent } from './components/mis-report/mis-report.component';

const routes: Routes = [{ path: 'mis-report', component: MisReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
