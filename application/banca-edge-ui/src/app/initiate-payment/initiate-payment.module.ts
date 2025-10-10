import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from '@app/shared/shared.module';
import { InitiatePaymentRoutingModule } from './initiate-payment-routing.module';
import { InitiatePaymentComponent } from './initiate-payment.component';
import { DisplayInputFieldPipe } from './pipes/form-field.pipe';

@NgModule({
    declarations: [
        InitiatePaymentComponent,
        DisplayInputFieldPipe,

    ],
    imports: [
        SharedModule,
        MatCardModule,
        MatRadioModule,
        CommonModule,
        ReactiveFormsModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        InitiatePaymentRoutingModule,
        FlexLayoutModule,
        MatButtonModule,
        MatCheckboxModule
    ]
})
export class InitiatePaymentModule { }