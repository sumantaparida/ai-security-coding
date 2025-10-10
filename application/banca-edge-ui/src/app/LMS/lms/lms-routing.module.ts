import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewApplicationComponent } from '../components/new-application/new-application.component';
import { LmsComponent } from './lms.component';

const routes: Routes = [
  { path: '', component: LmsComponent },
  { path: 'new-application/:customerId/:journey', component: NewApplicationComponent },
  { path: 'new-application/:customerId/:journey/:isLife', component: NewApplicationComponent },

  { path: 'new-application/:appNo', component: NewApplicationComponent },
  { path: 'new-application/:lob/:customerId/:productType', component: NewApplicationComponent },
  { path: 'consent/:sibConsent/:appNo', component: NewApplicationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LmsRoutingModule {}
