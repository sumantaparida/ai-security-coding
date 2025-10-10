import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HealthHospitalizationComponent } from './health-hospitalization/health-hospitalization.component';
import { CriticalIllnessComponent } from './critical-illness/critical-illness.component';
import { CarInsuranceComponent } from './car-insurance/car-insurance.component';
import { ReactiveFormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';
import { FormsModule } from '@angular/forms';
import { TravelComponent } from './travel/travel.component';
import { QuoteTravelComponent } from './quote-travel/quote-travel.component';
import { DisplayEditTravelQuoteComponent } from './display-edit-travel-quote/display-edit-travel-quote.component';
import { DisplayResultTravelQuoteComponent } from './display-result-travel-quote/display-result-travel-quote.component';
import { MatExpansionModule } from '@angular/material/expansion';

// translate
import { TranslateModule } from '@ngx-translate/core';

// material
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { QuoteRoutingModule } from './quote-routing.module';
import { MatInputModule } from '@angular/material/input';
import { SavingTraditionalComponent } from './saving-traditional/saving-traditional.component';
import { ProtectionComponent } from './protection/protection.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { HealthAddInsurerComponent } from './health-add-insurer/health-add-insurer.component';
import { MatDialogModule } from '@angular/material/dialog';
import { QuoteHealthHospitalisationComponent } from './quote-health-hospitalisation/quote-health-hospitalisation.component';
import { MoreDetailsHealthComponent } from './more-details-health/more-details-health.component';
import { QuoteService } from './quote.service';
import { MotorInsuranceComponent } from './motor-insurance/motor-insurance.component';
import { QuoteMotorInsuranceComponent } from './quote-motor-insurance/quote-motor-insurance.component';
import { EditMotorQuoteComponent } from './edit-motor-quote/edit-motor-quote.component';
import { MoreDetailMotorComponent } from './more-detail-motor/more-detail-motor.component';
import { DisplayEditQuoteComponent } from './display-edit-quote/display-edit-quote.component';
import { DisplayResultQuoteComponent } from './display-result-quote/display-result-quote.component';
import { OfflinePurchaseComponent } from './offline-purchase/offline-purchase.component';
import { DisplayEditMotorQuoteComponent } from './display-edit-motor-quote/display-edit-motor-quote.component';
import { DisplayResultMotorQuoteComponent } from './display-result-motor-quote/display-result-motor-quote.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { SearchDropDownPipe } from './searchDropDownPipe';
import { QuoteLifeInsuranceComponent } from './quote-life-insurance/quote-life-insurance.component';
import { DisplayEditLifeQuoteComponent } from './display-edit-life-quote/display-edit-life-quote.component';
import { DisplayResultLifeQuoteComponent } from './display-result-life-quote/display-result-life-quote.component';
import { MoreDetailLifeComponent } from './more-detail-life/more-detail-life.component';
import { MatSliderModule } from '@angular/material/slider';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { OfflineMotorPurchaseComponent } from './offline-motor-purchase/offline-motor-purchase.component';
import { BankB2cComponent } from './bank-b2c/bank-b2c.component';
import { OfflineProtectionPurchaseComponent } from './offline-protection-purchase/offline-protection-purchase.component';
import { OfflineChildplanPurchaseComponent } from './offline-childplan-purchase/offline-childplan-purchase.component';
import { OfflineLifePurchaseComponent } from './offline-life-purchase/offline-life-purchase.component';
import { LifeProtectionComponent } from './life-protection/life-protection.component';
import { QuoteLifeProtectionComponent } from './quote-life-protection/quote-life-protection.component';
import { DisplayEditProtectionQuoteComponent } from './display-edit-protection-quote/display-edit-protection-quote.component';
import { DisplayResultProtectionQuoteComponent } from './display-result-protection-quote/display-result-protection-quote.component';
import { MoreDetailProtectionComponent } from './more-detail-protection/more-detail-protection.component';
import { ChildPlanComponent } from './child-plan/child-plan.component';
import { QuoteChildPlanComponent } from './quote-child-plan/quote-child-plan.component';
import { DisplayEditChildPlanQuoteComponent } from './display-edit-child-plan-quote/display-edit-child-plan-quote.component';
import { DisplayResultChildPlanQuoteComponent } from './display-result-child-plan-quote/display-result-child-plan-quote.component';
import { MoreDetailChildPlanComponent } from './more-detail-child-plan/more-detail-child-plan.component';
import { ConvertToWordPipe } from './convert-to-word.pipe';
import { CurrencyPipe } from '@angular/common';
import { QrCodeModalComponent } from './qr-code-modal/qr-code-modal.component';
import { SelectCustomerModalComponent } from './select-customer-modal/select-customer-modal.component';
import { GenerateQuoteComponent } from './generate-quote/generate-quote.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { QuoteLayoutComponent } from './generate-quote/quote-layout/quote-layout.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DisplayQuestionPipe } from './generate-quote/pipes/display-question.pipe';
import { AddFormControlPipe } from './generate-quote/pipes/add-formControl.pipe';
import { QuoteResultComponent } from './quote-result/quote-result.component';
import { QuoteEditComponent } from './quote-edit/quote-edit.component';
import { QuoteDisplayComponent } from './quote-display/quote-display.component';
import { QuoteMoreDetailsComponent } from './quote-more-details/quote-more-details.component';
import { SharedModule } from '@app/shared/shared.module';
import { ShopKeeperComponent } from './shop-keeper/shop-keeper.component';
import { QuoteThroughQrComponent } from './quote-through-qr/quote-through-qr.component';
import { AnnuityComponent } from './annuity/annuity.component';
import { QuoteAnnuityComponent } from './quote-annuity/quote-annuity.component';
import { DisplayEditAnnuityComponent } from './display-edit-annuity/display-edit-annuity.component';
import { DisplayResultAnnuityComponent } from './display-result-annuity/display-result-annuity.component';
import { MoreDetailAnnuityComponent } from './more-detail-annuity/more-detail-annuity.component';
import { UnitLinkComponent } from './unit-link/unit-link.component';
import { QuoteCriticalIllnessComponent } from './quote-critical-illness/quote-critical-illness.component';
import { DisplayEditCiComponent } from './display-edit-ci/display-edit-ci.component';
import { DisplayResultCiComponent } from './display-result-ci/display-result-ci.component';
import { QuoteUnitLinkedComponent } from './quote-unit-linked/quote-unit-linked.component';
import { DisplayEditUnitLinkedComponent } from './display-edit-unit-linked/display-edit-unit-linked.component';
import { DisplayResultUnitLinkedComponent } from './display-result-unit-linked/display-result-unit-linked.component';
import { CkycModalComponent } from './ckyc-modal/ckyc-modal.component';
import { MintoproCkycModalComponent } from './mintopro-ckyc-modal/mintopro-ckyc-modal.component';
import { DynamicquoteComponent } from './dynamic-quote/dynamicquote.component';
import { BNCAFieldModule } from '@app/_field_component/bnca-fields.module';
import { DisplayQuoteResultComponent } from './display-quote-result/display-quote-result.component';
import { ShowQuoteDetailsMB } from './display-quote-result/show-details/show-quote-details-mb.component';
import { QuoteModalComponent } from './display-quote-result/quote-modal-component/quote-modal.component';
import { PolicyOptionsComponent } from './display-quote-result/policy-options/policy-options.component';


