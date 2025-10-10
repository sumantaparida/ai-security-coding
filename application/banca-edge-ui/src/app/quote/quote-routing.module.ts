import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CriticalIllnessComponent } from './critical-illness/critical-illness.component';
import { HealthHospitalizationComponent } from './health-hospitalization/health-hospitalization.component';
import { CarInsuranceComponent } from './car-insurance/car-insurance.component';
import { SavingTraditionalComponent } from './saving-traditional/saving-traditional.component';
import { ProtectionComponent } from './protection/protection.component';
import { QuoteHealthHospitalisationComponent } from './quote-health-hospitalisation/quote-health-hospitalisation.component';
import { OfflinePurchaseComponent } from './offline-purchase/offline-purchase.component';
import { OfflineMotorPurchaseComponent } from './offline-motor-purchase/offline-motor-purchase.component';
import { OfflineProtectionPurchaseComponent } from './offline-protection-purchase/offline-protection-purchase.component';
import { MotorInsuranceComponent } from './motor-insurance/motor-insurance.component';
import { QuoteMotorInsuranceComponent } from './quote-motor-insurance/quote-motor-insurance.component';
import { QuoteLifeInsuranceComponent } from './quote-life-insurance/quote-life-insurance.component';
import { LifeProtectionComponent } from './life-protection/life-protection.component';
import { QuoteLifeProtectionComponent } from './quote-life-protection/quote-life-protection.component';
import { ChildPlanComponent } from './child-plan/child-plan.component';
import { QuoteChildPlanComponent } from './quote-child-plan/quote-child-plan.component';
import { OfflineChildplanPurchaseComponent } from './offline-childplan-purchase/offline-childplan-purchase.component';
import { OfflineLifePurchaseComponent } from './offline-life-purchase/offline-life-purchase.component';
import { GenerateQuoteComponent } from './generate-quote/generate-quote.component';
import { TravelComponent } from './travel/travel.component';
import { QuoteResultComponent } from './quote-result/quote-result.component';
import { QuoteTravelComponent } from './quote-travel/quote-travel.component';
import { ShopKeeperComponent } from './shop-keeper/shop-keeper.component';
import { QuoteThroughQrComponent } from './quote-through-qr/quote-through-qr.component';
// import { BankB2cComponent } from './bank-b2c/bank-b2c.component';
import { AnnuityComponent } from './annuity/annuity.component';
import { QuoteAnnuityComponent } from './quote-annuity/quote-annuity.component';
import { UnitLinkComponent } from './unit-link/unit-link.component';
import { QuoteCriticalIllnessComponent } from './quote-critical-illness/quote-critical-illness.component';
import { QuoteUnitLinkedComponent } from './quote-unit-linked/quote-unit-linked.component';
import { DynamicquoteComponent } from './dynamic-quote/dynamicquote.component';
import { DisplayQuoteResultComponent } from './display-quote-result/display-quote-result.component';

