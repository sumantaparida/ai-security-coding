import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AccountService, AlertService, TokenService } from '@app/_services';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private accountService: AccountService,
    private alertService: AlertService,
    private tokenService: TokenService,
    private router: Router,
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (err.status === 401) {
          console.log('coming in 401', err);
          this.accountService.cleanup();
          this.router.navigateByUrl('/account/login');

          // this.accountService.logout().subscribe(() => {
          //   this.tokenService.removeToken();
          //   this.router.navigateByUrl('/account/login');
          // });
          const messageTxt = err.error?.message ? err.error?.message : "Invalid user or password or already logged in"
          return throwError({ message: messageTxt });
        }
        // if (err.status == 400) {
        //   const error = (err.error.details.join('\n') + err.error.message) || "Client Error";

        //   console.log("400 HTTP ERROR" + error);
        //   return throwError("Please fix errors " + error);
        // }
        else if (err.status === 500) {
          console.log('insinde erroe interceptor');
          const error = err.error.message || 'Server Error';
          return throwError('Sorry the server was unable to process your request ' + error);
        } else if (err.status === 309) {
          return throwError({ message: 'Already logged in, please logout from previous session' });
        } else if (err.status === 405) {
          return throwError({ message: 'User not found' });
        } else if (err.status === 406) {
          console.log('coming in 406', err);
          const messageTxt = err.error?.returnMessage ? err.error?.returnMessage : "The new password cannot be the same as your previous password. Please choose a different password";
          return throwError({ message: messageTxt });
        } else if (err.status === 502) {
          console.log('coming in 502', err);
          return throwError({ message: 'Invalid user or password' });
        } else if (err.status === 403) {
          return throwError({ message: 'Invalid user or password' });
        } else if (err.status === 429) {
          return throwError({ message: ' Request Limit exceed, please try after some time' });
        }

        if (err) {
          // const error = err.error.message || "General Error";
          // console.log(error);
          return throwError(err.error);
        } else {
          return throwError('Unknown Error');
        }
      }),
    );
  }
}
