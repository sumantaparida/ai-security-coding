import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';

import { AccountService, TokenService } from '@app/_services';
import { Observable } from 'rxjs';
// import { BlockerService } from '@app/_services';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  currentUrl;

  constructor(
    private router: Router,
    private accountService: AccountService,
    private tokenService: TokenService,
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token = this.tokenService.hasToken();
    const user = this.accountService.userValue;
    if (state.url.indexOf('/account/login') === -1 && state.url.indexOf('/b2c') === -1) {
      this.currentUrl = state.url;
      sessionStorage.setItem('currentUrl', this.currentUrl);
    }
    if (token && user) {
      return true;
    } else {
      console.log('inisde auth guard');
      this.accountService.cleanup();

      // this.accountService.logout().subscribe(
      //   () => {
      //     // this.accountService.cleanup;
      //     return this.router.createUrlTree(['/account/login']);
      //   },
      //   (error) => {
      //     return this.router.createUrlTree(['/account/login']);
      //   },
      //   // () => {
      //   //   // this.accountService.cleanup;

      //   //   return this.router.createUrlTree(['/account/login']);
      //   // },
      // );
    }
    // else if (state.url.indexOf('/b2c') > -1) {
    // 	const tokenB2C = state.url.split('/')[2];
    // 	this.tokenService.token = tokenB2C;
    // 	this.tokenService.isTokenSubject.next(tokenB2C);
    // 	// this.router.navigateByUrl('/quickquote');
    // 	return true;
    // } else {
    // 	this.tokenService.isTokenSubject.next(null);
    // 	return this.router.createUrlTree(['/account/login']);
    // }
  }
}
