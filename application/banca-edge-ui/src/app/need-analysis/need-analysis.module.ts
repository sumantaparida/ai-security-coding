import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NeedAnalysisAppComponent } from './need-analysis-app.component';
import { HomeComponent } from './home/home.component';
import { GenderComponent } from './gender/gender.component';
import { AgeComponent } from './age/age.component';
import { MaritalStatusComponent } from './marital-status/marital-status.component';
import { OccupationComponent } from './occupation/occupation.component';
import { SocialLifeComponent } from './social-life/social-life.component';
import { RiskTypeComponent } from './risk-type/risk-type.component';
import { HouseTypeComponent } from './house-type/house-type.component';
import { ValuablesComponent } from './valuables/valuables.component';
import { AnnualIncomeComponent } from './annual-income/annual-income.component';
import { SavingsComponent } from './savings/savings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NeedLoanComponent } from './need-loan/need-loan.component';
import { SummaryComponent } from './summary/summary.component';
import { NeedAnalysisRoutingModule } from './need-analysis-routing.module';
import { UserDataService } from './user-data.service';
import { KidsComponent } from './kids/kids.component';
import { DataDisplayComponent } from './data-display/data-display.component';
// import { HttpClientModule } from '@angular/common/http';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';


// import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule } from '@ngx-translate/core';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatCheckboxModule} from '@angular/material/checkbox';

import { ViewPlanComponent } from './view-plan/view-plan.component';
import { NumberToWordPipe } from './pipes/number-to-word-pipe';

import { MatInputModule } from '@angular/material/input';
import { DcbNeedAnalysisComponent } from './dcb-need-analysis/dcb-need-analysis.component';
import { NewInvestmentPlanComponent } from './new-investment-plan/new-investment-plan.component';

@NgModule({
  declarations: [
    NeedAnalysisAppComponent,
    HomeComponent,
    GenderComponent,
    AgeComponent,
    MaritalStatusComponent,
    OccupationComponent,
    SocialLifeComponent,
    RiskTypeComponent,
    HouseTypeComponent,
    ValuablesComponent,
    AnnualIncomeComponent,
    SavingsComponent,
    NeedLoanComponent,
    SummaryComponent,
    KidsComponent,
    DataDisplayComponent,
    ViewPlanComponent,
    NumberToWordPipe,
    DcbNeedAnalysisComponent,
    NewInvestmentPlanComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NeedAnalysisRoutingModule,
    TranslateModule,

    // material
    MatButtonModule,
    MatSliderModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    FlexLayoutModule,
    MatIconModule,
    HttpClientModule,
    MatCheckboxModule,
  ],
  providers: [UserDataService],
  bootstrap: [NeedAnalysisAppComponent],
})
export class NeedAnalysisModule {}
