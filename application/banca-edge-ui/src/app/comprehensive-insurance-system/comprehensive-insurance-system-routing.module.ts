import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CisViewComponent } from './components/cis-view/cis-view.component';
import { ComprehensiveInsuranceSystemComponent } from './comprehensive-insurance-system.component';

const routes: Routes = [
  {
    path: 'application/:customerId/:lob/:productType/:insurerId',
    component: ComprehensiveInsuranceSystemComponent,
  },
  {
    path: 'application/:customerId/:lob/:productType/:insurerId/:cisNumber',
    component: ComprehensiveInsuranceSystemComponent,
  },
  {
    path: ':customerId/:lob/:productType/:insurerId',
    component: ComprehensiveInsuranceSystemComponent,
  },
  {
    path: ':customerId/:lob/:productType/:insurerId/:cisNumber',
    component: ComprehensiveInsuranceSystemComponent,
  },
  {
    path: ':token',
    component: ComprehensiveInsuranceSystemComponent,
  },
  {
    path: '',
    component: CisViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComprehensiveInsuranceSystemRoutingModule { }
