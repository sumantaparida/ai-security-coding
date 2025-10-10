import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';
import { TokenService } from '@app/_services/token.service';

@Injectable()
export class SharedServiceComponent {
  constructor(private http: HttpClient, private tokenService: TokenService) {}

  validateOTP(otpKey, otp) {
    return this.http.post(`${environment.apiUrl}/api/v1/customer/validateDCBProfile`, {
      otpKey,
      otp,
    });
  }

  validateLmsOtp(otpKey, otp) {
    return this.http.post(`${environment.apiUrl}/api/v1/lms/validateOtp`, { otpKey, otp });
  }

  validateDcbLmsOtp(otpKey, otp, appNo) {
    return this.http.post(`${environment.apiUrl}/api/v1/customer/validateDCBProfile`, {
      otpKey,
      otp,
      appNo,
    });
  }

  validateLoginOtp(otpKey, otp) {
    // console.log('otp key', otpKey, ' otp', otp);
    let value = window.btoa(otpKey + ':' + otp);
    return this.http.post(`${environment.apiUrl}/api/v1/policy/validateLoginOtp`, {
      value,
    });
  }

  validateForgotPasswordOtp(data) {
    return this.http.post(`${environment.apiUrl}/api/user/validateOtp`, data);
  }

  // validateDcbOtp(otpKey, otp) {
  //   return this.http.post(`${environment.apiUrl}/api/v1/customer/sendDcbProfileOTP`, {
  //     otpKey,
  //     otp,
  //   });
  // }

  generateMagicLink() {
    return this.http.get(`${environment.apiUrl}/api/user/generateMagicLink`);
  }

  getPospUserList(data) {
    return this.http.post(`${environment.apiUrl}/api/partner/fetchPospUsers`, data);
  }

  getAllBranchesForUser() {
    return this.http.get(`${environment.apiUrl}/api/v1/master/getMasters/Branch`);
  }

  sendOtp(otpData) {
    return this.http.post(`${environment.apiUrl}/api/v1/lms/sendOtp`, otpData);
  }
  // sendLmsConsentOtp(token) {
  //   return this.http.get(`${environment.apiUrl}/api/v1/lms/sendCustomerConsent/${token}`);
  // }

  // validateCustomerConsent(payload) {
  //   return this.http.post(`${environment.apiUrl}/api/v1/lms/validateCustomerConsent`, payload);
  // }

  sendLoginOtp(userName) {
    return this.http.get(`${environment.apiUrl}/api/v1/policy/sendLoginOtp/${userName}`);
  }
}
