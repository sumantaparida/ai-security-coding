/* eslint-disable @typescript-eslint/no-useless-constructor */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PostalCode } from '@app/interface/Customer';
import { TokenService } from '@app/_services';
import { environment } from '@environments/environment';
import { Subscription, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LmsService {
  token;

  private healthHospPaymentSuccess: Subscription;

  private successResponse: Subject<any> = new Subject<any>();

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  getCustomerById(customerId) {
    return this.http.get(`${environment.apiUrl}/api/v1/customer/getCustomerById/${customerId}`);
  }

  getOfflineInsurers() {
    return this.http.get(`${environment.apiUrl}/api/v1/master/getOfflineInsurers`);
  }

  getOfflineInsurersDcb(life) {
    return this.http.get(`${environment.apiUrl}/api/v1/master/getOfflineInsurers/${life}`);
  }

  getMasterCodesPolicyStatus() {
    return this.http.get(`${environment.apiUrl}/api/v1/master/getMasterCodes/PolicyStatus/BNCEDGE`);
  }

  getOfflineApplicationByAppNo(appNo) {
    return this.http.get(`${environment.apiUrl}/api/v1/policy/getLmsApplicationByAppNo/${appNo}`);
  }

  getOfflinePlans(insurerId) {
    return this.http.get(
      `${environment.apiUrl}/api/v1/master/getOfflinePlansForInsurer/${insurerId} `,
    );
  }

  getQuickQuote() {
    return this.http.get(`${environment.apiUrl}/api/v1/master/getAvailablePlans `);
  }

  getSpDetailsForUser(orgCode) {
    if (orgCode === 'SIB') {
      return this.http.get(`${environment.apiUrl}/api/v1/master/getSpsForSIB`);
    } else {
      return this.http.get(`${environment.apiUrl}/api/v1/master/getSpDetailsForUser`);
    }
  }

  getSpForSIB() {
    return this.http.get(`${environment.apiUrl}/api/v1/master/getSpsForSIB`);
  }

  getFlsForUser(insurerId, spCode) {
    return this.http.get(`${environment.apiUrl}/api/v1/lms/${insurerId}/flsFromSp/${spCode}`);
  }

  getOfflineProductsForInsurer(insurerId) {
    return this.http.get(
      `${environment.apiUrl}/api/v1/master/getOfflineProductsForInsurer/${insurerId}`,
    );
  }

  getProductsByProductType(lob, productType) {
    return this.http.get(
      `${environment.apiUrl}/api/v1/master/getProductsByProductType/${lob}/${productType}`,
    );
  }

  getProductsByProductTypeInsurer(lob, productType, insurerId) {
    return this.http.get(
      `${environment.apiUrl}/api/v1/master/getProductsByProductTypeInsurer/${lob}/${productType}/${insurerId}`,
    );
  }

  getTitle(productId) {
    return this.http.get(`${environment.apiUrl}/api/v1/master/getMasterCodes/Title/${productId}`);
  }

  getMaritalStatus(productId) {
    return this.http.get(
      `${environment.apiUrl}/api/v1/master/getMasterCodes/maritalstatus/${productId}`,
    );
  }

  getStatusDropDown(){
    return this.http.get(
      `${environment.apiUrl}/api/v1/master/getMasters/Lead_Status`,
    );
  }

  getGender(productId) {
    return this.http.get(`${environment.apiUrl}/api/v1/master/getMasterCodes/Gender/${productId}`);
  }

  getOccupation(productId) {
    return this.http.get(
      `${environment.apiUrl}/api/v1/master/getMasterCodes/occupation/${productId}`,
    );
  }

  getRelationship(productId) {
    return this.http.get(
      `${environment.apiUrl}/api/v1/master/getMasterCodes/Relationship/${productId}`,
    );
  }

  getNomineeRel(productId) {
    return this.http.get(
      `${environment.apiUrl}/api/v1/master/getMasterCodes/NomineeRelationship/${productId}`,
    );
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
    return this.http.post(`${environment.apiUrl}/api/v1/policy/submitLmsApplication`, data);
  }

  uploadDocument(toUpload) {
    // const headers = new HttpHeaders({
    //   'Access-Control-Allow-Origin': '*',
    //   'Content-Type': 'multipart/form-data',
    // });
    // .set('Content-Type', 'application/json');

    return this.http.post(`${environment.apiUrl}/api/v1/policy/uploadLeadDocuments`, toUpload);
  }

  // HttpHeaders({
  //   //   'Accept': 'application/json',
  //   //   'Access-Control-Allow-Origin': '*',
  //   //   'Content-Type': 'application/x-www-form-urlencoded',
  //   // });

  getUploadedDocuments(leadId) {
    return this.http.get(`${environment.apiUrl}/api/v1/policy/getFiles/${leadId}`);
  }

  downloadDocument(leadId, docName) {
    return this.http.get(`${environment.apiUrl}/api/v1/policy/download/${leadId}/${docName}`);
  }

  getCityAndState(pincode: string) {
    return this.http.get<PostalCode>(`${environment.apiUrl}/api/v1/master/getPinData/${pincode}`);
  }

  getPolicyApplicationForUser() {
    return this.http.get(`${environment.apiUrl}/api/v1/policy/getOfflineApplicationsForUser`);
  }

  getLeadsForUserNew(payload) {
    return this.http.post(`${environment.apiUrl}/api/v1/policy/getLeadsForUser`, payload);
  }

  getPolicyStatus() {
    return this.http.get(`${environment.apiUrl}/api/v1/master/getMasterCodes/cisStatus/KBL`);
  }

  getLeadsForUser() {
    return this.http.get(`${environment.apiUrl}/api/v1/policy/getLeadsForUser`);
  }

  flsFromSp(insurerId, spCode) {
    return this.http.get(`${environment.apiUrl}/api/v1/policy/${insurerId}/flsFromSp/${spCode}`);
  }

  updateLmsApplication(data) {
    return this.http.post(`${environment.apiUrl}/api/v1/policy/updateLmsApplication`, data);
  }

  updateRiskProfileStatus(payload) {
    return this.http.post(`${environment.apiUrl}/api/v1/policy/updateRiskProfileStatus`, payload);
  }

  getAccountDetails(cifNumber) {
    return this.http.get(
      `${environment.apiUrl}/api/v1/payment/getAccountsforCustomer/${cifNumber}`,
    );
  }

  getLGData(data) {
    return this.http.post(`${environment.apiUrl}/api/user/listLgForBranch`, data);
  }

  sendLeadDataToInsurer(leadAppNo) {
    return this.http.get(`${environment.apiUrl}/api/v1/policy/sendLeadDataToInsurer/${leadAppNo}`);
  }

  triggerOptOutSms(data) {
    return this.http.post(`${environment.apiUrl}/api/v1/lms/sendOptOutSms`, data);
  }

  sendDcbOtp(otpData) {
    return this.http.post(`${environment.apiUrl}/api/v1/customer/sendDcbProfileOTP`, otpData);
  }

  sendKKblOtp(otpData) {
    console.log(otpData);
    return this.http.post(`${environment.apiUrl}/api/user/sendKblOTP`, otpData);
  }

  sendOtp(otpData) {
    return this.http.post(`${environment.apiUrl}/api/v1/lms/sendOtp`, otpData);
  }

  checkPolicyStatus(appNo, insurerCode) {
    return this.http.get(
      `${environment.apiUrl}/api/v1/lms/checkPolicyStatus/${appNo}/${insurerCode}`,
    );
  }

  checkLeadStatus(appNo) {
    return this.http.get(`${environment.apiUrl}/api/v1/lms/leadApplicationsFetch/${appNo}`);
  }

  checkCisStatus(appNo) {
    return this.http.get(`${environment.apiUrl}/api/v1/lms/checkCISStatus/${appNo}`);
  }

  getAllowedBankBranchesforInsurerUser(orgCode) {
    return this.http.get(
      `${environment.apiUrl}/api/user/getAllowedBankBranchesforInsurerUser/${orgCode}`,
    );
  }

  initiateCisDebit(payload) {
    return this.http.post(`${environment.apiUrl}/api/v1/payment/initiateCISDebit`, payload);
  }

  getPolicyPdfFromInsurer(leadId) {
    return this.http.get(`${environment.apiUrl}/api/v1/lms/getPolicyPdfFromInsrer/${leadId}`);
  }

  sendLmsPaymentDetailsToInsurer(leadId) {
    return this.http.get(`/api/v1/lms/sendLmsPaymentDetailsToInsurer/${leadId}`);
  }

  checkNeedAnalysis(data) {
    return this.http.post(`${environment.apiUrl}/api/v1/customer/checkNeedAnalysis`, data);
  }

  getCidfForLead(leadId) {
    return this.http.get(`${environment.apiUrl}/api/v1/policy/generateDCBPDF/${leadId}`);
  }
  resendCustomerConsent(leadId) {
    return this.http.get(`${environment.apiUrl}/api/v1/policy/resendConsent/${leadId}`);
    // /api/v1/policy/resendConsent/{leadId}
  }
}