@NgModule({
  declarations: [
    HealthHospitalizationComponent,
    CriticalIllnessComponent,
    CarInsuranceComponent,
    SavingTraditionalComponent,
    ProtectionComponent,
    HealthAddInsurerComponent,
    QuoteHealthHospitalisationComponent,
    MoreDetailsHealthComponent,
    MotorInsuranceComponent,
    QuoteMotorInsuranceComponent,
    EditMotorQuoteComponent,
    MoreDetailMotorComponent,
    DisplayEditMotorQuoteComponent,
    ShowQuoteDetailsMB,
    DisplayResultMotorQuoteComponent,
    DisplayEditQuoteComponent,
    DisplayResultQuoteComponent,
    QuoteLifeInsuranceComponent,
    DisplayEditLifeQuoteComponent,
    DisplayResultLifeQuoteComponent,
    MoreDetailLifeComponent,
    OfflinePurchaseComponent,
    OfflineMotorPurchaseComponent,
    OfflineProtectionPurchaseComponent,
    OfflineChildplanPurchaseComponent,
    OfflineLifePurchaseComponent,
    BankB2cComponent,
    LifeProtectionComponent,
    QuoteLifeProtectionComponent,
    DisplayEditProtectionQuoteComponent,
    DisplayResultProtectionQuoteComponent,
    MoreDetailProtectionComponent,
    ChildPlanComponent,
    QuoteChildPlanComponent,
    DisplayEditChildPlanQuoteComponent,
    DisplayResultChildPlanQuoteComponent,
    MoreDetailChildPlanComponent,
    ConvertToWordPipe,
    QrCodeModalComponent,
    SelectCustomerModalComponent,
    GenerateQuoteComponent,
    TravelComponent,
    QuoteLayoutComponent,
    DisplayQuestionPipe,
    AddFormControlPipe,
    QuoteResultComponent,
    QuoteEditComponent,
    QuoteDisplayComponent,
    QuoteMoreDetailsComponent,
    QuoteTravelComponent,
    DisplayEditTravelQuoteComponent,
    DisplayResultTravelQuoteComponent,
    ShopKeeperComponent,
    QuoteThroughQrComponent,
    AnnuityComponent,
    QuoteAnnuityComponent,
    DisplayEditAnnuityComponent,
    DisplayResultAnnuityComponent,
    MoreDetailAnnuityComponent,
    UnitLinkComponent,
    QuoteCriticalIllnessComponent,
    DisplayEditCiComponent,
    DisplayResultCiComponent,
    QuoteUnitLinkedComponent,
    DisplayEditUnitLinkedComponent,
    DisplayResultUnitLinkedComponent,
    CkycModalComponent,
    MintoproCkycModalComponent,
    DynamicquoteComponent,
    DisplayQuoteResultComponent,
    QuoteModalComponent,
    PolicyOptionsComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    NgxSpinnerModule,
    BNCAFieldModule,
    // routing
    QuoteRoutingModule,

    // material
    MatRadioModule,
    MatIconModule,
    MatSelectModule,
    MatExpansionModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    FlexLayoutModule,
    MatCardModule,
    MatButtonModule,
    MatBadgeModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSliderModule,
    NgxMatSelectSearchModule,
    QRCodeModule,
    NgxSliderModule,
    SharedModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [QuoteService, CurrencyPipe],

  entryComponents: [HealthAddInsurerComponent],
})
export class QuoteModule {}
