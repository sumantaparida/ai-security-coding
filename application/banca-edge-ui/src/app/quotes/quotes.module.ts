import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuotesComponent } from './quotes.component';
import { NewQuotesRoutingModule } from './new-quotes-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';

//material
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { QuoteDescriptionVideoComponent } from './components/quote-description-video/quote-description-video.component';
import { QuoteMemberSelectionComponent } from './components/quote-member-selection/quote-member-selection.component';
import { QuoteMemberDetailsComponent } from './components/quote-member-details/quote-member-details.component';
import { QuoteMemberAddressComponent } from './components/quote-member-address/quote-member-address.component';
import { MatStepperModule } from '@angular/material/stepper';

import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { QuotesService } from './services/quotes.service';
import { MatIconModule } from '@angular/material/icon';






@NgModule({
  declarations: [QuotesComponent, QuoteDescriptionVideoComponent, QuoteMemberSelectionComponent, QuoteMemberDetailsComponent, QuoteMemberAddressComponent],
  imports: [
    CommonModule,
    NewQuotesRoutingModule,

    //material
    FlexLayoutModule,
    MatButtonToggleModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule
  ],
  providers: [QuotesService]
})
export class QuotesModule { }
