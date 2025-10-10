import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, Subject, Subscription } from 'rxjs';
import { environment } from '@environments/environment';
@Injectable({
  providedIn: 'root',
})
export class PaymentApprovalService {
  private successResponse: Subject<any> = new Subject<any>();

  private issuPolicySuccess: Subscription;

  paymentDetails;

  constructor(private http: HttpClient) {}

  getPaymentsForUSers() {
    return this.http.get('/api/v1/payment/getPaymentsForUser');
  }

  approvePayment(paymentId) {
    return this.http.get(`/api/v1/payment/approvePayment/${paymentId}`);
  }

  rejectPayment(paymentId) {
    return this.http.get(`/api/v1/payment/rejectPayment/${paymentId}`);
  }
  
  issuePolicy(appNo) {
    return this.http.get(`/api/v1/policy/issuePolicy/${appNo}`);
  }

  issueCisPolicy(appNo) {
    return this.http.get(`/api/v1/lms/issueCISApplication/${appNo}`);

  }

  getFnaBase64(applicationNo) {
    return this.http.get(`${environment.apiUrl}/api/v1/policy/encoded/pdf/${applicationNo}`);
  }

  checkIssuanceResponse(appNo) {
    let clock = 0;
    const timerCountInterval = setInterval(() => {
      clock += 3000;
    }, 3000);
    this.issuPolicySuccess = interval(3000).subscribe(() => {
      this.http.get(`/api/v1/policy/checkIssuanceResponse/${appNo}`).subscribe((res) => {
        console.log('api loop response', res);
        console.log('clock time', clock);
        if (res.hasOwnProperty('responseCode') && res['responseCode'] === 0) {
          this.successResponse.next(res);
          this.issuPolicySuccess.unsubscribe();
        } else if (res.hasOwnProperty('responseCode') && res['responseCode'] === 500) {
          clearInterval(timerCountInterval);
          this.successResponse.next({ status: 'Error', responseCode: 500 });
          this.issuPolicySuccess.unsubscribe();
        } else if (clock >= 60000) {
          clearInterval(timerCountInterval);
          this.successResponse.next({ status: 'Error', responseCode: 500 });
          this.issuPolicySuccess.unsubscribe();
        }
      });
    });
    return this.successResponse.asObservable();
  }

  sendLeadToInsurer(appNo) {
    return this.http.get(`/api/v1/policy/sendLeadtoInsurer/${appNo}`);
  }

  sendLmsPaymentDetailsToInsurer(leadId) {
    return this.http.get(`/api/v1/lms/sendLmsPaymentDetailsToInsurer/${leadId}`);
  }
}
