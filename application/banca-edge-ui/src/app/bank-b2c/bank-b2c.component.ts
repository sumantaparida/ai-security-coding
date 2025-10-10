import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { aesEncrypt } from '@app/shared/utils/aesEncrypt';
import { AccountService, TokenService } from '@app/_services';
import { LoaderService } from '@app/_services/loader.service';
import { CookieService } from 'ngx-cookie-service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-bank-b2c',
  templateUrl: './bank-b2c.component.html',
  styleUrls: ['./bank-b2c.component.css'],
})
export class BankB2cComponent implements OnInit {
  token;

  data;

  returnUrl;

  userDecr;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tokenService: TokenService,
    private accService: AccountService,
    private loaderService: LoaderService,
    private cookie: CookieService,
  ) {}

  ngOnInit(): void {
    // this.loaderService.showSpinner(true);
    // this.route.params.subscribe(params => {
    //   if (params.token) {
    //     // this.loaderService.showSpinner(true);
    //     this.token = params.token;
    //     // this.data = params.query;
    //     // sessionStorage.setItem('user', this.data);
    //     if (this.token.indexOf('Bearer ') > -1) {
    //       this.token = this.token.substring(7, this.token.length);
    //       this.tokenService.token = this.token;
    //     }
    //     // this.tokenService.token = this.token;
    //     this.tokenService.isTokenSubject.next(this.token);
    //     // this.router.navigate(['/quickquote']);
    //   }

    //   else {
    //     this.token = null;
    //   }
    // });

    this.tokenService.token = true;
    console.log(this.tokenService.token, 'inside b2c');

    this.route.queryParams.subscribe((params) => {
      this.data = params;
      sessionStorage.setItem('user', aesEncrypt(JSON.stringify(this.data.payload)));
      // console.log('local -', sessionStorage.getItem('user'));
      this.returnUrl = sessionStorage.getItem('currentUrl');

      this.accService.setUser(this.data);
      console.log(this.data, 'inside b2c');
      if (this.data.orgCode == 'DCB') {
        console.log('ll', this.accService.userValue);
        this.navigateDcb();
      } else {
        if (this.data.bankCustomer == 'false' && this.data.insurerUser == 'false') {
          this.router.navigate(['/mycustomers']);
        } else if (this.data.bankCustomer == 'true') {
          this.router.navigate(['/quickquote']);
        }
      }
    });
  }

  navigateDcb() {
    console.log('insinde ', this.data, this.returnUrl);
    const user = JSON.parse(
      CryptoJS.AES.decrypt(this.data.payload, 'ysecretkeyyy098!').toString(CryptoJS.enc.Utf8),
    );

    // const user = this.accService.userValue;
    // this.accService.user.subscribe((user) => {
    this.userDecr = user;
    console.log(user);

    let isAdminUser = user['userGroups'].includes('ADMIN') ? true : false;
    let isUamUser = user['userGroups'].includes('UAM_USER') ? true : false;

    console.log('TODAY login', isAdminUser, isUamUser, this.returnUrl, user);

    if (isUamUser) {
      this.router.navigate(['uam']);
    } else if (isAdminUser) {
      this.router.navigate(['lms']);
    } else if (this.userDecr.isSP == 'true') {
      this.router.navigate(['/mycustomers']);
    } else {
      this.router.navigate(['lms']);
    }
    // });
    // let user = JSON.stringify(this.data);
    // console.log('TODAY login', isAdminUser, isUamUser, this.returnUrl, user);
  }
}
