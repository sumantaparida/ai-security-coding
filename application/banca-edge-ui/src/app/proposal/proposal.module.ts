import { ProposalRoutingModule } from './proposal-routing.module';
import { ProposalService } from './services/proposal.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

// translate
import { TranslateModule } from '@ngx-translate/core';

// material
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { MatDialogModule } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ProposalComponent } from './proposal.component';
import { InsuredComponent } from './components/insured/insured.component';
import { SharedModule } from '@app/shared/shared.module';
import { AddOnCoversComponent } from './components/add-on-covers/add-on-covers.component';
import { ConsentModalComponent } from './components/consent-modal/consent-modal.component';
import { ContanctInfoComponent } from './components/contact-address/contact-info.component';
import { MismatchDialogComponent } from './components/mismatch-dialog/mismatch-dialog.component';
import { OtpModalComponent } from './components/otp-modal/otp-modal.component';
import { PolicyQuestionsComponent } from './components/policy-questions/policy-questions.component';
import { PolicyInformationComponent } from './components/policy-information/policy-information.component';
import { PreviousPolicyComponent } from './components/previous-policy/previous-policy.component';
import { ProposerComponent } from './components/proposer/proposer.component';
import { VehicleDetailsComponent } from './components/vehicle/vehicle-details.component';
import { DisplaySectionPipe } from './pipes/display-section.pipe';
import { RelationshipFilterPipe } from './pipes/relationship-filter.pipe';
import { AccountInfoComponent } from './components/account-info/account-info.component';
import { SuccessComponent } from './components/success/success.component';
import { DisplayNegativeAnswerFollowUpSection } from './pipes/display-medical-question.pipe';
import { GetInsuredName } from './pipes/get-insured-name';
import { GetMembersPipe } from './pipes/get-members.pipe';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MedicalFormModalComponent } from './components/medical-negative-follow-up-form/medical-form-modal.component';
import { ShowEditLinkPipe } from './pipes/show-edit-link.pipe';
import { PaymentOptionModalComponent } from './components/payment-option-modal/payment-option-modal.component';
import { PropertyComponent } from './components/property/property.component';
import { DisplayFormPipe } from './pipes/display-form.pipe';
import { GenralComponent } from './components/genral/genral.component';
import { DisplayFormFieldPipe } from './pipes/display-form-field.pipe';
import { DisplayMedicalSectionPipe } from './pipes/display-medical-section.pipe';
import { MedicalSectionComponent } from './components/medical-section/medical-section.component';
import { GetInsuredMembersPipe } from './pipes/getInsuredMember.pipe';
import { DisplayInsuredNegativeAnswerFollowUpSection } from './pipes/display-insured-member-question.pipe';
import { DisplayInsuredMedicalSectionPipe } from './pipes/display-insured-medical-section.pipe';
import { ShowInsuredEditLinkPipe } from './pipes/show-insured-edit-link.pipe';
import { GoToSummaryDirective } from './directives/go-to-summary.directive';
import { CovidNegativeFollowUpFormComponent } from './components/covid-negative-follow-up-form/covid-negative-follow-up-form.component';
import { MedicalNegativeFollowUpPopupFormComponent } from './components/medical-negative-follow-up-popup-form/medical-negative-follow-up-popup-form.component';
import { OptionValueChangePipe } from './pipes/option-Value-change.pipe';
import { DisplayMedicalFieldPipe } from './pipes/display-medical-field.pipe';

@NgModule({
  declarations: [
    ProposalComponent,
    InsuredComponent,
    ContanctInfoComponent,
    ProposerComponent,
    PolicyQuestionsComponent,
    ConsentModalComponent,
    PolicyInformationComponent,
    VehicleDetailsComponent,
    OtpModalComponent,
    MedicalFormModalComponent,
    PreviousPolicyComponent,
    AddOnCoversComponent,
    AccountInfoComponent,
    MismatchDialogComponent,
    SuccessComponent,
    PaymentOptionModalComponent,
    MedicalSectionComponent,
    CovidNegativeFollowUpFormComponent,
    // pipes
    DisplaySectionPipe,
    DisplayFormPipe,
    RelationshipFilterPipe,
    DisplayNegativeAnswerFollowUpSection,
    GetInsuredName,
    GetMembersPipe,
    ShowEditLinkPipe,
    PropertyComponent,
    GenralComponent,
    DisplayFormFieldPipe,
    DisplayMedicalSectionPipe,
    GetInsuredMembersPipe,
    DisplayInsuredNegativeAnswerFollowUpSection,
    DisplayInsuredMedicalSectionPipe,
    ShowInsuredEditLinkPipe,
    OptionValueChangePipe,
    GoToSummaryDirective,
    DisplayMedicalFieldPipe,
    MedicalNegativeFollowUpPopupFormComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    // material
    MatRadioModule,
    MatSelectModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    FlexLayoutModule,
    MatCardModule,
    MatButtonModule,
    MatBadgeModule,
    MatStepperModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatIconModule,
    MatDialogModule,
    MatSidenavModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatTabsModule,
    NgxMatSelectSearchModule,
    SharedModule,

    // routing
    ProposalRoutingModule,
  ],
  providers: [ProposalService],
})
export class ProposalModule {}
