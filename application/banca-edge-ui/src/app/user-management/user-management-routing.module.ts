import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddMasterComponent } from './components/add-master/add-master.component';
import { ViewUserComponent } from './components/view-user/view-user.component';
import { AddOrEditUserComponent } from './components/add-or-edit-user/add-or-edit-user.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { ViewMasterComponent } from './view-master/view-master.component';


const routes: Routes = [
  {
    path: '',
    component: ViewUserComponent,
  },
  {
    path: "add-user",
    component: AddOrEditUserComponent,
  },
  {
    path: "edit-user/:username",
    component: AddOrEditUserComponent,
  },
  {
    path: 'add-master',
    component: AddMasterComponent,
  },
  {
    path: 'add-master/:masterType/:id',
    component: AddMasterComponent,
  },
  {
    path: "edit-master/:product",
    component: AddMasterComponent,
  },
  {
    path: "view-master",
    component: ViewMasterComponent,
  },
  {
    path: 'file-upload',
    component: FileUploadComponent,
  },
  {
    path: 'file-upload/:type',
    component: FileUploadComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule { }
