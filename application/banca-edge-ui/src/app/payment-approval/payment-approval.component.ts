import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';
import { SimpleYesNoModalComponent } from '@app/shared/components/simple-yes-no-modal/simple-yes-no-modal.component';
import { AccountService } from '@app/_services/account.service';
import { LoaderService } from '@app/_services/loader.service';
import { PaymentApprovalService } from './services/payment-approval.service';
import { ComprehensiveInsuranceSystemService } from '@app/comprehensive-insurance-system/services/comprehensive-insurance-system.service';

@Component({
  selector: 'app-payment-approval',
  templateUrl: './payment-approval.component.html',
  styleUrls: ['./payment-approval.component.css'],
})
export class PaymentApprovalComponent implements OnInit {
  paymentRequests;

  paymentRequestsCopy;

  paymentRequestsToDisplay;

  pageSize = 5;

  pageIndex = 0;

  currentUser;

  appNo;

  issuePolicySubscription;

  pageSizeOptions: number[] = [5, 10, 25, 100];

  displayedColumns: string[] = [
    'Transaction Date',
    'Application Number',
    'From Account',
    'Insurer',
    'Amount',
    'Status',
    'Actions',
  ];

  searchForm: FormGroup;

  user;

  orgCode;

  @ViewChild('paginator') paginator: MatPaginator;

  constructor(
    private paymentService: PaymentApprovalService,
    private cisService: ComprehensiveInsuranceSystemService,
    private loaderService: LoaderService,
    private accountService: AccountService,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.accountService.user.subscribe((x) => (this.user = x));

    this.searchForm = new FormGroup({
      searchField: new FormControl(),
    });
    this.currentUser = this.accountService.userValue;
    if (this.currentUser.organizationCode === 'SIB') {
      this.displayedColumns.unshift('Customer Name', 'Instrument Number')
    }
    this.getPaymentsForUSers();
  }

  getPaymentsForUSers() {
    this.loaderService.showSpinner(true);
    this.paymentService.getPaymentsForUSers().subscribe(
      (data) => {
        this.paymentRequestsCopy = data;
        this.paymentRequests = this.paymentRequestsCopy.slice();
        const paymenetsToDisplay = this.pageIndex * this.pageSize;
        this.paymentRequestsToDisplay = this.paymentRequests.slice(
          paymenetsToDisplay,
          this.pageSize,
        );
        this.loaderService.showSpinner(false);
      },
      () => {
        this.loaderService.showSpinner(false);
      },
    );
  }

  onApproveClicked(paymentId, insurerId, appNo, element) {
    const dialogRef = this.dialog.open(SimpleYesNoModalComponent, {
      data: 'I confirm that the customer has signed the debit authorization form to allow deduction of premium for this policy',
      panelClass: 'dialog-width',
    });
    dialogRef.afterClosed().subscribe((btn) => {
      if (btn === 'yes') {
        this.approvePayment(paymentId, insurerId, appNo, element);
      }
    });
  }

  goToApplication(element) {
    this.loaderService.showSpinner(true);
    this.cisService.getCisApplication(element.appNo).subscribe((res) => {
      this.loaderService.showSpinner(false);
      let { lob, productType, insurerId } = res['productInfo'];
      // console.log(res)
      this.router.navigate([
        `/cis/${element.customerId}/${lob}/${productType}/${insurerId}/${element.appNo}`,
      ]);
    });
  }

