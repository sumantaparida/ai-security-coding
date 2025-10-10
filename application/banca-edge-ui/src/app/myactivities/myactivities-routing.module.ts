import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyactivitiesComponent } from './myactivities.component';

const routes: Routes = [
    { path: '', component: MyactivitiesComponent, pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MyActivitiesRoutingModule { }
