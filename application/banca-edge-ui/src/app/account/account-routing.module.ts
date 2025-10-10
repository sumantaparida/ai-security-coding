import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { LoginComponent } from './login.component';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
// import { RegisterCustomerComponent } from './register-customer/register-customer.component';

const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: 'login', component: LoginComponent },
            { path: 'forgotpassword', component: ForgotPasswordComponent }
            // { path: 'registerCustomer', component: RegisterCustomerComponent }


        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AccountRoutingModule { }
