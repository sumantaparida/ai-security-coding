import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { AccountService, TokenService } from '@app/_services';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private router: Router,
    private accountService: AccountService,
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token = this.tokenService.token;
    // const token = this.tokenService.hasToken;
    const user = this.accountService.userValue;
    console.log('coming in login guard', token);
    if (token) {
      console.log('insinde token');
      return this.router.createUrlTree(['mycustomers']);
    } else {
      console.log('coming in login insinde else');

      // return this.router.createUrlTree(['account/login']);
      return true;
    }
  }
}
