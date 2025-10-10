import { NgModule } from '@angular/core';

import { BncaInputTextComponent } from './bnca-input-text/bnca-input-text.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BncaInputRadioComponent } from './bnca-input-radio/bnca-input-radio.component';
import { CommonModule } from '@angular/common';
import { BncaInputSelectComponent } from './bnca-input-select/bnca-input-select.component';
import { BncaInputErrorComponent } from './banca-input-error/bnca-input-error.component';
import { MatFormFieldModule  } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { BncaInputDateComponent } from './bnca-input-date/bnca-input-date.component';
import { SharedModule } from '@app/shared/shared.module';


// import { RegisterCustomerComponent } from './register-customer/register-customer.component';

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatIconModule,
    SharedModule
  ],
  declarations: [
    BncaInputTextComponent,
    BncaInputRadioComponent,
    BncaInputSelectComponent,
    BncaInputDateComponent,
    BncaInputErrorComponent,
  ],
  providers: [],
  exports:[BncaInputTextComponent,BncaInputRadioComponent,BncaInputSelectComponent,BncaInputDateComponent]
})
export class BNCAFieldModule {}
