import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ChangePasswordComponent } from './change-password.component';
import { LayoutComponent } from './layout.component';
import { AlertModule } from '@app/_components/alert.module';
import { ChangePasswordRoutingModule } from './change-password-routing.module';

@NgModule({
  declarations: [LayoutComponent, ChangePasswordComponent],
  imports: [
    CommonModule,
    FormsModule,
        ReactiveFormsModule,
    MatCardModule, 
 MatFormFieldModule,
 MatInputModule,
    MatButtonModule,
    ChangePasswordRoutingModule,
    AlertModule
  ],
  exports:[ChangePasswordComponent]
})
export class ChangePasswordModule { }
