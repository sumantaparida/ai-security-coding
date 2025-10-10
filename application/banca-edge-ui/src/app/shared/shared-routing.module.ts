import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { HelpPageComponent } from './components/help-page/help-page.component';
import { PospComponent } from './components/posp/posp.component';
import { RoleGuard, AuthGuard } from '@app/_helpers';

const routes: Routes = [
  { path: 'error-page', component: ErrorPageComponent },
  { path: 'help', component: HelpPageComponent },
  {
    path: 'posp',
    component: PospComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SharedRoutingModule {}
