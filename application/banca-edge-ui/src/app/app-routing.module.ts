import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './_helpers';
import { RoleGuard } from './_helpers';
// import { IndividualFeatureComponent } from './mycustomers/components/individual-feature/individual-feature.component';
// import { BusinessFeatureComponent } from './mycustomers/components/business-feature/business-feature.component';
import { MydashboardComponent } from './mydashboard/mydashboard.component';
import { QuickquoteComponent } from './quickquote/quickquote.component';
import { MyrenewalsComponent } from './myrenewals/myrenewals.component';
// import { EditIndividualCustomerComponent } from './mycustomers/components/edit-individual-customer/edit-individual-customer.component';
// import { EditBusinessCustomerComponent } from './mycustomers/components/edit-business-customer/edit-business-customer.component';
import { BankB2cComponent } from './bank-b2c/bank-b2c.component';
import { ConfirmationComponent } from './_components/confirmation/confirmation.component';
import { PostPaymentComponent } from './_components/postpayment/postpayment.component';
import { PaymentInfoComponent } from './internal-payment/payment-info.component';
import { BankUserComponent } from './bank-user/bank-user.component';
import { RegisterCustomerComponent } from './_components/register-customer/register-customer.component';
import { LoginGuard } from './_helpers/login.guard';
import { QrLandingPageComponent } from './qr-landing-page/qr-landing-page.component';
import { IssuePolicyComponent } from './_components/issue-policy/issue-policy.component';
import { LmsComponent } from './LMS/lms/lms.component';
import { DcbAdfsComponent } from './dcb-adfs/dcb-adfs.component';
import { CisComponent } from './cis/cis.component';
import { BulkUploadComponent } from './bulk-upload/bulk-upload.component';
import { BulkUploadViewComponent } from './bulk-upload-view/bulk-upload-view.component';
import { SibLandingPageComponent } from './sib-landing-page/sib-landing-page/sib-landing-page.component';
import { NewApplicationComponent } from './LMS/components/new-application/new-application.component';
import { ConsentEndPage } from './account/consent-end-page.component';
import { FileUploadComponent } from './user-management/components/file-upload/file-upload.component';

const accountModule = () => import('./account/account.module').then((x) => x.AccountModule);
const loanModule = () =>
  import('./loan-account/loan-account.module').then((x) => x.LoanAccountModule);
const leadManagementModule = () =>
  import('./lead-management/lead-management.module').then((x) => x.LeadManagementModule);
const uwApprovalModule = () =>
  import('./uw-approval/uw-approval.module').then((x) => x.UwApprovalModule);
const mycustomersModule = () =>
  import('./mycustomers/mycustomers.module').then((x) => x.MycustomersModule);
// const blockerModule = () => import('./blocker/blocker.module').then(x => x.BlockerModule);
const changePasswordModule = () =>
  import('./change-password/change-password.module').then((x) => x.ChangePasswordModule);
const complaintsModule = () =>
  import('../app/complaints/complaints.module').then((x) => x.ComplaintsModule);
const serviceRequestModule = () =>
  import('../app/service-request/service-request.module').then((x) => x.ServiceRequestModule);
const needAnalysisModule = () =>
  import('../app/need-analysis/need-analysis.module').then((x) => x.NeedAnalysisModule);
const quoteModule = () => import('../app/quote/quote.module').then((x) => x.QuoteModule);

const newQuotesModule = () => import('../app/quotes/quotes.module').then((x) => x.QuotesModule);

const proposalModule = () =>
  import('../app/proposal/proposal.module').then((x) => x.ProposalModule);

const cisModule = () =>
  import('../app/comprehensive-insurance-system/comprehensive-insurance-system.module').then(
    (x) => x.ComprehensiveInsuranceSystemModule,
  );

const userModule = () =>
  import('../app/user-management/user-management.module').then((x) => x.UserManagementModule);

const paymentApprovalModule = () =>
  import('../app/payment-approval/payment-approval.module').then((x) => x.PaymentApprovalModule);

const sharedModule = () => import('../app/shared/shared.module').then((x) => x.SharedModule);

const initiatePaymentModule = () =>
  import('../app/initiate-payment/initiate-payment.module').then((x) => x.InitiatePaymentModule);

