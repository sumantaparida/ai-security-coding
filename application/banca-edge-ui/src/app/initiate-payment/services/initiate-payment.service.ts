import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InitiatePaymentService {
  constructor(private http: HttpClient) {}

  getAccountDetails(cifNumber) {
    return this.http.get(`/api/v1/payment/getAccountsforApplication/${cifNumber}`);
  }

  getApplication(appNo) {
    return this.http.get(`/api/v1/policy/getApplicationbyApplicationNo/${appNo}`);
  }

  initiatePayment(paymentBody) {
    return this.http.post(`/api/v1/payment/initiateDebit`, paymentBody);
  }

  initiatePaymentForCis(paymentBody) {
    return this.http.post(`/api/v1/payment/initiateCISDebit`, paymentBody);
  }

  sendCustomerConsent(appNo) {
    return this.http.get(`/api/v1/policy/sendCustomerConsent/${appNo}`);
  }

  getAccountsforCustomer(accounNumber) {
    return this.http.get(`/api/v1/payment/getAccountsforCustomer/${accounNumber}`);
  }
  
  getCisApplication(cisNumber) {
    return this.http.get(`/api/v1/lms/getCISApplicationByAppNo/${cisNumber}`);
  }
}
