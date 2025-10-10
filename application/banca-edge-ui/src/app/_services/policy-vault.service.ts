import { Injectable } from '@angular/core';
import { Observable, of, partition } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { Customer, PostalCode } from '@interface/Customer';
import { IndividualCustomer } from '@interface/Customer';
import { BusinessCustomer } from '@interface/Customer';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';
import { AccountService } from '@app/_services/account.service';
import { TokenService } from '.';
@Injectable({
  providedIn: 'root',
})
export class PolicyVaultService {
  checksum;

  token;

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  public get(): Observable<Customer[]> {
    this.token = this.tokenService.token;

    const headers = new HttpHeaders()
      .set('Accept', 'application/json')
      .set('Authorization', 'Basic ' + this.token);

    return this.http
      .get<Customer[]>(`${environment.apiUrl}/api/v1/customer/getAllCustomers`, {
        headers: headers,
      })
      .pipe(map((response) => response));
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

  // getApplicationForUser(pageIndex, pageSize, searchField?) {
  //   return this.http.get<any[]>(`${environment.apiUrl}/api/user/listUsersSearch`, );
  // }

  public getApplicationForUser(reqBody) {
    return this.http.post(
      `${environment.apiUrl}/api/v1/policy/getApplicationsForUser`,
      reqBody,
    );
  }

  public getPolicyApplicationForUser() {
    return this.http.get(`${environment.apiUrl}/api/v1/policy/getApplicationsForUser`);
  }

  public getRelationShip(productId, relationCode) {
    return this.http.get(
      `${environment.apiUrl}/api/v1/master/getMasterValue/Relationship/${productId}/${relationCode}`,
    );
  }

  public getCustomerPolicy(customerId) {
    return this.http.get(
      `${environment.apiUrl}/api/v1/policy/getApplicationsForCustomer/${customerId}`,
    );
  }

  public sendLeadToInsurer(appNo: any) {
    return this.http.get(`/api/v1/policy/sendLeadtoInsurer/${appNo}`);
  }

  // activities
  public getAllActivities() {
    return this.http.get(`${environment.apiUrl}/api/user/getAllActivities`);
  }

  public downloadProposalForm(applicationDetails) {
    return this.http.post(
      `${environment.apiUrl}/api/v1/policy/generatePDF`,
      applicationDetails,
    );
  }



  public getFnaBase64(applicationNo) {
    return this.http.get(`${environment.apiUrl}/api/v1/policy/encoded/pdf/${applicationNo}`);
  }

  public sendCustomerConsent(applicationNo) {
    return this.http.get(`${environment.apiUrl}/api/v1/policy/retriggeringConsent/${applicationNo}`);
  }

  public updateStatus(applicationDetails) {
    return this.http.post(`${environment.apiUrl}/api/v1/policy/updateStatus`, applicationDetails);
  }

  getAvailableProducts() {
    return this.http.get(`${environment.apiUrl}/api/v1/master/getAvailableProducts`);
  }

  getMasterCodesPolicyStatus() {
    return this.http.get(`${environment.apiUrl}/api/v1/master/getMasterCodes/PolicyStatus/BNCEDGE`);
  }

  checkPolicyStatus(policyNumber) {
    return this.http.get(`${environment.apiUrl}/api/v1/policy/checkPolicyStatus/${policyNumber}`);
  }

  getAllowedBranchesForUser() {
    return this.http.get(`${environment.apiUrl}/api/v1/master/getAllowedBranches`);
  }
  issueCisPolicy(appNo) {
    return this.http.get(`${environment.apiUrl}/api/v1/lms/issueCISApplication/${appNo}`);
  }
  getAllowedOrgForUser() {
    return this.http.get(`${environment.apiUrl}/api/user/getAllowedOrgForUser`);
  }
  getCidfForLead(leadId) {
    return this.http.get(`${environment.apiUrl}/api/v1/policy/generateDCBPDF/${leadId}`);
  }
}
