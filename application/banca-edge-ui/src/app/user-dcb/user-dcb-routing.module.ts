import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserDcbComponent } from './user-dcb.component';
import { UserDcbsComponent } from './user-dcb/user-dcb.component';

const routes: Routes = [
  { path: '', component: UserDcbComponent },
  { path: 'user', component: UserDcbsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
