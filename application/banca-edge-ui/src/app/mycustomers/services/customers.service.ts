import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Customer, PostalCode } from '@interface/Customer';
// import { IndividualCustomer } from '@interface/Customer';
// import { BusinessCustomer } from '@interface/Customer';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';
// import { AccountService } from '@app/_services/account.service';
import { TokenService } from '../../_services';
@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  checksum;

  token;

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  public get(): Observable<Customer[]> {
    this.token = this.tokenService.token;

    return this.http
      .get<Customer[]>(`${environment.apiUrl}/api/v1/customer/getAllCustomers`)
      .pipe(map((response) => response));
  }

  getCustomerByMobile(mobileNo) {
    return this.http
      .get<Customer[]>(`${environment.apiUrl}/api/v1/customer/getCustomerByMobile/${mobileNo}`)
      .pipe(map((response) => response));
  }

  getCustomerInfofromBanks(customerInfo) {
    return this.http.post(
      `${environment.apiUrl}/api/v1/customer/getCustomerfromBank`,
      customerInfo,
    );
  }

  // getCustomerfromBanksdasdasdasdasd(customerInfo) {
  //   return this.http.post(
  //     `${environment.apiUrl}/api/v1/customer/getCustomerfromBank`,
  //     customerInfo,
  //   );
  // }

  getCustomerByCif(bankCustomerId) {
    return this.http
      .get<Customer[]>(
        `${environment.apiUrl}/api/v1/customer/getCustomerByBankId/${bankCustomerId}`,
      )
      .pipe(map((response) => response));
  }

  public getCustomerById(customerId: number): Observable<Customer[]> {
    this.token = this.tokenService.token;

    return this.http
      .get<Customer[]>(`${environment.apiUrl}/api/v1/customer/getCustomerById/${customerId}`)
      .pipe(map((response) => response));
  }

  public addCustomer(body: string): Observable<Customer> {
    this.token = this.tokenService.token;

    const headers = new HttpHeaders()
      .set('Accept', 'application/json')
      // .set('Authorization', 'Basic ' + this.token)
      .set('Content-Type', 'application/json');

    return this.http
      .post<Customer>(`${environment.apiUrl}/api/v1/customer/addCustomer`, body, {
        headers: headers,
      })
      .pipe(
        map((response) => {
          return response;
        }),
      );
  }

  public updateCustomer(body: string, customerId: number): Observable<Customer> {
    this.token = this.tokenService.token;

    const headers = new HttpHeaders()
      .set('Accept', 'application/json')
      .set('Authorization', 'Basic ' + this.token)
      .set('Content-Type', 'application/json');

    return this.http
      .post<Customer>(`${environment.apiUrl}/api/v1/customer/updateCustomer/${customerId}`, body, {
        headers: headers,
      })
      .pipe(
        map((response) => {
          return response;
        }),
      );
  }

  public removeAddress(customerId: number, addressId: number): Observable<Customer> {
    this.token = this.tokenService.token;

    const headers = new HttpHeaders()
      .set('Accept', 'application/json')
      .set('Authorization', 'Basic ' + this.token)
      .set('Content-Type', 'application/json');

    return this.http
      .get<Customer>(
        `${environment.apiUrl}/api/v1/customer/removeAddress/${customerId}/address/${addressId}`,
        { headers: headers },
      )
      .pipe(
        map((response) => {
          return response;
        }),
      );
  }

  public removeContact(customerId: number, contactId: number): Observable<Customer> {
    this.token = this.tokenService.token;

    const headers = new HttpHeaders()
      .set('Accept', 'application/json')
      .set('Authorization', 'Basic ' + this.token)
      .set('Content-Type', 'application/json');

    return this.http
      .get<Customer>(
        `${environment.apiUrl}/api/v1/customer/removeContact/${customerId}/contact/${contactId}`,
        { headers: headers },
      )
      .pipe(
        map((response) => {
          return response;
        }),
      );
  }

  public removeDependents(customerId: number, dependentId: number): Observable<Customer> {
    this.token = this.tokenService.token;

    const headers = new HttpHeaders()
      .set('Accept', 'application/json')
      .set('Authorization', 'Basic ' + this.token)
      .set('Content-Type', 'application/json');

    return this.http
      .get<Customer>(
        `${environment.apiUrl}/api/v1/customer/removeDependents/${customerId}/dependent/${dependentId}`,
        { headers: headers },
      )
      .pipe(
        map((response) => {
          return response;
        }),
      );
  }

  public addDependent(customerId: number, body: string): Observable<Customer> {
    this.token = this.tokenService.token;

    const headers = new HttpHeaders()
      .set('Accept', 'application/json')
      .set('Authorization', 'Basic ' + this.token)
      .set('Content-Type', 'application/json');

    return this.http
      .post<Customer>(`${environment.apiUrl}/api/v1/customer/addDependent/${customerId}`, body, {
        headers: headers,
      })
      .pipe(
        map((response) => {
          return response;
        }),
      );
  }

  public addAddress(customerId: number, body: string): Observable<Customer> {
    this.token = this.tokenService.token;

    // const headers = new HttpHeaders()
    //   .set('Accept', 'application/json')
    //   .set('Authorization', 'Basic ' + this.token)
    //   .set('Content-Type', 'application/json');

    return this.http
      .post<Customer>(`${environment.apiUrl}/api/v1/customer/addAddress/${customerId}`, body)
      .pipe(
        map((response) => {
          return response;
        }),
      );
  }

  public addContact(customerId: number, body: string): Observable<Customer> {
    this.token = this.tokenService.token;

    // const headers = new HttpHeaders()
    //   .set('Accept', 'application/json')
    //   .set('Authorization', 'Basic ' + this.token)
    //   .set('Content-Type', 'application/json');

    return this.http
      .post<Customer>(`${environment.apiUrl}/api/v1/customer/addContact/${customerId}`, body)

      .pipe(
        map((response) => {
          return response;
        }),
      );
  }

  public getPinData(val: string): Observable<PostalCode> {
    this.token = this.tokenService.token;

    const headers = new HttpHeaders()
      .set('Accept', 'application/json')
      .set('Authorization', 'Basic ' + this.token);

    return this.http
      .get<PostalCode>(`${environment.apiUrl}/api/v1/master/getPinData/${val}`, {
        headers: headers,
      })
      .pipe(map((response) => response));
  }

  getQuickQuote() {
    return this.http.get(`${environment.apiUrl}/api/v1/master/getAvailablePlans `);
  }

  getCISQuickQuote() {
    return this.http.get(`${environment.apiUrl}/api/v1/master/getOfflinePlans `);
  }

  getCustomerfromBank(cifNo) {
    return this.http.get(`${environment.apiUrl}/api/v1/customer/getCustomerfromBank/${cifNo}`);
  }

  getAllowedBranches() {
    this.token = this.tokenService.token;

    const headers = new HttpHeaders()
      .set('Accept', 'application/json')
      .set('Authorization', 'Basic ' + this.token);

    return this.http
      .get(`${environment.apiUrl}/api/v1/master/getAllowedBranches`, { headers: headers })
      .pipe(map((response) => response));
  }

  getRelationship() {
    return this.http.get(
      `${environment.apiUrl}/api/v1/master/getMasterCodes/Relationship/Customer`,
    );
  }

  getAvailablePlansForCustomer(customerId) {
    return this.http.get(
      `${environment.apiUrl}/api/v1/customer/getAvailablePlansForCustomer/${customerId}`,
    );
  }

  getCustomerbyBank(customerInfo) {
    return this.http.post(
      `${environment.apiUrl}/api/v1/customer/getCustomerfromBank`,
      customerInfo,
    );
  }

  getAllowedOrgForUser() {
    return this.http.get(`${environment.apiUrl}/api/user/getAllowedOrgForUser`);
  }

  checkCustomerKYC(body) {
    return this.http.post(`${environment.apiUrl}/api/v1/kblUsgi/checkCustomerKyc`, body);
  }

  fetchSIbCustomer(payload) {}
  // commenting as flow changed
  // sendCustomerConsent(accountInfo) {
  //   return this.http.post(
  //     `${environment.apiUrl}/api/v1/customer/sib/sendCustomerConsent`,
  //     accountInfo,
  //   );
  // }

  validateCustomerConsent(concent) {
    return this.http.post(
      `${environment.apiUrl}/api/v1/customer/sib/validateCustomerConsent`,
      concent,
    );
  }

  checkCkycDcb(payload) {
    return this.http.post(`${environment.apiUrl}/api/v1/customer/getKycFromBank`, payload);
  }
}
