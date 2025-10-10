import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { User } from '@app/_models';
import { BehaviorSubject } from 'rxjs';
import { aesDecrypt, aesEncrypt } from '@app/shared/utils/aesEncrypt';

@Injectable({ providedIn: 'root' })
export class UserService {
  user: BehaviorSubject<User> = new BehaviorSubject<User>(this.getUser());

  constructor(private http: HttpClient) {}

  getUser(): User {
    const userString = aesDecrypt(sessionStorage.getItem('user'));
    let userObj: User = null;
    if (userString && userString.length > 0) {
      userObj = Object.assign(new User(), JSON.parse(userString));
    }
    return userObj;
  }

  validateCifWithMobile(reqBody) {
    return this.http.post(`${environment.apiUrl}/api/v1/customer/validateCustomer`, reqBody);
  }

  setUser(newUser: User) {
    if (newUser) {
      sessionStorage.removeItem('user');
      sessionStorage.setItem('user', aesEncrypt(newUser));
      this.user.next(newUser);
    }
  }

  removeUser() {
    sessionStorage.removeItem('user');
    this.user.next(null);
  }

  validateCustomerWithOtp(otpKey, otp) {
    const reqBody = {
      otpKey,
      otp,
    };
    return this.http.post(`${environment.apiUrl}/api/v1/customer/validateCustomerWithOtp`, reqBody);
  }
}
