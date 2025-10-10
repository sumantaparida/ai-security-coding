import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from '@app/shared/shared.module';
import { PaymentApprovalRoutingModule } from './payment-approval-routing.module';
import { PaymentApprovalComponent } from './payment-approval.component';
import { ViewApprovalApplicationComponent } from './view-approval-application/view-approval-application.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { MatButtonModule } from '@angular/material/button';
import { GetAlternateValue } from './pipes/getVal.pipe';
import { DisplaySectionPipe } from './pipes/displaySection.pipe';

@NgModule({
    declarations: [
        PaymentApprovalComponent,
        ViewApprovalApplicationComponent,
        GetAlternateValue,
        DisplaySectionPipe
    ],
    imports: [
        CommonModule,
        PaymentApprovalRoutingModule,
        MatTableModule,
        MatExpansionModule,
        MatPaginatorModule,
        SharedModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        CdkAccordionModule,
    ]
})
export class PaymentApprovalModule { }
