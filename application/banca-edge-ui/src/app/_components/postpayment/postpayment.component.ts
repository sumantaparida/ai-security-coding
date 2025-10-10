import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '@app/_services/loader.service';
import { PaymentService } from '@app/_services/payment.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-postpayment',
  templateUrl: './postpayment.component.html',
  styleUrls: ['./postpayment.component.css'],
})
export class PostPaymentComponent implements OnInit, OnDestroy {
  queryParameters: string;

  insurerId: string;

  appNo: string;

  paymentSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private router: Router,
    private loaderService: LoaderService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.insurerId = params.insurerId;
      if (params.appNo) {
        this.appNo = params.appNo;
      }
    });
    this.route.queryParams.subscribe((queryParams) => {
      console.log('printing the query params', queryParams);
      Object.keys(queryParams).forEach((key, index) => {
        if (index === 0) {
          this.queryParameters = `${key}=${queryParams[key]}`;
        } else {
          this.queryParameters += `&${key}=${queryParams[key]}`;
        }
      });
      if (this.appNo) {
        this.queryParameters += `appNo=${this.appNo}`;
      }
      console.log('final query result', this.queryParameters);
    });

    this.loaderService.showSpinner(true);
    this.paymentSubscription = this.paymentService
      .sendConfirmationRequest(this.insurerId, this.queryParameters)
      .subscribe(
        (data) => {
          this.loaderService.showSpinner(false);
          console.log('data recieved from payment', data);
          this.router.navigate(['/Confirmation', this.insurerId, data['applicationNo']], {
            queryParams: {
              status: data['status'],
              paymentReferenceNo: data['paymentReferenceNo'],
              policyNo: data['policyNo'],
              premiumPaid: data['premiumPaid'],
              logoUrl: data['logoUrl'],
              appNo: data['applicationNo'],
              receiptNo: data['recieptNo'],
              paymentGatewayId: data['paymentGatewayId'],
              message: data['message'],
            },
          });
        },
        (error) => {
          this.loaderService.showSpinner(false);
          this.router.navigate(['/Confirmation', this.insurerId, error['Application_No']], {
            queryParams: {
              status: 'Failure',
            },
          });
        },
      );
  }

  ngOnDestroy() {
    if (this.paymentSubscription) {
      this.paymentSubscription.unsubscribe();
    }
  }
}
