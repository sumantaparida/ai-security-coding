import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DcbNeedAnalysisComponent } from './dcb-need-analysis/dcb-need-analysis.component';
import { HomeComponent } from './home/home.component';
import { SummaryComponent } from './summary/summary.component';
import { ViewPlanComponent } from './view-plan/view-plan.component';

const routes: Routes = [
  // { path: 'complaints', loadChildren: './complaints/complaints.module#ComplaintsModule'},
  // { path: 'view-complaints', component: ViewComplaintsComponent, canActivate: [AuthGuard] },
  // { path: 'login', component: LoginComponent, },

  // { path: 'login', component: LoginComponent },

  { path: 'home', component: HomeComponent },
  { path: 'dcb', component: DcbNeedAnalysisComponent },
  { path: 'home/:customerId/:lobType', component: HomeComponent },
  { path: 'dcb/:customerId', component: DcbNeedAnalysisComponent },
  { path: 'summary', component: SummaryComponent },
  { path: 'summary/:customerId/:lobType', component: SummaryComponent },
  { path: 'view-plan', component: ViewPlanComponent },
  { path: 'view-plan/:customerId', component: ViewPlanComponent },
  //  { path: '',
  //   redirectTo: '',
  //   pathMatch: 'full'
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NeedAnalysisRoutingModule {}
