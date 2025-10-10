import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewApplicationComponent } from './components/new-application/new-application.component';
import { OfflinePoliciesComponent } from './offline-policies.component';

const routes: Routes = [
  { path: '', component: OfflinePoliciesComponent },
  { path: 'new-application/:customerId', component: NewApplicationComponent },
  { path: 'new-application/:appNo/:customerId', component: NewApplicationComponent },
  { path: 'new-application/:lob/:customerId/:productType', component: NewApplicationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfflinePoliciesRoutingModule {}
