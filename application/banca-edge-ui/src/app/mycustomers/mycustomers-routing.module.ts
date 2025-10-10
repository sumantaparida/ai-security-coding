import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './components/layout/layout.component';
import { MycustomersComponent } from './mycustomers.component';
import { BusinessFeatureComponent } from './components/business-feature/business-feature.component';
import { IndividualFeatureComponent } from './components/individual-feature/individual-feature.component';
import { EditIndividualCustomerComponent } from './components/edit-individual-customer/edit-individual-customer.component';
import { EditBusinessCustomerComponent } from './components/edit-business-customer/edit-business-customer.component';

import { RoleGuard } from '@app/_helpers';

const routes: Routes = [

    // path: '', component: LayoutComponent,
    { path: '', component: MycustomersComponent },
    // { path: 'mycustomers/:primaryMobileNo', component: MycustomersComponent },
    { path: 'addindividualcustomer', component: IndividualFeatureComponent, canActivate: [RoleGuard], data: { roles: ['CUSTOMER.CREATE', 'ZONE.CUSTOMER.CREATE', 'BRANCH.CUSTOMER.CREATE'] } },
    { path: 'addbusinesscustomer', component: BusinessFeatureComponent, canActivate: [RoleGuard], data: { roles: ['CUSTOMER.CREATE', 'ZONE.CUSTOMER.CREATE', 'BRANCH.CUSTOMER.CREATE'] } },
    {
        path: 'addindividualcustomer/:cif', component: IndividualFeatureComponent, canActivate: [RoleGuard],
        data: { roles: ['CUSTOMER.CREATE', 'ZONE.CUSTOMER.CREATE', 'BRANCH.CUSTOMER.CREATE'] }
    },
    { path: 'addbusinesscustomer/:cif', component: BusinessFeatureComponent, canActivate: [RoleGuard], data: { roles: ['CUSTOMER.CREATE', 'ZONE.CUSTOMER.CREATE', 'BRANCH.CUSTOMER.CREATE'] } },
    { path: ':CID/editindividualcustomer', component: EditIndividualCustomerComponent, canActivate: [RoleGuard], data: { roles: ['BRANCH.CUSTOMER.EDIT', 'ZONE.CUSTOMER.EDIT'] } },
    { path: ':CID/editbusinesscustomer', component: EditBusinessCustomerComponent, canActivate: [RoleGuard], data: { roles: ['BRANCH.CUSTOMER.EDIT', 'ZONE.CUSTOMER.EDIT'] } },
    // children: [
    // { path: 'mycustomers/:quoteId', component: MycustomersComponent, outlet: 'myCustomersOutlet' }

    // ]
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MycustomersRoutingModule { }
