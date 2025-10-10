import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { TokenService } from '@app/_services/token.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { interval, Subject, Subscription } from 'rxjs';
import { PostalCode } from '@app/interface/Customer';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProposalService {
  token;

  private healthHospPaymentSuccess: Subscription;

  private successResponse: Subject<any> = new Subject<any>();

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  generateQRCode(appNo) {
    return this.http.get<string>(`${environment.apiUrl}/api/v1/policy/createQRCodeData/${appNo}`, {
      responseType: 'text' as 'json',
    });
  }

  getFnaBase64(applicationNo) {
    return this.http.get(`${environment.apiUrl}api/v1/policy/encoded/pdf/${applicationNo}`);
  }

  getProposalFormData(productId, formType, online) {
    const data = {
      productId,
      formType,
      online,
    };
    return this.http.post(`${environment.apiUrl}/api/v1/master/proposalFormData`, data);
  }

  recalculatePremium(data) {
    return this.http.post(`${environment.apiUrl}/api/v1/quote/getQuoteforProduct`, data);
  }

  getDropdownFromMaster(master: string, productId: string) {
    return this.http.get(
      `${environment.apiUrl}/api/v1/master/getMasterCodes/${master}/${productId}`,
    );
  }

  getMaritalStatus(maritalstatus, productId) {
    // const lob = 'Health';
    // const productType = 'FF'
    //  console.log("occuption" + maritalstatus);
    //   console.log("product" + productId);

    return this.http.get(
      `${environment.apiUrl}/api/v1/master/getMasterCodes/${maritalstatus}/${productId}`,
    );
  }

  getRelationship(RelMapping, productId) {
    //  console.log("occuption" + RelMapping);
    //  console.log("product" + productId);
    return this.http.get(
      `${environment.apiUrl}/api/v1/master/getMasterCodes/${RelMapping}/${productId}`,
    );
  }

  getNomineeRel(nomineerel, productId) {
    // console.log("occuption" + nomineerel);
    // console.log("product" + productId);
    return this.http.get(
      `${environment.apiUrl}/api/v1/master/getMasterCodes/${nomineerel}/${productId}`,
    );
  }

  sendLeadToInsurer(appNo) {
    return this.http.get(`${environment.apiUrl}/api/v1/policy/sendLeadtoInsurer/${appNo}`);
  }

  getVehicleBody(masterName, productId) {
    return this.http.get(
      `${environment.apiUrl}/api/v1/master/getMasterCodes/${masterName}/${productId}`,
    );
  }

  getLoanType(masterName, productId) {
    return this.http.get(
      `${environment.apiUrl}/api/v1/master/getMasterCodes/${masterName}/${productId}`,
    );
  }

  getInsurer(masterName, productId) {
    return this.http.get(
      `${environment.apiUrl}/api/v1/master/getMasterCodes/${masterName}/${productId}`,
    );
  }

  getPinData(productId, val) {
    // console.log("medical");
    return this.http.get(`${environment.apiUrl}/api/v1/master/getPinData/${productId}/${val}`);
  }

  getMedical(productId) {
    return this.http.get<any[]>(
      `${environment.apiUrl}/api/v1/master/getMedicalQuestions/${productId}`,
    );
  }

  getAccountDetails(cifNumber) {
    return this.http.get(
      `${environment.apiUrl}/api/v1/payment/getAccountsforApplication/${cifNumber}`,
    );
  }

  initiatePayment(paymentBody) {
    return this.http.post(`${environment.apiUrl}/api/v1/payment/initiateDebit`, paymentBody);
  }

  sendForSPApproval(appNo) {
    return this.http.get(`${environment.apiUrl}/api/v1/policy/sendForSPApproval/${appNo}`);
  }

  getApplicationbyApplicationNo(appNo) {
    return this.http.get(
      `${environment.apiUrl}/api/v1/policy/getApplicationbyApplicationNo/${appNo}`,
    );
  }

  saveApplication(data) {
    return this.http.post(`${environment.apiUrl}/api/v1/policy/saveApplication/`, data);
  }

  submitApplication(data) {
    return this.http.post(`${environment.apiUrl}/api/v1/policy/submitApplication`, data);
  }

  getCityAndState(pincode: string) {
    return this.http.get<PostalCode>(`${environment.apiUrl}/api/v1/master/getPinData/${pincode}`);
  }

  getState() {
    return this.http.get(`${environment.apiUrl}/api/v1/master/getStates`);
  }

  getCity(stateCode: string) {
    return this.http.get(`${environment.apiUrl}/api/v1/master/getCityByState/${stateCode}`);
  }

  checkProposalResponses(appNo, token) {
    // const timera = Observable.timer(initialDelay, period);
    let clock = 0;
    const timerCountInterval = setInterval(() => {
      clock += 3000;
    }, 3000);
    this.healthHospPaymentSuccess = interval(3000).subscribe(() => {
      if (token) {
        this.http
          .get(`${environment.apiUrl}/api/v1/policy/checkProposalConsentResponse/${token}`)
          .subscribe(
            (res) => {
              if (
                res.hasOwnProperty('errorDescription') &&
                res['errorDescription'] === 'Premium Mismatch'
              ) {
                clearInterval(timerCountInterval);
                this.healthHospPaymentSuccess.unsubscribe();
                this.successResponse.next(res);
              } else if (res.hasOwnProperty('errorDescription') || res.hasOwnProperty('error')) {
                clearInterval(timerCountInterval);
                this.healthHospPaymentSuccess.unsubscribe();
                this.successResponse.next(res);
              } else if (res.hasOwnProperty('TransactionID') && res['TransactionID']) {
                clearInterval(timerCountInterval);
                this.successResponse.next(res);
                this.healthHospPaymentSuccess.unsubscribe();
              } else if (res.hasOwnProperty('transactionId') && res['transactionId']) {
                clearInterval(timerCountInterval);
                this.healthHospPaymentSuccess.unsubscribe();
                this.successResponse.next(res);
              }
              if (clock >= 40000) {
                clearInterval(timerCountInterval);
                this.healthHospPaymentSuccess.unsubscribe();
                this.successResponse.next({
                  status: 'failure',
                  message: 'Request timed out. Please try after sometime.',
                });
              }
            },
            (error) => {
              clearInterval(timerCountInterval);
              this.healthHospPaymentSuccess.unsubscribe();
              this.successResponse.next({ status: 'failure', message: error.error.message });
            },
          );
      } else {
        this.http
          .get(`${environment.apiUrl}/api/v1/policy/checkProposalResponse/${appNo}`)
          .subscribe(
            (res) => {
              if (
                res.hasOwnProperty('errorDescription') &&
                res['errorDescription'] === 'Premium Mismatch'
              ) {
                clearInterval(timerCountInterval);
                this.healthHospPaymentSuccess.unsubscribe();
                this.successResponse.next(res);
              } else if (res.hasOwnProperty('errorDescription') || res.hasOwnProperty('error')) {
                clearInterval(timerCountInterval);
                this.healthHospPaymentSuccess.unsubscribe();
                this.successResponse.next(res);
              } else if (res.hasOwnProperty('TransactionID') && res['TransactionID']) {
                clearInterval(timerCountInterval);
                this.successResponse.next(res);
                this.healthHospPaymentSuccess.unsubscribe();
              } else if (res.hasOwnProperty('transactionId') && res['transactionId']) {
                clearInterval(timerCountInterval);
                this.healthHospPaymentSuccess.unsubscribe();
                this.successResponse.next(res);
              }
              if (clock >= 40000) {
                clearInterval(timerCountInterval);
                this.healthHospPaymentSuccess.unsubscribe();
                this.successResponse.next({
                  status: 'failure',
                  message: 'Request timed out. Please try after sometime.',
                });
              }
            },
            (error) => {
              clearInterval(timerCountInterval);
              this.healthHospPaymentSuccess.unsubscribe();
              this.successResponse.next({ status: 'failure', message: error.error.message });
            },
          );
      }
    });
    return this.successResponse.asObservable();
  }

  // sendRespOnSuccess() {

  // }
  getMotorProposalData(appNo) {
    return this.http.get(
      `${environment.apiUrl}/api/v1/policy/getApplicationbyApplicationNo/${appNo}`,
    );
  }

  postSubmitMotorProposalData(applicationData) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(
      `${environment.apiUrl}/api/v1/policy/submitApplication`,
      applicationData,
      { headers },
    );
  }

  checkProposalResponse(appNo) {
    return this.http.get(`${environment.apiUrl}/api/v1/policy/checkProposalResponse/${appNo}`);
  }

  saveApplicationData(applicationData) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(`${environment.apiUrl}/api/v1/policy/saveApplication`, applicationData, {
      headers,
    });
  }

  validateOTP(otpKey, otp) {
    return this.http.post(`${environment.apiUrl}/api/v1/policy/validateOtp`, { otpKey, otp });
  }

  resendOTP(appNo) {
    return this.http.get(`${environment.apiUrl}/api/v1/policy/sendOtp/${appNo}`);
  }

  getTravelCountries() {
    return this.http.get(`${environment.apiUrl}/api/v1/master/getTravelCountries`);
  }

  getPolicyForConsent(token) {
    // return this.http.get(`${environment.apiUrl}/api/v1/policy/getPolicyForConsent/${token}`);
    return this.http
      .get(`${environment.apiUrl}/api/v1/policy/getPolicyForConsent/${token}`, {
        observe: 'response',
      })
      .pipe(
        map((apiuser) => {
          const authHeader = apiuser.headers.get('Authorization');
          if (authHeader.indexOf('Bearer ') > -1) {
            this.token = authHeader.substring(7, authHeader.length);
          } else {
            // throwError('Invalid user or password');
          }

          this.tokenService.token = this.token;
          console.log('auth headers', authHeader);
          return apiuser.body;
        }),
      );
  }

  saveConsent(data, token) {
    return this.http.post(`${environment.apiUrl}/api/v1/policy/saveConsent/${token}`, data);
  }

  submitConsent(data, token) {
    return this.http.post(`${environment.apiUrl}/api/v1/policy/submitConsent/${token}`, data);
  }

  getOrderRazorPg(payload){
    const keyId = 'rzp_test_iTmF6soqNfL0q6';
    const secretKey = 'X4q34qIcZTcA0B73tOs7lw6q';
    let auth = btoa(keyId + ':' + secretKey);
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Basic ' + auth);

    return this.http.post(`${environment.apiUrl}/razorpayOrder`, payload);
  }

  createRazorPayOrder(payload){
    return this.http.post(`${environment.apiUrl}/api/v1/payment/createPaymentOrder`,payload);
  }
}
