import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, ActivatedRoute } from '@angular/router';
import { TokenService } from '@app/_services';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PolicyConcentGuard implements CanActivate {

  constructor(private tokenService: TokenService, private router: Router, private route: ActivatedRoute) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // return true;
    const token = this.tokenService.hasToken();
    console.log(state.url.split('/')[2]);
    if (state.url.indexOf('getPolicyForConsent') === -1) {
      return this.router.createUrlTree(['/account/login']);
    } else {
      return true;
    }
  }

}
