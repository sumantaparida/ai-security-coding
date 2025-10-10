import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComplaintComponent } from './home-complaint/home-complaint.component';
import { ViewComplaintComponent } from './view-complaint/view-complaint.component';

const routes: Routes = [
  { path: 'view-complaint', component: ViewComplaintComponent },
  { path: 'register-complaint', component: HomeComplaintComponent },
  { path: 'register-complaint/:appNo', component: HomeComplaintComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComplaintsRoutingModule { }
