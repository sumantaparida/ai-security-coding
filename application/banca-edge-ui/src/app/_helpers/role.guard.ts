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

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(
    private router: Router,
    private accountService: AccountService,
    private tokenService: TokenService,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const user = this.accountService.userValue;
    if (user && this.tokenService.token) {
      const roles: string[] = user.roles;
      const userGroups = user['userGroups'];
      console.log('user in roles', user, userGroups);
      if (route.data.roles) {
        if (route.data.roles.some((ai) => roles.indexOf(ai) > -1)) {
          return true;
        } else {
          if (route.url.toString() === 'mycustomers') {
            return this.router.parseUrl('/policyvault');
          } else {
            return false;
          }
        }
      } else if (route.data.userGroups) {
        console.log('user in roles', user, userGroups);

        if (route.data.userGroups.some((user) => userGroups.indexOf(user) > -1)) {
          return true;
        }
        return this.router.parseUrl('/mycustomers');
      } else {
        return true;
      }
    } else {
      this.accountService.cleanup();
      return this.router.createUrlTree(['/account/login']);

      // this.accountService.logout().subscribe(
      //   () => {
      //     console.log('loggin out from role guard');
      //     return this.router.createUrlTree(['/account/login']);
      //   },
      //   (err) => {
      //     return this.router.createUrlTree(['/account/login']);
      //   },
      // );
    }
  }
}