const routes: Routes = [
  { path: 'health-details', component: HealthHospitalizationComponent },
  { path: 'health-details/:quoteId', component: HealthHospitalizationComponent },
  { path: 'health-details/:customerId/:leadId', component: HealthHospitalizationComponent },
  { path: 'health-detail/:customerId', component: HealthHospitalizationComponent },
  { path: 'personal-accident', component: HealthHospitalizationComponent },
  { path: 'personal-accident/:quoteId', component: HealthHospitalizationComponent },
  { path: 'personal-accident/:customerId/:leadId', component: HealthHospitalizationComponent },
  { path: 'pa-insurance/:customerId', component: HealthHospitalizationComponent },
  { path: 'critical-illness', component: CriticalIllnessComponent },
  { path: 'ci/:customerId', component: CriticalIllnessComponent },
  { path: 'critical-ill/:quoteId', component: CriticalIllnessComponent },
  { path: 'car-insurance', component: CarInsuranceComponent },
  { path: 'saving-traditonal', component: SavingTraditionalComponent },
  { path: 'saving-traditonal/:quoteId', component: SavingTraditionalComponent },
  { path: 'saving-traditonal/:customerId/:leadId', component: SavingTraditionalComponent },
  { path: 'saving-traditionals/:customerId', component: SavingTraditionalComponent },
  { path: 'protection', component: ProtectionComponent },
  { path: 'quote-health', component: QuoteHealthHospitalisationComponent },
  { path: 'quote-health/:quoteId', component: QuoteHealthHospitalisationComponent },
  { path: 'quote-ci', component: QuoteCriticalIllnessComponent },
  { path: 'quote-ci/:quoteId', component: QuoteCriticalIllnessComponent },
  { path: 'quote-unit-link', component: QuoteUnitLinkedComponent },
  { path: 'quote-unit-link/:quoteId', component: QuoteUnitLinkedComponent },
  { path: 'quote-result', component: QuoteResultComponent },
  { path: 'quote-result/:quoteId', component: QuoteResultComponent },
  { path: 'offline-purchase/:appNo', component: OfflinePurchaseComponent },
  { path: 'offline-motor-purchase/:appNo', component: OfflineMotorPurchaseComponent },
  { path: 'offline-protection-purchase/:appNo', component: OfflineProtectionPurchaseComponent },
  { path: 'offline-childplan-purchase/:appNo', component: OfflineChildplanPurchaseComponent },
  { path: 'offline-life-purchase/:appNo', component: OfflineLifePurchaseComponent },
  { path: 'motor-insurance', component: MotorInsuranceComponent },
  { path: 'motor-insurance/:quoteId', component: MotorInsuranceComponent },
  { path: 'motor-insurance/:customerId/:leadId', component: MotorInsuranceComponent },
  // { path: 'motor/:customerId', component: MotorInsuranceComponent },
  { path: 'motor/:customerId', component: DynamicquoteComponent },
  { path: 'motor/:customerId/:quoteId', component: DynamicquoteComponent },
  { path: 'quote-motor-insurance', component: QuoteMotorInsuranceComponent },
  { path: 'quote-motor-insurance/:quoteId', component: QuoteMotorInsuranceComponent },
  { path: 'display-quote-result/:customerId/:quoteId', component: DisplayQuoteResultComponent },
  { path: 'quote-life-insurance', component: QuoteLifeInsuranceComponent },
  { path: 'quote-life-insurance/:quoteId', component: QuoteLifeInsuranceComponent },
  { path: 'life-protection/:customerId/:leadId', component: LifeProtectionComponent },
  { path: 'life-protections/:customerId', component: LifeProtectionComponent },
  { path: 'life-protection', component: LifeProtectionComponent },
  { path: 'life-protection/:quoteId', component: LifeProtectionComponent },
  { path: 'quote-life-protection', component: QuoteLifeProtectionComponent },
  { path: 'quote-life-protection/:quoteId', component: QuoteLifeProtectionComponent },
  { path: 'child-plan', component: ChildPlanComponent },
  { path: 'child-plan/:quoteId', component: ChildPlanComponent },
  { path: 'children-plan/:customerId', component: ChildPlanComponent },
  { path: 'quote-child-plan', component: QuoteChildPlanComponent },
  { path: 'quote-child-plan/:quoteId', component: QuoteChildPlanComponent },
  { path: 'unit-link', component: UnitLinkComponent },
  { path: 'unit-link/:quoteId', component: UnitLinkComponent },
  { path: 'unit-linked/:customerId', component: UnitLinkComponent },
  { path: 'generate-quote', component: GenerateQuoteComponent },
  { path: 'generate-quotes/:customerId', component: GenerateQuoteComponent },
  { path: 'generate-quote/:quoteId', component: GenerateQuoteComponent },
  { path: 'generate-quote/:customerId/:leadId', component: GenerateQuoteComponent },
  { path: 'travel-details', component: TravelComponent },
  { path: 'travel-details/:quoteId', component: TravelComponent },
  { path: 'travel-details/:customerId/:leadId', component: TravelComponent },
  { path: 'travel-detail/:customerId', component: TravelComponent },
  { path: 'quote-travel', component: QuoteTravelComponent },
  { path: 'quote-travel/:quoteId', component: QuoteTravelComponent },
  { path: 'shop-keeper', component: ShopKeeperComponent },
  { path: 'shop-keeper/:customerId', component: ShopKeeperComponent },
  { path: 'shop-keepers/:quoteId', component: ShopKeeperComponent },
  { path: 'annuity', component: AnnuityComponent },
  { path: 'annuity/:quoteId', component: AnnuityComponent },
  { path: 'annuity/:customerId/:leadId', component: AnnuityComponent },
  { path: 'annuiti/:customerId', component: AnnuityComponent },
  { path: 'quote-annuity', component: QuoteAnnuityComponent },
  { path: 'quote-annuity/:quoteId', component: QuoteAnnuityComponent },
  { path: ':cifNo/:productId', component: QuoteThroughQrComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuoteRoutingModule {}
