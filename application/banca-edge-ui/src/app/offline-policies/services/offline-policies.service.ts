import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { TokenService } from '@app/_services/token.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, interval, Observable, Subject, Subscription, timer } from 'rxjs';
import { PostalCode } from '@app/interface/Customer';
import { map, retry, share, switchMap, takeUntil } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class OfflinePoliciesService {
    token;
    private healthHospPaymentSuccess: Subscription;
    private successResponse: Subject<any> = new Subject<any>();

    constructor(private http: HttpClient, private tokenService: TokenService) { }

    getOfflinePlans(){
        return this.http.get(`${environment.apiUrl}/api/v1/master/getOfflinePlans `);
    }

    getQuickQuote() {
        return this.http.get(`${environment.apiUrl}/api/v1/master/getAvailablePlans `);
      }

    getCustomerById(customerId) {
        return this.http.get(`${environment.apiUrl}/api/v1/customer/getCustomerById/${customerId}`);
    }

    getOfflineInsurers(){
        return this.http.get(`${environment.apiUrl}/api/v1/master/getOfflineInsurers`);
    }

    getSpDetailsForUser(){
        return this.http.get(`${environment.apiUrl}/api/v1/master/getSpDetailsForUser`);
    }

    getOfflineProductsForInsurer(insurerId) {
        return this.http.get(`${environment.apiUrl}/api/v1/master/getOfflineProductsForInsurer/${insurerId}`);
    }

    getProductsByProductType(lob, productType){
        return this.http.get(`${environment.apiUrl}/api/v1/master/getProductsByProductType/${lob}/${productType}`);
    }

    getProductsByProductTypeInsurer(lob, productType, insurerId) {
        return this.http.get(`${environment.apiUrl}/api/v1/master/getProductsByProductTypeInsurer/${lob}/${productType}/${insurerId}`);
    }

    getTitle(productId) {
        return this.http.get(`${environment.apiUrl}/api/v1/master/getMasterCodes/Title/${productId}`);
    }

    getMaritalStatus(productId) {
        return this.http.get(`${environment.apiUrl}/api/v1/master/getMasterCodes/maritalstatus/${productId}`);
    }

    getOccupation(productId) {
        return this.http.get(`${environment.apiUrl}/api/v1/master/getMasterCodes/occupation/${productId}`);
    }

    getRelationship(productId) {
        return this.http.get(`${environment.apiUrl}/api/v1/master/getMasterCodes/Relationship/${productId}`);
    }

    getNomineeRel(productId) {
        return this.http.get(`${environment.apiUrl}/api/v1/master/getMasterCodes/NomineeRelationship/${productId}`);
    }

    getApplicationbyApplicationNo(appNo) {
        return this.http.get(`${environment.apiUrl}/api/v1/policy/getApplicationbyApplicationNo/${appNo}`);
    }

    saveApplication(data) {
        return this.http.post(`${environment.apiUrl}/api/v1/policy/saveApplication/`, data);
    }

    submitApplication(data) {
        return this.http.post(`${environment.apiUrl}/api/v1/policy/submitOfflineApplication`, data);
    }

    getCityAndState(pincode: string) {
        return this.http.get<PostalCode>(`${environment.apiUrl}/api/v1/master/getPinData/${pincode}`);
    }

    getPolicyApplicationForUser() {
        return this.http.get(`${environment.apiUrl}/api/v1/policy/getOfflineApplicationsForUser`);
    }

    getOfflineApplicationByAppNo(appNo){
        return this.http.get(`${environment.apiUrl}/api/v1/policy/getOfflineApplicationByAppNo/${appNo}`);
    }

    updateOfflineApplication(data){
        return this.http.post(`${environment.apiUrl}/api/v1/policy/updateOfflineApplication`, data);
    }

    getAccountDetails(cifNumber) {
        return this.http.get(`${environment.apiUrl}/api/v1/payment/getAccountsforCustomer/${cifNumber}`);
    }

    getLGData(data){
        return this.http.post(`${environment.apiUrl}/api/user/listLgForBranch`, data);
    }

}
