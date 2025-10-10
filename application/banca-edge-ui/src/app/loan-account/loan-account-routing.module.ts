import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddLoanDetailsComponent } from './components/add-loan-details/add-loan-details.component';
import { EditLoanDetailsComponent } from './components/edit-loan-details/edit-loan-details.component';
import { GroupcreditLeadsComponent } from './components/groupcredit-leads/groupcredit-leads.component';
import { LoanSearchComponent } from './components/loan-search/loan-search.component';
import { RecommendInsuranceComponent } from './components/recommend-insurance/recommend-insurance.component';
import { ViewApplicationComponent } from './components/view-application/view-application.component';
import { LoanComponent } from './loan.component';

const routes: Routes = [
  { path: '', component: LoanComponent },
  { path: 'loan-quote/:quoteId', component: RecommendInsuranceComponent },
  { path: 'viewapp', component: ViewApplicationComponent },
  { path: 'loan-search', component: LoanSearchComponent },
  { path: 'add-loan', component: AddLoanDetailsComponent },
  { path: ':inputType/:loanAccountNumber', component: LoanComponent },
  { path: 'leads', component: GroupcreditLeadsComponent },
  { path: 'edit-loan', component: EditLoanDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoanAccountRoutingModule {}
