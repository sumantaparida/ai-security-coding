import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeServiceRequestComponent } from './components/home-service-request/home-service-request.component';
import { ViewServiceRequestComponent } from './components/view-service-request/view-service-request.component';

const routes: Routes = [

  { path: 'view-service-request', component: ViewServiceRequestComponent },
  { path: 'register-service-request', component: HomeServiceRequestComponent },
  { path: 'register-service-request/:appNo', component: HomeServiceRequestComponent },

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceRequestRoutingModule { }
