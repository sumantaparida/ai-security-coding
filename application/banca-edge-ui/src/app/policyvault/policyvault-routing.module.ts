import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PolicyVaultComponent } from './policyvault.component';

const routes: Routes = [
    { path: '', component: PolicyVaultComponent, pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PolicyRoutingModule { }
