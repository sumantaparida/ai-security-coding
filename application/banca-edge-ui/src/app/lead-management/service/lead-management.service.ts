import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LeadManagementService {
  constructor(private http: HttpClient) {}

  getFromMaster(lob, productType) {
    return this.http.get(
      `${environment.apiUrl}/api/v1/master/getAvailableInsurers/${lob}/${productType}`,
    );
  }
  getSpCode( branchCode) {
    return this.http.get(
      `${environment.apiUrl}/api/v1/master/getMasterCodes/SpForInsurer/${branchCode}`,
    );
  }

  createLead(lead) {
    return this.http.post(`${environment.apiUrl}/api/v1/customer/createLead`, lead);
  }

  getLeads() {
    return this.http.get(`${environment.apiUrl}/api/v1/customer/getAllLeads`);
  }

  updateLead(lead) {
    return this.http.post(`${environment.apiUrl}/api/v1/customer/updateLead`, lead);
  }

  getProductsFromMaster(productType) {
    return this.http.get(
      `${environment.apiUrl}/api/v1/master/getOfflinePlansForInsurer/${productType}`,
    );
  }
}
