import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { TokenService } from '@app/_services/token.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HealthHospitalisationModel } from './model/health-hosp.model';
import { Customer } from '@app/interface/Customer';
import { map } from 'rxjs/operators';
import { BehaviorSubject, interval, Observable, Subject, Subscription, timer } from 'rxjs';
import { CkycModalComponent } from './ckyc-modal/ckyc-modal.component';
import { MatDialog } from '@angular/material/dialog';

import { AccountService } from '@app/_services/account.service';

@Injectable()
export class QuoteService {
  quoteInput;

  token;

  num;

  spReqBank = ['KB'];

  spMappedInsurers = [130];

  productQuoteArray = [];

  public fetchQuoteSuccess: Subscription;

  private successResponse: Subject<any> = new Subject<any>();

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private dialog: MatDialog,
    private accountService: AccountService,
  ) {}

  healthHospInfo = new HealthHospitalisationModel();

  setQuoteInput(quoteInput) {
    this.quoteInput = quoteInput;
  }

  getQuoteInput() {
    return this.quoteInput;
  }

  setNumQuote(num) {
    this.num = num;
  }

  getNumQuote() {
    return this.num;
  }

  getInsuredRelationship(lob, productType) {
    // const lob = 'Health';
    // const productType = 'FF'
    return this.http.get(
      `${environment.apiUrl}/api/v1/master/getInsuredRelationship/${lob}/${productType}`,
    );
  }

  getEnhanceCoverAmount(lob, productType) {
    return this.http.get(`${environment.apiUrl}/api/v1/master/getAllowedSA/${lob}/${productType}`);
  }

  postSubmitHealthQuote(healthQuote, checkingHealthOrPA) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(`${environment.apiUrl}/api/v1/quote/${checkingHealthOrPA}`, healthQuote, {
      headers: headers,
    });
  }

  postSubmitLifeQuote(lifeQuote) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(`${environment.apiUrl}/api/v1/quote/submitLifeQuote`, lifeQuote, {
      headers: headers,
    });
  }

  getHealthQuote(quoteId) {
    this.productQuoteArray = [];
    let clock = 0;
    const timerCountInterval = setInterval(() => {
      clock += 5000;
    }, 5000);

    this.fetchQuoteSuccess = interval(5000).subscribe((x) => {
      this.http.get(`${environment.apiUrl}/api/v1/quote/getQuote/${quoteId}`).subscribe(
        (res) => {
          // console.log('printing result', res, clock, this.productQuoteArray.length);
          console.log(
            'result value s checking',
            this.productQuoteArray.length,
            res['productQuote'].length,
          );
          if (res['productQuote'].length === res['numQuotesExpected']) {
            // console.log('inside equla');
            clearInterval(timerCountInterval);
            this.successResponse.next(res);
            this.fetchQuoteSuccess.unsubscribe();
          } else if (
            res['numQuotesExpected'] !== res['productQuote'].length &&
            this.productQuoteArray.length < res['productQuote'].length
          ) {
            console.log('inside if condition', this.productQuoteArray);
            this.successResponse.next(res);
          }
          if (clock >= 60000) {
            clearInterval(timerCountInterval);
            this.successResponse.next(res);
            this.fetchQuoteSuccess.unsubscribe();
          }

          this.productQuoteArray = res['productQuote'];
          // console.log('assigning atlast', this.productQuoteArray);
        },
        (error) => {
          console.log('ininsde errror unscribe', error);

          clearInterval(timerCountInterval);
          this.successResponse.next({ status: 'failure', message: 'Time out' });
          this.fetchQuoteSuccess.unsubscribe();
        },
      );
    });

    return this.successResponse.asObservable();
    // return this.http.get(`${environment.apiUrl}/api/v1/quote/getQuote/${quoteId}`);
    // return this.http.get(`http://localhost:3080/`);
  }

  backToQuote(quoteId) {
    return this.http.get(`${environment.apiUrl}/api/v1/quote/getQuote/${quoteId}`);
  }

  createHealthApplication(productId, createApplicationData) {
    // console.log('ninside service');
    return this.http.post(
      `${environment.apiUrl}/api/v1/policy/createApplication/${productId}`,
      createApplicationData,
    );
  }

  createMotorApplication(productId, createApplicationData) {
    // console.log('ninside service');
    return this.http.post(
      `${environment.apiUrl}/api/v1/policy/createApplication/${productId}`,
      createApplicationData,
    );
  }

  checkSpValidation(insurerId) {
    let organizationCode, sp;
    this.accountService.user.subscribe((user) => {
      organizationCode = user.organizationCode;
      sp = user.sp;
    });
    console.log(insurerId, organizationCode, sp);
    if (
      this.spReqBank.findIndex((bank) => {
        return organizationCode === bank;
      }) > -1
    ) {
      if (
        this.spMappedInsurers.findIndex((insurer) => {
          return insurer === insurerId;
        }) > -1
      ) {
        if (!sp) {
          return true;
        }
      }
    }
    return false;
  }

  createProtectionApplication(productId, createApplicationData) {
    // console.log('protection service');
    return this.http.post(
      `${environment.apiUrl}/api/v1/policy/createApplication/${productId}`,
      createApplicationData,
    );
  }

  createLifeApplication(productId, createApplicationData) {
    // console.log('protection service');
    return this.http.post(
      `${environment.apiUrl}/api/v1/policy/createApplication/${productId}`,
      createApplicationData,
    );
  }

  createChildPlanApplication(productId, createApplicationData) {
    // console.log('protection service');
    return this.http.post(
      `${environment.apiUrl}/api/v1/policy/createApplication/${productId}`,
      createApplicationData,
    );
  }

  getOfflineProposalData(applicantId) {
    return this.http.get(
      `${environment.apiUrl}/api/v1/policy/getApplicationbyApplicationNo/${applicantId}`,
    );
  }

  postSubmitOfflinePurchaseData(offlinePurchaseData) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(
      `${environment.apiUrl}/api/v1/policy/saveApplication`,
      offlinePurchaseData,
      { headers: headers },
    );
  }

  getMotorQuoteInputValue(quoteId) {
    return this.http.get(`${environment.apiUrl}/api/v1/quote/getQuote/${quoteId}`);
  }

  getLifeQuoteInputValue(quoteId) {
    return this.http.get(`${environment.apiUrl}/api/v1/quote/getQuote/${quoteId}`);
  }

  getMotorQuote(quoteId) {
    return this.http.get(`${environment.apiUrl}/api/v1/quote/getQuote/${quoteId}`);
  }

  getLifeQuote(quoteId) {
    return this.http.get(`${environment.apiUrl}/api/v1/quote/getQuote/${quoteId}`);
  }

  getAllPCMakes() {
    return this.http.get(`${environment.apiUrl}/api/v1/master/getAllPCMakes`);
  }

  getPCModelsForMake(value) {
    return this.http.get(`${environment.apiUrl}/api/v1/master/getPCModelsForMake/` + value);
  }

  getBacktoQuestionVariant(makeId, modelId) {
    return this.http.get(
      `${environment.apiUrl}/api/v1/master/getPCVariantsForMakeAndModel/` + makeId + '/' + modelId,
    );
  }

  getPCVariantsForMakeAndModel(variantId, makeid) {
    return this.http.get(
      `${environment.apiUrl}/api/v1/master/getPCVariantsForMakeAndModel/` +
        makeid +
        '/' +
        variantId,
    );
  }

  getAllRtos() {
    return this.http.get(`${environment.apiUrl}/api/v1/master/getAllRtos`);
  }

  submitMotorQuote(data) {
    return this.http.post(`${environment.apiUrl}/api/v1/quote/submitMotorQuote`, data);
  }

  submitLifeQuote(data) {
    return this.http.post(`${environment.apiUrl}/api/v1/quote/submitLifeQuote`, data);
  }

  LifeProtectionQuote(data) {
    return this.http.post(`${environment.apiUrl}/api/v1/quote/submitLifeQuote`, data);
  }

  ChildplanQuote(data) {
    return this.http.post(`${environment.apiUrl}/api/v1/quote/submitLifeQuote`, data);
  }

  generateQRCode(appNo) {
    return this.http.get<string>(`${environment.apiUrl}/api/v1/policy/createQRCodeData/${appNo}`, {
      responseType: 'text' as 'json',
    });
  }

  getCustomerById(customerId) {
    return this.http.get(`${environment.apiUrl}/api/v1/customer/getCustomerById/${customerId}`);
  }

  getAllCustomer() {
    return this.http
      .get<Customer[]>(`${environment.apiUrl}/api/v1/customer/getAllCustomers`)
      .pipe(map((response) => response));
  }

  generateQuote(quoteInput) {
    return this.http.post(`${environment.apiUrl}/api/v1/quote/submitFireQuote`, quoteInput);
  }

  getTravelCountries() {
    return this.http.get(`${environment.apiUrl}/api/v1/master/getTravelCountries`);
  }

  postSubmitTravelQuote(travelQuote) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(`${environment.apiUrl}/api/v1/quote/submitTravelQuote`, travelQuote, {
      headers: headers,
    });
  }

  getPAOccupation() {
    return this.http.get(`${environment.apiUrl}/api/v1/master/getPAOccupation`);
  }

  getFromMaster(masterName, productId) {
    return this.http.get(`api/v1/master/getMasterCodes/${masterName}/${productId}`);
  }

  // handleCkyc(customer) {
  //   let dialogRef = this.dialog.open(CkycModalComponent, {
  //     data: {
  //       dob: customer.dob,
  //       fullName: customer.firstName + customer.lastName,
  //       gender: customer.gender,
  //     },
  //   });
  // }

  getCkyc(payload) {
    return this.http.post(`${environment.apiUrl}/api/v1/policy/getCKYCForInsurer`, payload);
  }
}
