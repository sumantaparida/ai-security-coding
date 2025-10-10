import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, interval, Observable, Subject, Subscription, throwError } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';
import * as Forge from 'node-forge';

import { environment } from '@environments/environment';
import { User } from '@app/_models';
import { TokenService } from './token.service';
import { CookieService } from 'ngx-cookie-service';
import * as crypto from 'crypto-js';
import { aesDecrypt, aesEncrypt } from '@app/shared/utils/aesEncrypt';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private userSubject: BehaviorSubject<User>;

  // private newUserSubject: BehaviorSubject<User>;

  public user: Observable<User>;

  private token: string;

  public isBranchUser;

  public orgCode;

  username;

  password;

  isInsurer;

  organizationCode;

  isUamUser;

  isAdminUser;

  expiresAt: Date;

  expiryTime;

  isSP;

  currentExpiryTime = null;

  checkExpirySubscription: Subscription;

  private userLoggedIn = new Subject<boolean>();

  public expiresAtSubject = new BehaviorSubject<any>('');

  secondsLeft: Subject<any> = new Subject<any>();

  // expiryTime: Subject<any> = new Subject<any>();

  isUserLoggedIn: boolean;

  constructor(
    private router: Router,
    private http: HttpClient,
    private tokenService: TokenService,
    private cookie: CookieService,
  ) {
    this.userSubject = new BehaviorSubject<User>(aesDecrypt(sessionStorage.getItem('user')));
    console.log('user', this.userSubject.value);
    if (this.userSubject.value) {
      if (this.userSubject.value['bankCustomer'] === false) {
        this.isBranchUser =
          this.userSubject.value['bankCustomer'] === false &&
          this.userSubject.value['insurerUser'] === false;
      } else {
        this.isBranchUser =
          this.userSubject.value['bankCustomer'] == 'false' &&
          this.userSubject.value['insurerUser'] == 'false';
      }
      console.log('inisnde construcoir', this.isBranchUser);
    }
    this.user = this.userSubject.asObservable();
    console.log('bank user', this.isBranchUser);
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  changePassword(data) {
    const user = aesDecrypt(sessionStorage.getItem('user'));
    JSON.stringify(user);
    return this.http.post(`${environment.apiUrl}/api/user/changePassword`, data);
  }

  getNotificationList() {
    const user = aesDecrypt(sessionStorage.getItem('user'));
    JSON.stringify(user);
    const token = window.btoa(user + ':' + user);
    return this.http.get(`${environment.apiUrl}/api/v1/notification/getActiveUserNotifications`);
  }

  // resetPassword(username) {
  //   return this.http.get(`${environment.apiUrl}/api/user/forgotPassword/${username}`).pipe(
  //     map((response) => {
  //       return response;
  //     }),
  //   );
  // }
  resetPassword(username) {
    const payload = { userName: username };
    return this.http.post(`${environment.apiUrl}/api/user/forgotPassword`, payload).pipe(
      map((response) => {
        return response;
      }),
    );
  }

  sendOtpOnForgotPassword(userName) {
    let payload = {
      userName: userName,
    };

    return this.http.post(`${environment.apiUrl}/api/user/sendOtp`, payload);
  }

  markNotificationRead(data) {
    return this.http.post(`${environment.apiUrl}/api/v1/notification/markNotificationRead`, data);
  }

  registerCustomer(customerInfo) {
    return this.http.post(`${environment.apiUrl}/api/user/registerDirectCustomer`, customerInfo);
  }

  getMenuItems() {
    return this.http.get(`${environment.apiUrl}/api/v1/master/getMenuForOrg`);
  }

  login(username, password) {
    this.username = username;
    this.password = password;
    this.token = btoa(username + ':' + password);
    // let base64Secret = btoa(username + ':' + password);
    // console.log(base64Secret);
    // let publickey =
    //   '-----BEGIN PUBLIC KEY-----\n' +
    //   'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCtM/bjcaRF4oUv9WLYQe8NAkxJ\n' +
    //   'a7J1yPpHyFLGV+fShPr5qrpO1j6zI9x9V1B4G+MDqyXmX3YVAIndq0Oc2RsOtHqV\n' +
    //   '2mblfjqRFfM7RKwFFGiQZL/qLR6XzpmjqHZsauXu+yvOb3MD7mn9Pb5h1ylJB7UB\n' +
    //   'Y76r7BKVAoEvsRDvdwIDAQAB\n' +
    //   '-----END PUBLIC KEY-----';
    // const rsa = Forge.pki.publicKeyFromPem(publickey);
    // var plaintextBytes = Forge.util.encodeUtf8(base64Secret);
    // var encryptedBytes = rsa.encrypt(plaintextBytes);
    // this.token = Forge.util.encode64(encryptedBytes);

    const secretKey = 'ysecretkeyyy098!';

    const loginDataEncrypt = crypto.AES.encrypt(this.token, secretKey.trim()).toString();
    console.log('encrypt', loginDataEncrypt);
    const headers = new HttpHeaders()
      .set('Accept', 'application/json')
      .set('Authorization', 'Basic ' + loginDataEncrypt);

    return this.http
      .get<User>(`${environment.apiUrl}/api/user/login?data=${new Date().getTime()}`, {
        headers,
        observe: 'response',
      })
      .pipe(
        map((apiuser) => {
          const authHeader = apiuser.headers.get('Authorization');
          if (authHeader.indexOf('Bearer ') > -1) {
            this.token = authHeader.substring(7, authHeader.length);
          } else {
            throwError({ message: 'Invalid user or password' });
          }

          this.tokenService.token = true;
          this.isUserLoggedIn = true;
          this.setUserLoggedIn(true);
          if (apiuser.body.responseCode == 0) {
            // this.tokenService.token = this.cookie.get('token');
            if (!apiuser.body.otpValidationRequired) {
              this.setUser(apiuser.body);
            }
            // localStorage.setItem('user', JSON.stringify(apiuser.body));
            // this.userSubject.next(JSON.parse(JSON.stringify(apiuser.body)));

            return apiuser.body;
          } else if ((apiuser.body.orgCode == "SB" || apiuser.body.orgCode == "SIB")  && (apiuser.body.responseCode == 0 || apiuser.body.responseCode == 2)) {
            // this.tokenService.token = this.cookie.get('token');
            if (!apiuser.body.otpValidationRequired) {
              this.setUser(apiuser.body);
            }
            // localStorage.setItem('user', JSON.stringify(apiuser.body));
            // this.userSubject.next(JSON.parse(JSON.stringify(apiuser.body)));

            return apiuser.body;
          } else if (apiuser.body.responseCode == 402) {
            // let user = await aesDecrypt(userEncrpted.payload);
            let user = apiuser.body['payload'];
            sessionStorage.setItem('user', aesEncrypt(JSON.stringify(user)));

            // this.userSubject.next(JSON.parse(JSON.stringify(user)));

            return apiuser.body;
          }
        }),
      );
  }

  async setUser(userEncrpted) {
    let user = await aesDecrypt(userEncrpted.payload);

    console.log('user==--', user);
    if (user['bankCustomer'] === false) {
      this.isBranchUser = user['bankCustomer'] === false && user['insurerUser'] === false;
    } else {
      this.isBranchUser = user['bankCustomer'] == 'false' && user['insurerUser'] == 'false';
    }
    this.isInsurer = user['insurerUser'];
    this.isSP = user['isSP'];
    this.organizationCode = user['organizationCode'];

    this.isAdminUser = user['userGroups'].includes('ADMIN') ? true : false;
    this.isUamUser = user['userGroups'].includes('UAM_USER') ? true : false;
    console.log('TODAY', this.isAdminUser, this.isUamUser);
    sessionStorage.setItem('user', aesEncrypt(JSON.stringify(user)));
    // console.log('coming in setUser', sessionStorage.getItem('user'));
    this.userSubject.next(JSON.parse(JSON.stringify(user)));
    // this.isBranchUser = this.userSubject.value['bankCustomer'] == 'false' && this.userSubject.value['insurerUser'] == 'false';
    console.log('coming in setUser', this.isBranchUser);
  }

  validateToken(token) {
    return this.http.get(`${environment.apiUrl}/api/user/validateBankToken`);
  }

  // public get newUserValue(): User {
  //   let user =
  //   return this.newUserSubject.value;
  // }

  getBranchByBranchCode() {
    return this.http.get(`${environment.apiUrl}/api/v1/master/getBranchByBranchCode`);
  }

  changeExpiredPassword(payload) {
    // "oldPassword": "U2FsdGVkX18yKtigiFW6njMBZ0PKC5Jth5JRtTmjWzE=",
    // "newPassword": "U2FsdGVkX19RrmqeG6MiBVnNDcV2aP2h+4nIqM3U2W8=",
    // "matchingPassword": "U2FsdGVkX19RrmqeG6MiBVnNDcV2aP2h+4nIqM3U2W8=",
    // "userName":"U2FsdGVkX18vV30sJeU8plYfUffw1lfA5V8lQSBaCeY="

    return this.http.post(`${environment.apiUrl}/api/user/resetUserPassword`, payload);
  }

  logout() {
    // this.cookie.deleteAll();
    sessionStorage.setItem('user', null);
    if (this.isUserLoggedIn) {
      console.log('insinde loggde in');
      this.checkExpirySubscription?.unsubscribe();
    }

    return this.http.get(`${environment.apiUrl}/api/user/logout`).pipe(
      map((apiresponse) => {}),
      finalize(() => {
        this.cleanup();
      }),
    );
  }

  logoutDcb() {
    return this.http.get(`${environment.apiUrl}/api/user/logout`).pipe(
      map((apiresponse) => {}),
      finalize(() => {
        this.cleanup();
        return this.http.get(`${environment.apiUrl}/api/user/dcbLogout`);
      }),
    );
    // return this.http.get(`${environment.apiUrl}/api/user/dcbLogout`).pipe(
    //   finalize(() => {
    //     this.cleanup();
    //   }),
    // );
  }

  cleanup() {
    console.log('inisde clean up');
    console.log(window.location.host, 'host name');

    // localStorage.removeItem('user');
    sessionStorage.clear();
    this.tokenService.removeToken();
    this.isUserLoggedIn = false;

    // this.setUserLoggedIn(false);
    // this.cookie.delete('token');
    if (this.organizationCode === 'DCB') {
      this.userSubject.next(null);
      this.router.navigate(['/dcb']);
    } else {
      this.userSubject.next(null);
      if (window.location.host === 'insurance.dcbbank.com') {
        this.router.navigate(['/dcb']);
      } else {
        this.router.navigate(['/account/login']);
      }
    }
  }

  public get isUser(): boolean {
    const roles: string[] = this.userSubject.value.roles;
    if (this.userSubject.value) {
      return true;
    } else {
      return false;
    }
  }

  postEmailAssist(data) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(`${environment.apiUrl}/api/v1/master/createTicket`, data, { headers });
  }

  setUserLoggedIn(userLoggedIn: boolean) {
    this.userLoggedIn.next(userLoggedIn);
    if (userLoggedIn === true) {
      this.isUserLoggedIn = true;
      console.log('logged in treuslkdjhjkdfhghfdjkhgkjdfh');
    }
  }

  getUserLoggedIn(): Observable<boolean> {
    return this.userLoggedIn.asObservable();
  }

  public setExpiryTime(time) {
    // console.log('insinde set expiry', this.userLoggedIn);
    // console.log('inbsinde setexpiry');
    this.isUserLoggedIn = true;
    this.expiresAt = new Date(time);
    if (this.currentExpiryTime === null) {
      this.currentExpiryTime = this.expiresAt;
      this.checkExpiryTime(this.expiresAt);
      // console.log('1st time setting value of current', this.currentExpiryTime);
    } else if (this.currentExpiryTime !== this.expiresAt) {
      // console.log('insinde else if', this.currentExpiryTime, this.expiresAt);
      this.checkExpirySubscription.unsubscribe();
      this.checkExpiryTime(this.expiresAt);
    }

    // if (this.isUserLoggedIn) {
    //   console.log('inbsinde setexpiry');
    //   this.expiresAt = new Date(time);
    //   if (this.currentExpiryTime === null) {
    //     this.currentExpiryTime = this.expiresAt;
    //     this.checkExpiryTime(this.expiresAt);
    //     console.log('1st time setting value of current', this.currentExpiryTime);
    //   } else if (this.currentExpiryTime !== this.expiresAt) {
    //     console.log('insinde else if', this.currentExpiryTime, this.expiresAt);
    //     this.checkExpirySubscription.unsubscribe();
    //     this.checkExpiryTime(this.expiresAt);
    //   }
    // }

    // this.expiresAtSubject.next(time);
    // this.expiresAt = this.expiresAtSubject.asObservable();
    // console.log('t expires at', this.expiresAt);
  }

  checkExpiryTime(expiryTime) {
    this.currentExpiryTime = expiryTime;
    if (this.isUserLoggedIn) {
      this.checkExpirySubscription = interval(1000).subscribe((x) => {
        const timeNow = new Date(Date.now());
        let diff = (expiryTime.getTime() - timeNow.getTime()) / 1000;
        // diff /= 60;
        // console.log('minutes = ', Math.abs(Math.round(diff)));
        this.secondsLeft.next(Math.abs(Math.round(diff)));
        return Math.abs(Math.round(diff));
      });
    }
  }
}
