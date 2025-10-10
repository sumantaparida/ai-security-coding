import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LrrComponent } from './lrr/lrr.component';

const routes: Routes = [{ path: '', component: LrrComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeadRequestResponseRouterModule {}
