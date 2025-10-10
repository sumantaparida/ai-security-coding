import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PolicyConcentGuard } from '@app/_helpers/policy-concent.guard';
import { ProposalComponent } from './proposal.component';

const routes: Routes = [
  { path: ':productId/:appNo/:formType', component: ProposalComponent },
  { path: ':token', component: ProposalComponent, canActivate: [PolicyConcentGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProposalRoutingModule {}
