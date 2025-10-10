import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentApprovalService } from '@app/payment-approval/services/payment-approval.service';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';
import { LoaderService } from '@app/_services/loader.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-issue-policy',
  templateUrl: './issue-policy.component.html',
  styleUrls: ['./issue-policy.component.css'],
})
export class IssuePolicyComponent implements OnInit, OnDestroy {
  appNo: string;

  insurerId: string;

  issuePolicySubscription: Subscription;

  constructor(
    private paymentService: PaymentApprovalService,
    private loaderService: LoaderService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    console.log('issuing policy');
    this.route.params.subscribe((params) => {
      if (params.appNo) {
        this.appNo = params.appNo;
      }
      if (params.insurerId) {
        this.insurerId = params.insurerId;
      }
    });
    console.log('got the app id and insurer id', this.appNo, this.insurerId);

    this.loaderService.showSpinner(true);
    this.issuePolicySubscription = this.paymentService.issuePolicy(this.appNo).subscribe(
      (policyData) => {
        console.log('issue policy successful', policyData);
        if (policyData['responseCode'] === 0) {
          this.paymentService.checkIssuanceResponse(this.appNo).subscribe((res) => {
            console.log('check issuance policy', res);
            if (res.responseCode === 0) {
              let message = +this.insurerId === 117 && res.productType !== 'GC' ? 'Your proposal has been successfully submitted to the insurer. The status of the policy will be informed shortly.' : +this.insurerId === 130 && res.productType === 'GC' ? 'We have received your proposal for insurance, on successful evaluation and underwriting of proposal, we will issue /reject policy and same will be communicated with you.' : policyData['responseMessage']
              this.loaderService.showSpinner(false);
              this.router.navigate(['/Confirmation', this.insurerId, this.appNo], {
                queryParams: {
                  status: 'Success',
                  paymentReferenceNo: policyData['paymentReferenceNo'],
                  policyNo: policyData['policyNo'],
                  premiumPaid: policyData['premiumPaid'],
                  logoUrl: policyData['logoUrl'],
                  appNo: this.appNo,
                  receiptNo: policyData['recieptNo'],
                  paymentGatewayId: policyData['paymentGatewayId'],
                  message: policyData['responseMessage'],
                },
              });
            } else {
              this.loaderService.showSpinner(false);
              this.router.navigate(['/Confirmation', this.insurerId, this.appNo], {
                queryParams: {
                  status: 'Error',
                  paymentReferenceNo: policyData['paymentReferenceNo'],
                  policyNo: policyData['policyNo'],
                  premiumPaid: policyData['premiumPaid'],
                  logoUrl: policyData['logoUrl'],
                  appNo: this.appNo,
                  receiptNo: policyData['recieptNo'],
                  paymentGatewayId: policyData['paymentGatewayId'],
                  message: policyData['responseMessage'],
                },
              });
            }
          }, () => {
            console.log('issue policy failed');
            this.loaderService.showSpinner(false);
            this.router.navigate(['/Confirmation', this.insurerId, this.appNo], {
              queryParams: {
                status: 'Error',
                appNo: this.appNo,
                message:
                  "There was some problem with the payment. If money has been deducted it'll be refunded withing 7 days.",
              },
            });
          },
          );
        } else {
          this.router.navigate(['/Confirmation', this.insurerId, this.appNo], {
            queryParams: {
              status: 'Error',
              paymentReferenceNo: policyData['paymentReferenceNo'],
              policyNo: policyData['policyNo'],
              premiumPaid: policyData['premiumPaid'],
              logoUrl: policyData['logoUrl'],
              appNo: this.appNo,
              receiptNo: policyData['recieptNo'],
              paymentGatewayId: policyData['paymentGatewayId'],
              message: policyData['responseMessage'],
            },
          });
        }
      },
      () => {
        console.log('issue policy failed');

        this.loaderService.showSpinner(false);
        this.router.navigate(['/Confirmation', this.insurerId, this.appNo], {
          queryParams: {
            status: 'Error',
            appNo: this.appNo,
            message:
              "There was some problem with the payment. If money has been deducted it'll be refunded withing 7 days.",
          },
        });
      },
    );
  }

  ngOnDestroy() {
    if (this.issuePolicySubscription) {
      this.issuePolicySubscription.unsubscribe();
    }
  }
}
