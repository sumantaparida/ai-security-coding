import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentApprovalComponent } from './payment-approval.component';
import { ViewApprovalApplicationComponent } from './view-approval-application/view-approval-application.component';

const routes: Routes = [
    { path: '', component: PaymentApprovalComponent, pathMatch: 'full' },
    { path:'view-approval-application/:appNo/:cisApp',component: ViewApprovalApplicationComponent ,}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PaymentApprovalRoutingModule { }
