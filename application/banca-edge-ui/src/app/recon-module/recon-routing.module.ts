import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReconComponent } from './recon/recon.component';

const routes: Routes = [{ path: '', component: ReconComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReconRoutingModule {}