  approvePayment(paymentId, insurerId, appNo, element) {
    this.orgCode = this.user?.organizationCode;
    this.loaderService.showSpinner(true);
    if (element.cisApp) {
      this.paymentService.approvePayment(paymentId).subscribe(
        (data) => {
          this.loaderService.showSpinner(false);
          if (data['responseCode'] === 0) {
            if (this.orgCode === 'KB') {
              this.loaderService.showSpinner(true);
              this.paymentService.issueCisPolicy(appNo).subscribe(
                (data) => {
                  this.loaderService.showSpinner(false);
                  if (data['responseCode'] === 0) {
                    const dialogref = this.dialog.open(PolicyErrorModalComponent, {
                      data: data['responseMessage'],
                      panelClass: 'dialog-width',
                    });
                    dialogref.afterClosed().subscribe(() => {
                      this.router.navigateByUrl('/cis');
                    });
                  } else {
                    const dialogref = this.dialog.open(PolicyErrorModalComponent, {
                      data: data['responseMessage'],
                      panelClass: 'dialog-width',
                    });
                  }
                },
                (error) => {
                  this.loaderService.showSpinner(false);
                  const dialogref = this.dialog.open(PolicyErrorModalComponent, {
                    data: error.errorMessage,
                    panelClass: 'dialog-width',
                  });
                },
              );
            } else {
              const dialogref = this.dialog.open(PolicyErrorModalComponent, {
                data: data['responseMessage'],
                panelClass: 'dialog-width',
              });
              dialogref.afterClosed().subscribe(() => {
                if (this.orgCode === 'SIB' && element?.insurerId === 111) {
                  this.paymentService.sendLmsPaymentDetailsToInsurer(appNo).subscribe((res) => {
                    const dialogref = this.dialog.open(PolicyErrorModalComponent, {
                      data: res['responseMessage'],
                      panelClass: 'dialog-width',
                    });
                    dialogref.afterClosed().subscribe(() => {
                      if (res['responseCode'] == 0) {
                        this.router.navigateByUrl('/lms');
                      }
                    });
                  });
                }
              });
            }
          } else {
            const dialogref = this.dialog.open(PolicyErrorModalComponent, {
              data: data['responseMessage'],
              panelClass: 'dialog-width',
            });
          }
        },
        (err) => {
          const dialogref = this.dialog.open(PolicyErrorModalComponent, {
            data: err.errorMessage,
            panelClass: 'dialog-width',
          });
          this.loaderService.showSpinner(false);
        },
      );
    } else {
      this.paymentService.approvePayment(paymentId).subscribe(
        (data) => {
          if (insurerId === 512 && data['responseCode'] === 0) {
            this.paymentService.sendLeadToInsurer(appNo).subscribe(
              (policyData) => {
                if (policyData['isExternalNavigation']) {
                  const mapForm = document.createElement('form');
                  mapForm.method = policyData['method'];
                  // mapForm.target = '_blank';
                  mapForm.action = policyData['url'];
                  mapForm.style.display = 'none';
                  if (policyData['payload'] && Object.keys(policyData['payload']).length > 0) {
                    Object.keys(policyData['payload']).forEach((key) => {
                      const mapInput = document.createElement('input');
                      mapInput.type = 'hidden';
                      mapInput.name = key;
                      mapInput.value = policyData['payload'][key];
                      mapForm.appendChild(mapInput);
                    });
                  }
                  document.body.appendChild(mapForm);

                  mapForm.submit();
                }
                this.loaderService.showSpinner(false);
                this.router.navigate(['/Confirmation', insurerId, policyData['applicationNo']], {
                  queryParams: {
                    status: policyData['status'],
                    paymentReferenceNo: policyData['paymentReferenceNo'],
                    policyNo: policyData['policyNo'],
                    premiumPaid: policyData['premiumPaid'],
                    logoUrl: policyData['logoUrl'],
                    appNo: policyData['applicationNo'],
                    receiptNo: policyData['recieptNo'],
                    paymentGatewayId: policyData['paymentGatewayId'],
                    message: policyData['message'],
                  },
                });
              },
              () => {
                this.loaderService.showSpinner(false);
              },
            );
          } else if (data['responseCode'] === 0) {
            this.issuePolicySubscription = this.paymentService.issuePolicy(appNo).subscribe(
              (policyData) => {
                console.log('issue policy successful', policyData);
                if (policyData['responseCode'] === 0) {
                  this.paymentService.checkIssuanceResponse(appNo).subscribe(
                    (res) => {
                      if (res.responseCode === 0) {
                        let message =
                          (+insurerId === 117 || +insurerId === 130)
                            ? 'We have received your proposal for insurance, on successful evaluation and underwriting of proposal, we will issue /reject policy and same will be communicated with you.'
                            : 'Your Policy has been issued Successfully.You will receive your Policy Schedule shortly.';
                        this.loaderService.showSpinner(false);
                        // this.loaderService.showSpinner(false);
                        this.router.navigate(['/Confirmation', insurerId, appNo], {
                          queryParams: {
                            status: 'Success',
                            paymentReferenceNo: policyData['paymentReferenceNo'],
                            policyNo: policyData['policyNo'],
                            premiumPaid: policyData['premiumPaid'],
                            logoUrl: policyData['logoUrl'],
                            appNo: appNo,
                            receiptNo: policyData['recieptNo'],
                            paymentGatewayId: policyData['paymentGatewayId'],
                            message: message,
                          },
                        });
                      } else {
                        this.loaderService.showSpinner(false);
                        this.router.navigate(['/Confirmation', insurerId, appNo], {
                          queryParams: {
                            status: 'Error',
                            appNo: appNo,
                            message:
                              "There was some problem with the payment. If money has been deducted it'll be refunded withing 7 days.",
                          },
                        });
                      }
                    },
                    () => {
                      console.log('issue policy failed');
                      this.loaderService.showSpinner(false);
                      this.router.navigate(['/Confirmation', insurerId, appNo], {
                        queryParams: {
                          status: 'Error',
                          appNo: appNo,
                          message:
                            "There was some problem with the payment. If money has been deducted it'll be refunded withing 7 days.",
                        },
                      });
                    },
                  );
                } else {
                  this.loaderService.showSpinner(false);
                  this.router.navigate(['/Confirmation', insurerId, appNo], {
                    queryParams: {
                      status: 'Error',
                      paymentReferenceNo: policyData['paymentReferenceNo'],
                      policyNo: policyData['policyNo'],
                      premiumPaid: policyData['premiumPaid'],
                      logoUrl: policyData['logoUrl'],
                      appNo: appNo,
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
                this.router.navigate(['/Confirmation', insurerId, appNo], {
                  queryParams: {
                    status: 'Error',
                    appNo: appNo,
                    message:
                      "There was some problem with the payment. If money has been deducted it'll be refunded withing 7 days.",
                  },
                });
              },
            );
          } else if (data['responseCode'] !== 0) {
            this.loaderService.showSpinner(false);
            this.dialog.open(PolicyErrorModalComponent, {
              data: data['responseMessage'],
              panelClass: 'dialog-width',
            });
          }
        },
        () => {
          this.loaderService.showSpinner(false);
        },
      );
    }
  }

  onRejectClicked(paymentId) {
    this.loaderService.showSpinner(true);
    this.paymentService.rejectPayment(paymentId).subscribe(
      (data) => {
        this.loaderService.showSpinner(false);

        const message = 'Application is rejected';
        this.dialog.open(PolicyErrorModalComponent, {
          data: message,
          panelClass: 'dialog-width',
        });
      },
      (error) => {
        this.loaderService.showSpinner(false);
        const message = error['responseMessage'];
        this.dialog.open(PolicyErrorModalComponent, {
          data: message,
          panelClass: 'dialog-width',
        });
      },
    );
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    const paymenetsToDisplay = event.pageIndex * event.pageSize;
    this.paymentRequestsToDisplay = this.paymentRequests.slice(
      paymenetsToDisplay,
      paymenetsToDisplay + event.pageSize,
    );
  }

  onVerify(appNo, cisApp, paymentDetails) {
    this.paymentService.paymentDetails = paymentDetails;
    console.log(appNo, cisApp);
    this.router.navigate([`/payment-approval/view-approval-application/${appNo}/${cisApp}`]);
  }

  onSearchFieldChange() {
    const searchValue = this.searchForm.get('searchField').value.toLocaleLowerCase();
    this.paymentRequests = this.paymentRequestsCopy.slice().filter((paymentRequest) => {
      const paymentRequestString = JSON.stringify(paymentRequest);
      if (
        paymentRequestString.match(searchValue) ||
        paymentRequestString.toLocaleLowerCase().match(searchValue)
      ) {
        return paymentRequest;
      }
    });
    this.paymentRequestsToDisplay = this.paymentRequests.slice(0, this.pageSize);
    this.paginator.pageIndex = 0;
  }
}
