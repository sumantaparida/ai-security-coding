import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InitiatePaymentComponent } from './initiate-payment.component';

const routes: Routes = [
    { path: '', component: InitiatePaymentComponent, pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InitiatePaymentRoutingModule { }