const spApprovalModule = () =>
  import('../app/sp-approval/sp-approval.module').then((x) => x.SpApprovalModule);

const myActivitiesModule = () =>
  import('../app/myactivities/myactivities.module').then((x) => x.MyActivitiesModule);

const policyVaultModule = () =>
  import('../app/policyvault/policyvault.module').then((x) => x.PolicyVaultModule);

const offlinePoliciesModule = () =>
  import('../app/offline-policies/offline-policies.module').then((x) => x.OfflinePoliciesModule);

const lmsModule = () => import('../app/LMS/lms/lms.module').then((x) => x.LmsModule);

const reportsModule = () => import('../app/reports/reports.module').then((x) => x.ReportsModule);

const reconModule = () => import('./recon-module/recon.module').then((x) => x.ReconModule);

const userDcbModule = () => import('../app/user-dcb/user-dcb.module').then((x) => x.UserDcbModule);

const leadRrModule = () =>
  import('../app/lead-request-response/lead-request-response.module').then(
    (x) => x.LeadRequestResponseModule,
  );

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: 'mycustomers', pathMatch: 'full' },
      { path: 'account', loadChildren: accountModule, canActivate: [LoginGuard] },
      // {
      //   path: 'mycomplaints',
      //   loadChildren: complaintsModule,
      //   canActivate: [AuthGuard, RoleGuard],
      //   data: {
      //     roles: ['BRANCH.COMPLAINT.CREATE', 'CUSTOMER.COMPLAINT.CREATE'],
      //   },
      // },
      {
        path: 'myrequest',
        loadChildren: serviceRequestModule,
        canActivate: [AuthGuard, RoleGuard],
        data: {
          roles: ['BRANCH.SR.VIEW', 'CUSTOMER.SR.VIEW', 'INSURER.SR.VIEW'],
        },
      },
      {
        path: 'needanalysis',
        loadChildren: needAnalysisModule,
        canActivate: [AuthGuard],
      },
      {
        path: 'quote',
        loadChildren: quoteModule,
        canActivate: [RoleGuard, AuthGuard],
        data: { roles: ['BRANCH.QUOTE.CREATE', 'CUSTOMER.QUOTE.CREATE', 'INSURER.QUOTE.CREATE'] },
      },
      {
        path: 'quotes',
        loadChildren: newQuotesModule,
        canActivate: [RoleGuard, AuthGuard],
        data: { roles: ['BRANCH.QUOTE.CREATE', 'CUSTOMER.QUOTE.CREATE'] },
      },
      {
        path: 'proposal',
        loadChildren: proposalModule,
        canActivate: [AuthGuard, RoleGuard],
        data: {
          roles: [
            'BRANCH.POLICY.CREATE',
            'CUSTOMER.POLICY.CREATE',
            'INSURER.POLICY.CREATE',
            'INSURER.POLICY.VIEW',
            'BRANCH.POLICY.VIEW',
          ],
        },
      },
      {
        path: 'cis',
        loadChildren: cisModule,
        canActivate: [AuthGuard, RoleGuard],
        data: {
          roles: [
            'BRANCH.POLICY.CREATE',
            'CUSTOMER.POLICY.CREATE',
            'INSURER.POLICY.CREATE',
            'INSURER.POLICY.VIEW',
            'BRANCH.POLICY.VIEW',
          ],
        },
      },
      {
        path: 'user-management',
        loadChildren: userModule,
      },
      {
        path: 'file-upload/:type',
        component: FileUploadComponent,
        canActivate: [RoleGuard, AuthGuard],
        data: { roles: ['BRANCH.BULK.UPLOAD.VIEW'] },
      },
      {
        path: 'getCisConsentApplication',
        loadChildren: cisModule,
      },
      {
        path: 'getPolicyForConsent',
        loadChildren: proposalModule,
      },
      {
        path: 'payment-approval',
        loadChildren: paymentApprovalModule,
        canActivate: [AuthGuard, RoleGuard],
        data: {
          roles: ['BRANCH.POLICY.CREATE', 'CUSTOMER.POLICY.CREATE', 'INSURER.POLICY.CREATE'],
        },
      },
      {
        path: 'policyvault',
        loadChildren: policyVaultModule,
        canActivate: [AuthGuard, RoleGuard],
        data: {
          roles: ['BRANCH.POLICY.VIEW', 'CUSTOMER.POLICY.VIEW', 'INSURER.POLICY.VIEW'],
        },
      },
      {
        path: 'error',
        loadChildren: sharedModule,
      },
      // {
      //   path: 'help',
      //   loadChildren: sharedModule,
      // },
      {
        path: 'initiate-payment/cis/:appNo',
        loadChildren: initiatePaymentModule,
        canActivate: [AuthGuard, RoleGuard],
        data: {
          roles: ['BRANCH.POLICY.CREATE', 'CUSTOMER.POLICY.CREATE', 'INSURER.POLICY.CREATE'],
        },
      },
      {
        path: 'initiate-payment/:appNo',
        loadChildren: initiatePaymentModule,
        canActivate: [AuthGuard, RoleGuard],
        data: {
          roles: ['BRANCH.POLICY.CREATE', 'CUSTOMER.POLICY.CREATE', 'INSURER.POLICY.CREATE'],
        },
      },
      { path: 'postpayment/:insurerId', component: PostPaymentComponent },
      { path: 'postpayment/:insurerId/:appNo', component: PostPaymentComponent },
      {
        path: 'Confirmation/:insurerId/:appNo',
        component: ConfirmationComponent,
      },
      {
        path: 'issue-policy/:insurerId/:appNo',
        component: IssuePolicyComponent,
      },
      { path: 'payment-info/:appNo', component: PaymentInfoComponent },
      // { path: 'bankB2Clandingpage/:token', component: BankB2cComponent },
      {
        path: 'sp-approval',
        loadChildren: spApprovalModule,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['BRANCH.POLICY.APPROVE'] },
      },

      { path: 'b2c', component: BankB2cComponent },
      { path: 'consentSuccessful/:msg', component: ConsentEndPage },

      { path: 'validateConsent', component: SibLandingPageComponent },
      { path: 'dcb', component: DcbAdfsComponent },
      { path: 'dcb/:error', component: DcbAdfsComponent },

      { path: 'bankUserDirectLogin/:token', component: BankUserComponent },
      { path: 'registerCustomer', component: RegisterCustomerComponent },
      {
        path: 'myactivities',
        loadChildren: myActivitiesModule,
        canActivate: [RoleGuard, AuthGuard],
        data: {
          roles: ['BRANCH.ACTIVITIES.LIST', 'CUSTOMER.ACTIVITIES.LIST', 'INSURER.ACTIVITIES.LIST'],
        },
      },
      {
        path: 'mycustomers',
        loadChildren: mycustomersModule,
        canActivate: [RoleGuard, AuthGuard],
        data: { roles: ['BRANCH.CUSTOMER.VIEW', 'ZONE.CUSTOMER.VIEW', 'INSURER.CUSTOMER.VIEW'] },
      },
      {
        path: 'group-credit',
        loadChildren: loanModule,
        canActivate: [RoleGuard, AuthGuard],
        data: {
          roles: ['BRANCH.POLICY.VIEW', 'CUSTOMER.POLICY.VIEW', 'INSURER.POLICY.VIEW'],
        },
      },
      {
        path: 'group-credit/under-writing',
        loadChildren: uwApprovalModule,
        canActivate: [RoleGuard, AuthGuard],
        data: { roles: ['INSURER.UW.VIEW', 'INSURER.UW.UPDATE'] },
      },
      {
        path: 'lead-management',
        loadChildren: leadManagementModule,
      },
      {
        path: 'lead-management/viewleads',
        loadChildren: leadManagementModule,
        canActivate: [RoleGuard, AuthGuard],
        data: {
          roles: [
            'BRANCH.QUOTE.CREATE',
            'BRANCH.QUOTE.VIEW',
            'INSURER.QUOTE.CREATE',
            'INSURER.QUOTE.VIEW',
          ],
        },
      },
      {
        path: 'reports',
        loadChildren: reportsModule,
        canActivate: [RoleGuard, AuthGuard],
        data: { roles: ['BRANCH.REPORT.VIEW', 'REPORT.VIEW'] },
      },
      {
        path: 'recon',
        loadChildren: reconModule,
      },
      {
        path: 'mycustomers/:productId',
        loadChildren: mycustomersModule,
        canActivate: [RoleGuard, AuthGuard],
        data: { roles: ['BRANCH.CUSTOMER.VIEW', 'ZONE.CUSTOMER.VIEW', 'INSURER.CUSTOMER.VIEW'] },
      },
      {
        path: 'mycustomers/new/:newCustomerId',
        loadChildren: mycustomersModule,
        canActivate: [RoleGuard, AuthGuard],
        data: { roles: ['BRANCH.CUSTOMER.VIEW', 'ZONE.CUSTOMER.VIEW', 'INSURER.CUSTOMER.VIEW'] },
      },
      {
        path: 'mydashboard',
        component: MydashboardComponent,
        canActivate: [RoleGuard, AuthGuard],
        data: { roles: ['BRANCH.REPORT.VIEW'] },
      },
      {
        path: 'myrenewals',
        component: MyrenewalsComponent,
        canActivate: [RoleGuard, AuthGuard],
        data: { roles: ['BRANCH.POLICY.CREATE', 'INSURER.CUSTOMER.VIEW'] },
      },
      {
        path: 'policyvault',
        canActivate: [RoleGuard, AuthGuard],
        loadChildren: policyVaultModule,
        data: {
          roles: ['BRANCH.POLICY.VIEW', 'CUSTOMER.POLICY.VIEW', 'INSURER.POLICY.VIEW'],
        },
      },
      { path: 'quickquote', component: QuickquoteComponent },
      { path: 'scanqr/:productId/:token', component: QrLandingPageComponent },
      {
        path: 'changepassword',
        loadChildren: changePasswordModule,
        canActivate: [RoleGuard],
      },
      {
        path: 'changepassword/:userName',
        loadChildren: changePasswordModule,
        // canActivate: [RoleGuard],
      },
      {
        path: ':CID/policyvault',
        canActivate: [RoleGuard, AuthGuard],
        loadChildren: policyVaultModule,
        data: { roles: ['BRANCH.REPORT.VIEW', 'ZONE.REPORT.VIEW'] },
      },
      {
        path: ':CID/quickquote',
        component: QuickquoteComponent,
        canActivate: [RoleGuard],
        data: { roles: ['BRANCH.QUOTE.VIEW', 'ZONE.QUOTE.VIEW', 'INSURER.QUOTE.CREATE'] },
      },
      {
        path: 'offline-policies',
        canActivate: [RoleGuard, AuthGuard],
        loadChildren: offlinePoliciesModule,
        data: {
          roles: ['BRANCH.POLICY.VIEW', 'CUSTOMER.POLICY.VIEW', 'INSURER.POLICY.VIEW'],
        },
      },
      { path: 'consent/:orgCode/:sibConsent/:appNo', component: NewApplicationComponent },
      {
        path: 'lms',
        canActivate: [RoleGuard, AuthGuard],
        loadChildren: lmsModule,
        data: {
          roles: ['BRANCH.POLICY.VIEW', 'CUSTOMER.POLICY.VIEW', 'INSURER.POLICY.VIEW'],
        },
      },
      {
        path: 'lead-request',
        canActivate: [RoleGuard],
        loadChildren: leadRrModule,
        data: {
          userGroups: ['LRR'],
        },
      },
      {
        path: 'uam',
        canActivate: [RoleGuard, AuthGuard],
        loadChildren: userDcbModule,
        data: {
          roles: ['BRANCH.POLICY.VIEW', 'CUSTOMER.POLICY.VIEW', 'INSURER.POLICY.VIEW'],
        },
      },

      { path: 'cis/lob/:customerId', component: CisComponent },
      { path: 'bulkupload', component: BulkUploadComponent },
      { path: 'bulkuploadview', component: BulkUploadViewComponent },

      { path: '**', redirectTo: 'mycustomers' },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      // { enableTracing: true } // <-- debugging purposes only
      { scrollPositionRestoration: 'enabled' },
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
