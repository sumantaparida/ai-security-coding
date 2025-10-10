import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SpApprovalComponent } from './sp-approval.component';

const routes: Routes = [
    { path: '', component: SpApprovalComponent, pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SpApprovalRoutingModule { }
