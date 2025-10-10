import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeadQuotesComponent } from './components/lead-quotes/lead-quotes.component';
import { ViewLeadsComponent } from './components/view-leads/view-leads.component';


const routes: Routes = [
    { path: ':CIF/lead-quotes', component: LeadQuotesComponent },
    { path: 'viewleads', component: ViewLeadsComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LeadManagementRoutingModule { }
