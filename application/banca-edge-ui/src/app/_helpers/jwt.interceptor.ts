import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@environments/environment';
import { AccountService, TokenService } from '@app/_services';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private accountService: AccountService, private tokenService: TokenService, private cookieService: CookieService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const user = this.accountService.userValue;

    const isApiUrl = request.url.indexOf(environment.apiUrl) > -1;
    if (this.tokenService.token && isApiUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.cookieService.get('token')}`,
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          Pragma: 'no-cache',
          Expires: 'Mon, 23 Aug 1982 12:00:00 GMT'
        }
      });
    }

    return next.handle(request);
  }
}
