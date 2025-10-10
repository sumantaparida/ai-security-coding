import { Injectable } from '@angular/core';
import { UserModel } from './model/user-info.model';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';
import { TokenService } from '@app/_services/token.service';

@Injectable()
export class UserDataService {
  userInfo = new UserModel();

  displayInfo = new UserModel();

  currentCustomerId;

  token;

  onStateChange: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  onScoreChange: BehaviorSubject<Number> = new BehaviorSubject<Number>(0);

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  setUserInfo(key: string, value) {
    this.userInfo[key] = value;
  }

  setDisplayInfo(key: string, value) {
    this.displayInfo[key] = value;
  }
  // setCustomerId(customerId){
  //   this.currentCustomerId = customerId;
  // }

  // getCustomerId(){
  //   return this.currentCustomerId;
  // }

  getUserInfo() {
    return this.userInfo;
  }

  getDisplayInfo() {
    return this.displayInfo;
  }

  isUserDataValid() {
    if (
      this.userInfo &&
      this.userInfo.gender &&
      this.userInfo.age &&
      this.userInfo.maritalStatus &&
      this.userInfo.riskType !== '' &&
      this.userInfo.annualIncome
    ) {
      return true;
    } else {
      return false;
    }
  }

  needAnalysisData(data, customerId) {
    this.token = this.tokenService.token;
    const headers = new HttpHeaders()
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer' + this.token)
      .set('Content-Type', 'application/json');
    return this.http.post(`${environment.apiUrl}/api/v1/customer/createPlan/${customerId}`, data, {
      headers: headers,
    });
  }

  getCustomerById(customerId) {
    this.token = this.tokenService.token;
    const headers = new HttpHeaders()
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer' + this.token)
      .set('Content-Type', 'application/json');
    return this.http.get(`${environment.apiUrl}/api/v1/customer/getCustomerById/${customerId}`, {
      headers: headers,
    });
  }

  getAvailablePlansForCustomer(customerId) {
    return this.http.get(
      `${environment.apiUrl}/api/v1/customer/getAvailablePlansForCustomer/${customerId}`,
    );
  }

  sendOtp(otpData) {
    return this.http.post(`${environment.apiUrl}/api/v1/customer/sendDcbProfileOTP`, otpData);
  }

  riskProfileQuestions() {
    return this.http.get(`${environment.apiUrl}/api/v1/master/getRiskProfileQuestions`);
  }

  checkNeedAnalysis(data) {
    return this.http.post(`${environment.apiUrl}/api/v1/customer/checkNeedAnalysis`, data);
  }
}
