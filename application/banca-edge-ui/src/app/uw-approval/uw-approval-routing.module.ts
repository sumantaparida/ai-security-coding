import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UwApprovalComponent } from '@app/uw-approval/uw-approval.component';
import { UwDecissionComponent } from './uw-decission/uw-decission.component';


const routes: Routes = [
    { path: '', component: UwApprovalComponent },
    { path: 'decision/:appNo', component: UwDecissionComponent },


];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UwRoutingModule { }
